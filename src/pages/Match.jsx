// src/pages/Match.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

const instruments = ["Gitarre", "Bass", "Schlagzeug", "Klavier", "Gesang", "Produktion", "DJ", "Sonstiges"];
const genres = ["Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "R&B", "Metal", "Indie"];

function Match() {
  const [selected, setSelected] = useState({ instrument: null, genre: null });
  const navigate = useNavigate();

  const toggle = (category, value) => {
    setSelected(prev => ({ ...prev, [category]: prev[category] === value ? null : value }));
  };

  const allSelected = selected.instrument && selected.genre;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.colors.background, padding: theme.spacing.xl }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        <p style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.sm, fontSize: theme.fontSizes.sm, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ♩♪ Start a Roo
        </p>

        <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.sm }}>
          Find deinen Match
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xl }}>
          Wähle dein Instrument und Genre – wir finden den passenden Partner.
        </p>

        {/* Instrument */}
        <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.md }}>
          🎸 Instrument
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.sm, marginBottom: theme.spacing.xl }}>
          {instruments.map(i => (
            <button key={i} onClick={() => toggle("instrument", i)} style={selected.instrument === i ? chip.active : chip.default}>
              {i}
            </button>
          ))}
        </div>

        {/* Genre */}
        <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.md }}>
          🎵 Genre
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.sm, marginBottom: theme.spacing.xl }}>
          {genres.map(g => (
            <button key={g} onClick={() => toggle("genre", g)} style={selected.genre === g ? chip.active : chip.default}>
              {g}
            </button>
          ))}
        </div>

        <button
          disabled={!allSelected}
          onClick={() => navigate("/match/result", { state: { ...selected, goal: "Start a Roo" } })}
          style={{
            width: "100%",
            padding: theme.spacing.md,
            backgroundColor: allSelected ? theme.colors.primary : theme.colors.surface,
            color: allSelected ? "#fff" : theme.colors.textMuted,
            border: "none",
            borderRadius: theme.borderRadius.md,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semibold,
            cursor: allSelected ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          {allSelected ? "♩♪ Start a Roo →" : "Wähle Instrument und Genre"}
        </button>

      </div>
    </div>
  );
}

const chip = {
  default: {
    padding: "8px 16px",
    borderRadius: "999px",
    border: "1px solid #2E2E2E",
    backgroundColor: "#1A1A1A",
    color: "#A1A1AA",
    cursor: "pointer",
    fontSize: "14px",
  },
  active: {
    padding: "8px 16px",
    borderRadius: "999px",
    border: "1px solid #7C3AED",
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Match;