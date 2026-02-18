// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

const fakeRoos = [
  {
    id: 1,
    title: "Midnight Groove",
    partner: "Luna K.",
    genre: "Indie",
    status: "In Progress",
    date: "15. Feb 2026",
  },
  {
    id: 2,
    title: "Neon Pulse",
    partner: "Marco D.",
    genre: "Electronic",
    status: "Idee",
    date: "10. Feb 2026",
  },
];

const statusColor = {
  "In Progress": theme.colors.primary,
  "Idee": theme.colors.accent,
  "Fertig": theme.colors.success,
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>

      {/* Header */}
      <div style={{ marginBottom: theme.spacing.xl }}>
        <p style={{ color: theme.colors.primary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.semibold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
          ✦ Willkommen zurück
        </p>
        <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: "8px" }}>
          Deine Roos
        </h1>
        <p style={{ color: theme.colors.textSecondary }}>
          Hier siehst du alle deine laufenden und vergangenen Projekte.
        </p>
      </div>

      {/* Quick Action */}
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

      {/* Roo List */}
      <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
        {fakeRoos.map(roo => (
          <div key={roo.id} style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.lg,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: theme.spacing.md,
          }}>
            <div>
              <h3 style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, marginBottom: "4px" }}>
                {roo.title}
              </h3>
              <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
                mit {roo.partner} · {roo.genre} · {roo.date}
              </p>
            </div>

            <span style={{
              padding: "6px 14px",
              borderRadius: "999px",
              backgroundColor: `${statusColor[roo.status]}22`,
              border: `1px solid ${statusColor[roo.status]}`,
              color: statusColor[roo.status],
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontWeights.medium,
            }}>
              {roo.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}