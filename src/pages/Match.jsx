// src/pages/Match.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

const instruments = ["Gitarre", "Bass", "Schlagzeug", "Klavier", "Gesang", "Produktion", "DJ", "Sonstiges"];
const genres = ["Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "R&B", "Metal", "Indie"];
const goals = ["Start a Roo", "Just vibe", "Find my Band", "Drop a Release"];

function Match() {
  const [selected, setSelected] = useState({ instrument: null, genre: null, goal: null });
  const navigate = useNavigate();

  const toggle = (category, value) => {
    setSelected(prev => ({ ...prev, [category]: prev[category] === value ? null : value }));
  };

  const allSelected = selected.instrument && selected.genre && selected.goal;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: theme.colors.background, padding: theme.spacing.xl }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.sm }}>
          Find deinen Match
        </h1>
        <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xl }}>
          Wähle dein Instrument, Genre und Ziel – wir finden den passenden Partner.
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

        {/* Goal */}
        <h2 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.md, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.md }}>
          🎯 Ziel
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.sm, marginBottom: theme.spacing.xl }}>
          {goals.map(g => (
            <button
              key={g}
              onClick={() => toggle("goal", g)}
              style={
                g === "Start a Roo"
                  ? selected.goal === g ? chip.featuredActive : chip.featured
                  : selected.goal === g ? chip.active : chip.default
              }
            >
            {g === "Start a Roo" ? "♩♪ " + g : g}            </button>
          ))}
        </div>

        <button
          disabled={!allSelected}
            onClick={() => navigate("/match/result", { state: selected })}          style={{
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
          {allSelected ? "Match finden →" : "Bitte alles auswählen"}
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
  featured: {
    padding: "8px 16px",
    borderRadius: "999px",
    border: "1px solid rgba(245, 158, 11, 0.6)",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    color: "#F59E0B",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  featuredActive: {
    padding: "8px 16px",
    borderRadius: "999px",
    border: "1px solid rgba(245, 158, 11, 1)",
    backgroundColor: "rgba(245, 158, 11, 0.3)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default Match;