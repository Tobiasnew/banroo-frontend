// src/pages/Listener.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";

const genres = ["Alle", "Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "R&B", "Metal", "Indie"];

export default function Listener() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("Alle");
  const [playingId, setPlayingId] = useState(null);

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
              instrument
            )
          )
        `)
        .order("created_at", { ascending: false });

      console.log("tracks data:", data);
      console.log("tracks error:", error);
      if (!error) setTracks(data || []);
      setLoading(false);
    };

    fetchTracks();
  }, []);

  const handlePlay = async (track) => {
    setPlayingId(track.id);
    await supabase
      .from("published_tracks")
      .update({ play_count: (track.play_count || 0) + 1 })
      .eq("id", track.id);
  };

  const filteredTracks = activeGenre === "Alle"
    ? tracks
    : tracks.filter(t => t.genre === activeGenre);

  const topTracks = [...tracks]
    .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
    .slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.colors.background }}>

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
        <p style={{ color: theme.colors.textSecondary, maxWidth: "500px", margin: "0 auto" }}>
          Alle Songs wurden von Musikern auf Banroo gemeinsam produziert.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Top Songs */}
        {topTracks.length > 0 && (
          <div style={{ marginBottom: theme.spacing.xl }}>
            <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.lg, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.lg }}>
              🔥 Top Songs
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
              {topTracks.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  index={index + 1}
                  isPlaying={playingId === track.id}
                  onPlay={() => handlePlay(track)}
                  onArtistClick={(artistId) => navigate(`/profile/${artistId}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Genre Filter */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.lg, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.lg }}>
            🎵 Nach Genre
          </h2>
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
            <p style={{ color: theme.colors.textSecondary }}>Lädt...</p>
          ) : filteredTracks.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: "center", marginTop: "40px" }}>
              Noch keine Songs in diesem Genre.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
              {filteredTracks.map((track, index) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  index={index + 1}
                  isPlaying={playingId === track.id}
                  onPlay={() => handlePlay(track)}
                  onArtistClick={(artistId) => navigate(`/profile/${artistId}`)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function TrackCard({ track, index, isPlaying, onPlay, onArtistClick }) {
  const artists = track.published_track_artists || [];

  return (
    <div style={{
      backgroundColor: theme.colors.surface,
      border: `1px solid ${isPlaying ? theme.colors.primary : theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.lg,
      transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <span style={{ color: theme.colors.textMuted, fontSize: theme.fontSizes.sm, width: "20px", flexShrink: 0 }}>
          {index}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, margin: 0, marginBottom: "4px" }}>
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
      </div>

      {/* Audio Player */}
      <audio
        controls
        src={track.file_url}
        onPlay={onPlay}
        style={{ width: "100%", height: "36px", marginBottom: theme.spacing.md }}
      />

      {/* Künstler */}
      {artists.length > 0 && (
        <div style={{ display: "flex", gap: theme.spacing.sm, flexWrap: "wrap" }}>
          {artists.map(a => a.profiles && (
            <div
              key={a.user_id}
              onClick={() => onArtistClick(a.profiles.id)}
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
              onMouseEnter={e => e.currentTarget.style.borderColor = theme.colors.primary}
              onMouseLeave={e => e.currentTarget.style.borderColor = theme.colors.border}
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
                {a.profiles.avatar_url
                  ? <img src={a.profiles.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "🎵"
                }
              </div>
              <span style={{ color: theme.colors.textSecondary, fontSize: "13px" }}>
                {a.profiles.username || "Unbekannt"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}