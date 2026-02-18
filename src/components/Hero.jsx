// src/components/Hero.jsx
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

function Hero() {
  const navigate = useNavigate();

  return (
    <section style={styles.hero}>
      {/* Glow Background */}
      <div style={styles.glow} />

      {/* Eyebrow */}
      <p style={styles.eyebrow}>✦ Die Plattform für Musik-Creator</p>

      {/* Title */}
      <h1 style={styles.title}>
        Musik entsteht,{" "}
        <span style={styles.gradient}>wenn Menschen</span>
        <br />
        sich finden.
      </h1>

      {/* Subtitle */}
      <p style={styles.subtitle}>
        Match. Create. Release. Banroo verbindet Musiker*innen weltweit –
        <br />
        und macht aus Ideen echte Songs.
      </p>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button
          style={styles.primaryButton}
          onClick={() => navigate("/match")}
          onMouseEnter={e => e.target.style.backgroundColor = theme.colors.primaryHover}
          onMouseLeave={e => e.target.style.backgroundColor = theme.colors.primary}
        >
          Start Matching →
        </button>

        <button
          style={styles.secondaryButton}
          onMouseEnter={e => e.target.style.borderColor = "rgba(255,255,255,0.4)"}
          onMouseLeave={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
        >
          Mehr erfahren
        </button>
      </div>

      {/* Social Proof */}
      <p style={styles.proof}>
        🎵 Bereits <strong style={{ color: theme.colors.textPrimary }}>1.200+ Musiker*innen</strong> warten auf ihren Match
      </p>
    </section>
  );
}

const styles = {
  hero: {
    position: "relative",
    textAlign: "center",
    padding: "120px 20px 100px",
    maxWidth: "860px",
    margin: "0 auto",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "600px",
    height: "400px",
    background: "radial-gradient(ellipse at center, rgba(124, 58, 237, 0.2) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  eyebrow: {
    position: "relative",
    zIndex: 1,
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: "0.08em",
    marginBottom: "24px",
    textTransform: "uppercase",
  },
  title: {
    position: "relative",
    zIndex: 1,
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    lineHeight: 1.15,
    marginBottom: "28px",
    letterSpacing: "-0.02em",
  },
  gradient: {
    background: "linear-gradient(90deg, #7C3AED, #F59E0B)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    position: "relative",
    zIndex: 1,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textSecondary,
    lineHeight: 1.7,
    marginBottom: "48px",
  },
  buttonGroup: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    color: "#fff",
    padding: "16px 32px",
    border: "none",
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: theme.colors.textPrimary,
    padding: "16px 32px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSizes.md,
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  proof: {
    position: "relative",
    zIndex: 1,
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
    },
};
export default Hero;