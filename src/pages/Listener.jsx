// src/pages/Listener.jsx
import { useEffect, useState, useMemo, useRef, useCallback, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import AudioPlayer from "../components/AudioPlayer";

const genres = ["Alle", "Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "R&B", "Metal", "Indie"];

// Play-Count wird pro Tag und Track nur einmal gezählt (Client-seitig, kein DB-Schema nötig)
const PLAY_COUNT_STORAGE_KEY = "banroo_play_counted";

function loadCountedToday() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const stored = JSON.parse(localStorage.getItem(PLAY_COUNT_STORAGE_KEY));
    if (stored?.date === today && Array.isArray(stored.ids)) return new Set(stored.ids);
  } catch { /* defekter Eintrag – neu anfangen */ }
  return new Set();
}

function saveCountedToday(ids) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    localStorage.setItem(PLAY_COUNT_STORAGE_KEY, JSON.stringify({ date: today, ids: [...ids] }));
  } catch { /* Storage voll/blockiert – dann zählen wir halt nicht */ }
}

// Selten gehörte Tracks bekommen höhere Gewichte, damit nicht immer die Top 3 kommen
function pickWeightedRandom(list, excludeId) {
  const candidates = list.length > 1 ? list.filter(t => t.id !== excludeId) : list;
  if (candidates.length === 0) return null;
  const weights = candidates.map(t => 1 / ((t.play_count || 0) + 1));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Listener() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("Alle");
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Deep-Link (/listen?track=<id>): Track wird direkt hervorgehoben und nach dem Laden angescrollt
  const [highlightId, setHighlightId] = useState(() => searchParams.get("track"));
  // Queue = Listen-Kontext zum Zeitpunkt des Abspielens (bleibt stabil bei Filterwechsel)
  const [queue, setQueue] = useState([]);

  // Refs, damit die Play-Callbacks stabil bleiben (memo auf den TrackCards greift)
  const currentTrackIdRef = useRef(null);
  const countedRef = useRef(null);

  useEffect(() => {
    currentTrackIdRef.current = currentTrackId;
  }, [currentTrackId]);

  useEffect(() => {
    const fetchTracks = async () => {
      const { data, error } = await supabase
        .from("published_tracks")
        .select(`
          *,
          published_track_artists (
            user_id,
            profiles (
              id,
              username,
              avatar_url,
              instrument,
              instagram,
              spotify,
              soundcloud
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (!error) setTracks(data || []);
      setLoading(false);
    };

    fetchTracks();
  }, []);

  const countPlay = useCallback((track) => {
    if (!countedRef.current) countedRef.current = loadCountedToday();
    if (countedRef.current.has(track.id)) return;
    countedRef.current.add(track.id);
    saveCountedToday(countedRef.current);

    const newCount = (track.play_count || 0) + 1;
    setTracks(prev => prev.map(t => (t.id === track.id ? { ...t, play_count: newCount } : t)));
    supabase.from("published_tracks").update({ play_count: newCount }).eq("id", track.id).then(() => {});
  }, []);

  const playTrack = useCallback((track, newQueue) => {
    setQueue(newQueue);
    setCurrentTrackId(track.id);
    setIsPlaying(true);
    countPlay(track);
  }, [countPlay]);

  const toggleTrack = useCallback((track, queue) => {
    if (currentTrackIdRef.current === track.id) {
      setIsPlaying(p => !p);
    } else {
      playTrack(track, queue);
    }
  }, [playTrack]);

  const stepQueue = useCallback((dir) => {
    const idx = queue.findIndex(t => t.id === currentTrackIdRef.current);
    const next = idx === -1 ? null : queue[idx + dir];
    if (next) {
      setCurrentTrackId(next.id);
      setIsPlaying(true);
      countPlay(next);
    } else {
      setIsPlaying(false);
    }
  }, [queue, countPlay]);

  const filteredTracks = useMemo(
    () => (activeGenre === "Alle" ? tracks : tracks.filter(t => t.genre === activeGenre)),
    [tracks, activeGenre]
  );

  const filteredTracksRef = useRef([]);
  useEffect(() => {
    filteredTracksRef.current = filteredTracks;
  }, [filteredTracks]);

  // Stabiler Callback für die Listen-Karten: Queue ist immer die aktuell gefilterte Liste
  const toggleFromList = useCallback((track) => {
    toggleTrack(track, filteredTracksRef.current);
  }, [toggleTrack]);

  const handleArtistClick = useCallback((artistId) => {
    navigate(`/profile/${artistId}`);
  }, [navigate]);

  const topTracks = useMemo(
    () => [...tracks]
      .filter(t => (t.play_count || 0) > 0)
      .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
      .slice(0, 3),
    [tracks]
  );

  // Zufalls-Discovery: gewichteter Pick + zufällige Weiterreise über die Queue
  const playRandomFrom = useCallback((pool) => {
    const pick = pickWeightedRandom(pool, currentTrackIdRef.current);
    if (!pick) return;
    playTrack(pick, [pick, ...shuffle(pool.filter(t => t.id !== pick.id))]);
  }, [playTrack]);

  // Deep-Link: nach dem Laden zum geteilten Track scrollen, Hervorhebung nach 4s ausblenden
  const sharedTrackId = searchParams.get("track");
  useEffect(() => {
    if (loading || !sharedTrackId) return;
    const el = document.getElementById(`track-${sharedTrackId}`);
    if (!el) return;
    // Beim Seitenaufruf direkt hinspringen – smooth wird nicht überall zuverlässig ausgeführt
    el.scrollIntoView({ block: "center" });
    const timer = setTimeout(() => setHighlightId(null), 4000);
    return () => clearTimeout(timer);
  }, [loading, sharedTrackId]);

  const currentTrack = useMemo(
    () => tracks.find(t => t.id === currentTrackId) || null,
    [tracks, currentTrackId]
  );

  const queueIndex = currentTrack
    ? queue.findIndex(t => t.id === currentTrack.id)
    : -1;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: theme.colors.background,
      paddingBottom: currentTrack ? "110px" : 0,
    }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(245, 158, 11, 0.1) 100%)",
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: "60px 20px",
        textAlign: "center",
      }}>
        <p style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.semibold, fontSize: theme.fontSizes.sm, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: theme.spacing.sm }}>
          ♩♪ Banroo Sounds
        </p>
        <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.sm }}>
          Musik die hier entstand
        </h1>
        <p style={{ color: theme.colors.textSecondary, maxWidth: "500px", margin: "0 auto", marginBottom: theme.spacing.lg }}>
          Alle Songs wurden von Musikern auf Banroo gemeinsam produziert.
        </p>
        <button
          onClick={() => playRandomFrom(tracks)}
          disabled={loading || tracks.length === 0}
          style={{
            padding: "14px 28px",
            borderRadius: theme.borderRadius.full,
            border: "none",
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 130%)`,
            color: "#fff",
            fontWeight: theme.fontWeights.semibold,
            fontSize: theme.fontSizes.md,
            cursor: loading || tracks.length === 0 ? "default" : "pointer",
            opacity: loading || tracks.length === 0 ? 0.5 : 1,
            transition: "transform 0.15s, opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          🎲 Überrasch mich
        </button>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Top Songs – kompakte Rangliste, abgespielt wird über den globalen Player */}
        {topTracks.length > 0 && (
          <div style={{ marginBottom: theme.spacing.xl }}>
            <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.lg, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.lg }}>
              🔥 Top Songs
            </h2>
            <div style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              overflow: "hidden",
            }}>
              {topTracks.map((track, index) => (
                <TopTrackRow
                  key={track.id}
                  track={track}
                  rank={index + 1}
                  isLast={index === topTracks.length - 1}
                  playState={currentTrackId === track.id ? (isPlaying ? "playing" : "paused") : "none"}
                  onToggle={() => toggleTrack(track, topTracks)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Genre Filter + Shuffle */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
            <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.lg, fontWeight: theme.fontWeights.bold, margin: 0 }}>
              🎵 Nach Genre
            </h2>
            <button
              onClick={() => playRandomFrom(filteredTracks)}
              disabled={filteredTracks.length === 0}
              style={{
                padding: "8px 16px",
                borderRadius: theme.borderRadius.full,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: "transparent",
                color: theme.colors.textSecondary,
                cursor: filteredTracks.length === 0 ? "default" : "pointer",
                fontSize: theme.fontSizes.sm,
                opacity: filteredTracks.length === 0 ? 0.5 : 1,
                whiteSpace: "nowrap",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.color = theme.colors.textPrimary;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.textSecondary;
              }}
            >
              🔀 Shuffle
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
            {genres.map(g => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: `1px solid ${activeGenre === g ? theme.colors.primary : theme.colors.border}`,
                  backgroundColor: activeGenre === g ? `${theme.colors.primary}22` : "transparent",
                  color: activeGenre === g ? "#fff" : theme.colors.textSecondary,
                  cursor: "pointer",
                  fontSize: theme.fontSizes.sm,
                  transition: "all 0.2s",
                }}
              >
                {g}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: "center", padding: "40px 0" }}>
              Lädt Songs...
            </p>
          ) : filteredTracks.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: "center", padding: "40px 0" }}>
              Noch keine Songs in diesem Genre.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
              {filteredTracks.map(track => (
                <TrackCard
                  key={track.id}
                  track={track}
                  playState={currentTrackId === track.id ? (isPlaying ? "playing" : "paused") : "none"}
                  highlighted={highlightId === track.id}
                  onToggle={toggleFromList}
                  onArtistClick={handleArtistClick}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      <AudioPlayer
        key={currentTrack?.id}
        track={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(p => !p)}
        onNext={() => stepQueue(1)}
        onPrev={() => stepQueue(-1)}
        onEnded={() => stepQueue(1)}
        hasNext={queueIndex !== -1 && queueIndex < queue.length - 1}
        hasPrev={queueIndex > 0}
      />
    </div>
  );
}

function TopTrackRow({ track, rank, isLast, playState, onToggle }) {
  const isActive = playState !== "none";
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md,
        padding: "12px 16px",
        borderBottom: isLast ? "none" : `1px solid ${theme.colors.border}`,
        cursor: "pointer",
        backgroundColor: isActive ? `${theme.colors.primary}11` : "transparent",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = theme.colors.surfaceHover; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? `${theme.colors.primary}11` : "transparent"; }}
    >
      <span style={{
        color: theme.colors.accent,
        fontWeight: theme.fontWeights.bold,
        fontSize: theme.fontSizes.md,
        width: "20px",
        flexShrink: 0,
      }}>
        {rank}
      </span>
      <span style={{ color: theme.colors.textSecondary, fontSize: "14px", flexShrink: 0 }}>
        {playState === "playing" ? "⏸" : "▶"}
      </span>
      <span style={{
        flex: 1,
        minWidth: 0,
        color: theme.colors.textPrimary,
        fontWeight: theme.fontWeights.semibold,
        fontSize: "14px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {track.title}
      </span>
      <span style={{ color: theme.colors.textMuted, fontSize: "12px", flexShrink: 0 }}>
        {track.play_count || 0} Plays
      </span>
    </div>
  );
}

const cleanHandle = (val, prefix) => {
  if (!val) return "";
  return val.replace(prefix, "").replace(/\/$/, "");
};

const TrackCard = memo(function TrackCard({ track, playState, highlighted, onToggle, onArtistClick }) {
  const [copied, setCopied] = useState(false);
  const artists = track.published_track_artists || [];
  const isActive = playState !== "none";

  const handleShare = async () => {
    const url = `${window.location.origin}/listen?track=${track.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${track.title} – Banroo Sounds`, url });
      } catch { /* User hat das Share-Sheet geschlossen */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* Clipboard blockiert */ }
    }
  };

  return (
    <div
      id={`track-${track.id}`}
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${highlighted ? theme.colors.accent : isActive ? theme.colors.primary : theme.colors.border}`,
        boxShadow: highlighted ? `0 0 0 3px ${theme.colors.accent}33` : "none",
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.md }}>
        <button
          onClick={() => onToggle(track)}
          aria-label={playState === "playing" ? "Pause" : "Abspielen"}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: isActive ? theme.colors.primary : `${theme.colors.primary}22`,
            border: `1px solid ${theme.colors.primary}`,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            flexShrink: 0,
            transition: "background-color 0.2s",
          }}
        >
          {playState === "playing" ? "⏸" : "▶"}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            color: theme.colors.textPrimary,
            fontWeight: theme.fontWeights.semibold,
            margin: 0,
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {track.title}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.sm }}>
            <span style={{
              padding: "2px 10px",
              borderRadius: "999px",
              backgroundColor: `${theme.colors.primary}22`,
              border: `1px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
              fontSize: "12px",
            }}>
              {track.genre}
            </span>
            <span style={{ color: theme.colors.textMuted, fontSize: "12px" }}>
              {track.play_count || 0} Plays
            </span>
          </div>
        </div>

        <button
          onClick={handleShare}
          aria-label="Track teilen"
          title={copied ? "Link kopiert!" : "Track teilen"}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "transparent",
            border: `1px solid ${copied ? theme.colors.success : theme.colors.border}`,
            color: copied ? theme.colors.success : theme.colors.textSecondary,
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { if (!copied) e.currentTarget.style.borderColor = theme.colors.primary; }}
          onMouseLeave={e => { if (!copied) e.currentTarget.style.borderColor = theme.colors.border; }}
        >
          {copied ? "✓" : "🔗"}
        </button>
      </div>

      {/* Künstler mit Social-Links */}
      {artists.length > 0 && (
        <div style={{ display: "flex", gap: theme.spacing.sm, flexWrap: "wrap", marginTop: theme.spacing.md }}>
          {artists.map(a => a.profiles && (
            <ArtistChip
              key={a.user_id}
              profile={a.profiles}
              onClick={() => onArtistClick(a.profiles.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

function ArtistChip({ profile, onClick }) {
  const instaHandle = cleanHandle(profile.instagram, /^https?:\/\/(www\.)?instagram\.com\//);
  const spotifyHandle = cleanHandle(profile.spotify, /^https?:\/\/open\.spotify\.com\/artist\//);
  const soundcloudHandle = cleanHandle(profile.soundcloud, /^https?:\/\/(www\.)?soundcloud\.com\//);

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 12px",
        borderRadius: "999px",
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = theme.colors.primary)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = theme.colors.border)}
    >
      <div style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        backgroundColor: `${theme.colors.primary}33`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        flexShrink: 0,
      }}>
        {profile.avatar_url
          ? <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : "🎵"
        }
      </div>
      <span style={{ color: theme.colors.textSecondary, fontSize: "13px" }}>
        {profile.username || "Unbekannt"}
      </span>
      {instaHandle && (
        <SocialIcon url={`https://instagram.com/${instaHandle}`} label="Instagram">📷</SocialIcon>
      )}
      {spotifyHandle && (
        <SocialIcon url={`https://open.spotify.com/artist/${spotifyHandle}`} label="Spotify">🎧</SocialIcon>
      )}
      {soundcloudHandle && (
        <SocialIcon url={`https://soundcloud.com/${soundcloudHandle}`} label="SoundCloud">☁️</SocialIcon>
      )}
    </div>
  );
}

function SocialIcon({ url, label, children }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={e => e.stopPropagation()}
      style={{ fontSize: "13px", textDecoration: "none", lineHeight: 1 }}
    >
      {children}
    </a>
  );
}
