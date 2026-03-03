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

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>

      <button
        onClick={() => navigate(-1)}
        style={{ background: "none", border: "none", color: theme.colors.textSecondary, cursor: "pointer", fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.xl, padding: 0 }}
      >
        ← Zurück
      </button>

      {/* Avatar + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.primary}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
          flexShrink: 0,
        }}>
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "🎵"
          }
        </div>
        <div>
          <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold, margin: 0, marginBottom: "4px" }}>
            {profile.username || "Unbekannt"}
          </h1>
          <div style={{ display: "flex", gap: theme.spacing.sm, flexWrap: "wrap" }}>
            {profile.instrument && (
              <span style={tag}>{profile.instrument}</span>
            )}
            {profile.genre && (
              <span style={tag}>{profile.genre}</span>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.xl,
        }}>
          <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.md, lineHeight: "1.6", margin: 0 }}>
            "{profile.bio}"
          </p>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm }}>
        <button
          onClick={() => navigate(`/chat/${profile.id}`)}
          style={{
            width: "100%",
            padding: theme.spacing.md,
            backgroundColor: theme.colors.primary,
            color: "#fff",
            border: "none",
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semibold,
            cursor: "pointer",
          }}
        >
          Nachricht schreiben 💬
        </button>

        <button
          onClick={() => navigate("/match")}
          style={{
            width: "100%",
            padding: theme.spacing.md,
            backgroundColor: "transparent",
            color: theme.colors.primary,
            border: `1px solid ${theme.colors.primary}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semibold,
            cursor: "pointer",
          }}
        >
          Roo zusammen starten 🎵
        </button>
      </div>

    </div>
  );
}

const tag = {
  padding: "6px 14px",
  borderRadius: "999px",
  border: "1px solid #7C3AED",
  backgroundColor: "rgba(124, 58, 237, 0.15)",
  color: "#ffffff",
  fontSize: "13px",
};