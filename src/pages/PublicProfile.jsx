// src/pages/PublicProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div style={{ padding: "40px", color: theme.colors.textSecondary }}>Lädt...</div>
  );

  if (!profile) return (
    <div style={{ padding: "40px", color: theme.colors.textSecondary }}>Profil nicht gefunden.</div>
  );

  const instruments = profile.instruments?.length > 0
    ? profile.instruments
    : profile.instrument ? [profile.instrument] : [];

  const genres = profile.genres?.length > 0
    ? profile.genres
    : profile.genre ? [profile.genre] : [];

  const cleanHandle = (val, prefix) => {
    if (!val) return "";
    return val.replace(prefix, "").replace(/\/$/, "");
  };

  const instaHandle = cleanHandle(profile.instagram, /^https?:\/\/(www\.)?instagram\.com\//);
  const spotifyHandle = cleanHandle(profile.spotify, /^https?:\/\/open\.spotify\.com\/artist\//);
  const soundcloudHandle = cleanHandle(profile.soundcloud, /^https?:\/\/(www\.)?soundcloud\.com\//);
  const hasSocials = instaHandle || spotifyHandle || soundcloudHandle;

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 20px 80px" }}>

      <button
        onClick={() => navigate(-1)}
        style={{ background: "none", border: "none", color: theme.colors.textSecondary, cursor: "pointer", fontSize: theme.fontSizes.sm, marginBottom: "32px", padding: 0 }}
      >
        ← Zurück
      </button>

      <div style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
          <div style={styles.avatar}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : "🎵"
            }
          </div>
          <div>
            <h1 style={{ color: theme.colors.textPrimary, fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: theme.fontWeights.bold, margin: 0, marginBottom: "6px" }}>
              {profile.username || "Unbekannt"}
            </h1>
            {profile.experience && (
              <span style={styles.experienceBadge}>{profile.experience}</span>
            )}
          </div>
        </div>

        {instruments.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <p style={styles.smallLabel}>Instrumente</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {instruments.map(inst => (
                <span key={inst} style={styles.tag}>{inst}</span>
              ))}
            </div>
          </div>
        )}

        {genres.length > 0 && (
          <div>
            <p style={styles.smallLabel}>Genres</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {genres.map(genre => (
                <span key={genre} style={styles.tag}>{genre}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {profile.bio && (
        <div style={styles.card}>
          <p style={styles.smallLabel}>Über mich</p>
          <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.md, lineHeight: "1.7", margin: 0 }}>
            {profile.bio}
          </p>
        </div>
      )}

      {hasSocials && (
        <div style={styles.card}>
          <p style={styles.smallLabel}>Social Links</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {instaHandle && (
              <SocialButton url={"https://instagram.com/" + instaHandle} icon="📷" label="Instagram" />
            )}
            {spotifyHandle && (
              <SocialButton url={"https://open.spotify.com/artist/" + spotifyHandle} icon="🎧" label="Spotify" />
            )}
            {soundcloudHandle && (
              <SocialButton url={"https://soundcloud.com/" + soundcloudHandle} icon="☁️" label="SoundCloud" />
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button onClick={() => navigate("/chat/" + profile.id)} style={styles.primaryButton}>
          Nachricht schreiben 💬
        </button>
        <button onClick={() => navigate("/match")} style={styles.secondaryButton}>
          Roo zusammen starten 🎵
        </button>
      </div>
    </div>
  );
}

function SocialButton({ url, icon, label }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
      <span style={styles.socialIcon}>{icon}</span>
      <span>{label}</span>
      <span style={styles.socialArrow}>↗</span>
    </a>
  );
}

const styles = {
  card: {
    backgroundColor: theme.colors.surface,
    border: "1px solid " + theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: "28px",
    marginBottom: "20px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: theme.colors.background,
    border: "3px solid " + theme.colors.primary,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    flexShrink: 0,
  },
  smallLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tag: {
    padding: "6px 14px",
    borderRadius: "999px",
    border: "1px solid " + theme.colors.primary,
    backgroundColor: theme.colors.primary + "22",
    color: "#fff",
    fontSize: "13px",
  },
  experienceBadge: {
    padding: "4px 12px",
    borderRadius: "999px",
    border: "1px solid " + theme.colors.accent,
    backgroundColor: theme.colors.accent + "22",
    color: theme.colors.accent,
    fontSize: "12px",
    fontWeight: "600",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    backgroundColor: theme.colors.background,
    border: "1px solid " + theme.colors.border,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.textPrimary,
    textDecoration: "none",
    fontSize: theme.fontSizes.md,
  },
  socialIcon: {
    fontSize: "20px",
  },
  socialArrow: {
    marginLeft: "auto",
    color: theme.colors.textMuted,
  },
  primaryButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "transparent",
    color: theme.colors.primary,
    border: "1px solid " + theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    cursor: "pointer",
  },
};