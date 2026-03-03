// src/pages/MatchResult.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function MatchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const selected = location.state || {};

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findMatch = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("genre", `%${selected.genre}%`)
        .neq("id", user.id)
        .limit(10);

      if (error) {
        console.error("Fehler beim Matching:", error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const random = data[Math.floor(Math.random() * data.length)];
        setMatch(random);
      } else {
        const { data: fallback } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", user.id)
          .limit(5);

        if (fallback && fallback.length > 0) {
          setMatch(fallback[Math.floor(Math.random() * fallback.length)]);
        }
      }

      setLoading(false);
    };

    findMatch();
  }, []);

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

  const avatarUrl = match?.avatar_url || null;

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

        <div style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          marginBottom: theme.spacing.lg,
        }}>

          {loading ? (
            <p style={{ color: theme.colors.textSecondary }}>Suche nach deinem Match...</p>
          ) : !match ? (
            <p style={{ color: theme.colors.textSecondary }}>Kein Match gefunden. Sei der Erste!</p>
          ) : (
            <>
              <div style={{ marginBottom: theme.spacing.md }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `2px solid ${theme.colors.primary}`,
                    }}
                  />
                ) : (
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(124, 58, 237, 0.2)",
                    border: `2px solid ${theme.colors.primary}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    margin: "0 auto",
                  }}>
                    🎵
                  </div>
                )}
              </div>

              <h2
                onClick={() => navigate(`/profile/${match.id}`)}
                style={{
                  color: theme.colors.textPrimary,
                  fontSize: theme.fontSizes.xl,
                  fontWeight: theme.fontWeights.bold,
                  marginBottom: theme.spacing.xs,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textDecorationColor: theme.colors.primary,
                }}
              >
                {match.username || "Unbekannt"}
              </h2>

              <div style={{ display: "flex", justifyContent: "center", gap: theme.spacing.sm, flexWrap: "wrap", marginBottom: theme.spacing.lg }}>
                {[match.instrument, match.genre, selected.goal].filter(Boolean).map(tag => (
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

              {match.bio && (
                <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, lineHeight: "1.6" }}>
                  "{match.bio}"
                </p>
              )}
            </>
          )}
        </div>

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
            disabled={loading || !match}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              backgroundColor: !loading && match ? theme.colors.primary : theme.colors.surface,
              color: !loading && match ? "#fff" : theme.colors.textMuted,
              border: "none",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fontSizes.md,
              fontWeight: theme.fontWeights.semibold,
              cursor: !loading && match ? "pointer" : "not-allowed",
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