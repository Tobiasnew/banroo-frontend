// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const statusColor = {
  "In Progress": theme.colors.primary,
  "Idee": theme.colors.accent,
  "Fertig": theme.colors.success,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roos, setRoos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoos = async () => {
      const { data, error } = await supabase
        .from("roos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setRoos(data);
      setLoading(false);
    };

    fetchRoos();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>

      <div style={{ marginBottom: theme.spacing.xl }}>
        <p style={{ color: theme.colors.primary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.semibold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
          ✦ Willkommen zurück
        </p>
        <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: "8px" }}>
          Deine Roos
        </h1>
        <p style={{ color: theme.colors.textSecondary }}>
          {user?.email}
        </p>
      </div>

      <button
        onClick={() => navigate("/match")}
        style={{
          width: "100%",
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: theme.borderRadius.md,
          fontSize: theme.fontSizes.md,
          fontWeight: theme.fontWeights.semibold,
          cursor: "pointer",
          marginBottom: theme.spacing.xl,
          textAlign: "left",
        }}
      >
        + Neuen Roo starten →
      </button>

      {loading ? (
        <p style={{ color: theme.colors.textSecondary }}>Lädt...</p>
      ) : roos.length === 0 ? (
        <p style={{ color: theme.colors.textSecondary }}>Noch keine Roos. Starte deinen ersten!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
          {roos.map(roo => (
            <div
              key={roo.id}
              onClick={() => navigate(`/roo/${roo.id}`)}
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                padding: theme.spacing.lg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = theme.colors.primary}
              onMouseLeave={e => e.currentTarget.style.borderColor = theme.colors.border}
            >
              <div>
                <h3 style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, marginBottom: "4px" }}>
                  {roo.title}
                </h3>
                <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
                  {roo.genre} · {new Date(roo.created_at).toLocaleDateString("de-DE")}
                </p>
              </div>
              <span style={{
                padding: "6px 14px",
                borderRadius: "999px",
                backgroundColor: `${statusColor[roo.status] ?? theme.colors.primary}22`,
                border: `1px solid ${statusColor[roo.status] ?? theme.colors.primary}`,
                color: statusColor[roo.status] ?? theme.colors.primary,
                fontSize: theme.fontSizes.sm,
                fontWeight: theme.fontWeights.medium,
              }}>
                {roo.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}