// src/components/Features.jsx
import { theme } from "../styles/theme";

const features = [
  {
    number: "1",
    emoji: "🎸",
    title: "Match finden",
    text: "Wähle dein Instrument & Genre. Banroo verbindet dich mit dem passenden Partner für deinen nächsten Roo.",
  },
  {
    number: "2",
    emoji: "🎵",
    title: "Start a Roo",
    text: "Tausche Ideen aus, lade Spuren hoch und baut gemeinsam etwas Echtes – von der ersten Idee bis zum fertigen Track.",
  },
  {
    number: "3",
    emoji: "🚀",
    title: "Drop it",
    text: "Exportiere deinen Roo und veröffentliche ihn, wenn du bereit bist. Die Welt wartet.",
  },
];

function Features() {
  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>✦ So funktioniert's</p>
      <h2 style={styles.heading}>Drei Schritte zu deinem Roo</h2>

      <div style={styles.grid}>
        {features.map((f) => (
          <div key={f.number} style={styles.card}>
            <div style={styles.top}>
              <span style={styles.emoji}>{f.emoji}</span>
              <span style={styles.number}>{f.number}</span>
            </div>
            <h3 style={styles.title}>{f.title}</h3>
            <p style={styles.text}>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "100px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  heading: {
    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginBottom: "60px",
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
 card: {
    backgroundColor: theme.colors.surface,
    border: "1px solid #2E2E2E",
    borderTop: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: theme.borderRadius.lg,
    padding: "36px 28px",
    minWidth: "260px",
    maxWidth: "320px",
    textAlign: "left",
    transition: "border-color 0.2s",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  emoji: {
    fontSize: "28px",
  },
  number: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.colors.primary,
    color: "#fff",
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.sm,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: "12px",
  },
  text: {
    color: theme.colors.textSecondary,
    lineHeight: 1.7,
    fontSize: theme.fontSizes.md,
  },
};

export default Features;