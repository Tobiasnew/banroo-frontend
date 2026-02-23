// src/pages/MatchResult.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const fakeMatch = {
  name: "Luna K.",
  instrument: "Gesang",
  genre: "Indie",
  goal: "Start a Roo",
  location: "Berlin, DE",
  bio: "Ich schreibe seit 3 Jahren Songs und suche jemanden der den Beat dazu liefert. Lass uns was Echtes bauen.",
  avatar: "🎤",
};

function MatchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const selected = location.state || {};

  const handleStartRoo = async () => {
    const { error } = await supabase.from("roos").insert({
      user_id: user.id,
      title: `${selected.genre || "Neuer"} Roo`,
      genre: selected.genre || "Unbekannt",
      status: "Idee",
    });

    if (error) {
      console.error("Fehler beim Speichern:", error.message);
      return;
    }

    navigate("/app");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: theme.colors.background,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.xl,
    }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>

        <p style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.sm }}>
          ✦ Match gefunden
        </p>

        <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.xl }}>
          Dein Roo-Partner wartet.
        </h1>

        {/* Card */}
        <div style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
        }}>
          <div style={{ fontSize: "64px", marginBottom: theme.spacing.md }}>{fakeMatch.avatar}</div>

          <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.xs }}>
            {fakeMatch.name}
          </h2>

          <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.md }}>
            {fakeMatch.location}
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: theme.spacing.sm, flexWrap: "wrap", marginBottom: theme.spacing.lg }}>
            {[fakeMatch.instrument, fakeMatch.genre, fakeMatch.goal].map(tag => (
              <span key={tag} style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: `1px solid ${theme.colors.primary}`,
                backgroundColor: "rgba(124, 58, 237, 0.15)",
                color: theme.colors.textPrimary,
                fontSize: theme.fontSizes.sm,
              }}>
                {tag}
              </span>
            ))}
          </div>

          <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, lineHeight: "1.6" }}>
            "{fakeMatch.bio}"
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: theme.spacing.md }}>
          <button
            onClick={() => navigate("/match")}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.surface,
              color: theme.colors.textSecondary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fontSizes.md,
              cursor: "pointer",
            }}
          >
            Weiter suchen
          </button>

          <button
            onClick={handleStartRoo}
            style={{
              flex: 1,
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
            Roo starten 🎵
          </button>
        </div>

      </div>
    </div>
  );
}

export default MatchResult;