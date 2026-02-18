// src/components/Hero.jsx
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

function Hero() {
  const navigate = useNavigate();

  return (
    <section style={styles.hero}>
      <div style={styles.glow} />

      <p style={styles.eyebrow}>✦ The platform for music creators</p>

      <h1 style={styles.title}>
        Your next{" "}
        <span style={styles.gradient}>Roo</span>
        <br />
        is one match away.
      </h1>

      <p style={styles.subtitle}>
        Find your perfect collaborator. Build something real.
        <br />
        Match. Create. Release.
      </p>

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
          Learn more
        </button>
      </div>

      <p style={styles.proof}>
        🎵 Already <strong style={{ color: theme.colors.textPrimary }}>1,200+ musicians</strong> waiting for their match
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
    background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.18) 0%, transparent 70%)",
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
    fontSize: "clamp(2.8rem, 7vw, 5rem)",
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    lineHeight: 1.1,
    marginBottom: "28px",
    letterSpacing: "-0.03em",
    textShadow: "0 0 80px rgba(245, 158, 11, 0.15)",
  },
  gradient: {
    background: "linear-gradient(90deg, #8B5CF6, #F59E0B)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block",
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