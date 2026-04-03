// src/components/Features.jsx
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

const steps = [
  {
    number: "01",
    icon: "🎯",
    title: "Matchen",
    text: "Wähl dein Genre und Instrument. Banroo findet jemanden, der dazu passt – jemand den du noch nie getroffen hast.",
  },
  {
    number: "02",
    icon: "🎧",
    title: "Zusammen bauen",
    text: "Tauscht Ideen aus, ladet Spuren hoch und schreibt euch Nachrichten. Euer gemeinsamer Workspace für den ganzen Song.",
  },
  {
    number: "03",
    icon: "🚀",
    title: "Releasen",
    text: "Euer Track ist fertig? Veröffentlicht ihn direkt auf Banroo – für alle zum Hören.",
  },
];

const usps = [
  {
    icon: "🎲",
    title: "Zufällig gematcht",
    text: "Keine Suche, kein Scrollen. Banroo würfelt dich mit jemandem zusammen. Das Ergebnis überrascht.",
  },
  {
    icon: "🛠️",
    title: "Alles an einem Ort",
    text: "Chat, Dateien, Kommentare, Status – alles in einem Workspace. Kein Hin-und-Her zwischen Apps.",
  },
  {
    icon: "🌍",
    title: "Für alle Level",
    text: "Egal ob Anfänger oder Profi. Hier zählt die Lust am Musikmachen, nicht der Lebenslauf.",
  },
  {
    icon: "🆓",
    title: "Komplett kostenlos",
    text: "Kein Abo, kein Haken. Registrieren, matchen, loslegen. Direkt im Browser.",
  },
];

function Features() {
  const navigate = useNavigate();

  return (
    <>
      {/* === HOW IT WORKS === */}
      <section style={styles.section}>
        <p style={styles.eyebrow}>✦ So funktioniert's</p>
        <h2 style={styles.heading}>In drei Schritten zum Song</h2>

        <div style={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={step.number} style={styles.stepCard}>
              <div style={styles.stepTop}>
                <span style={styles.stepIcon}>{step.icon}</span>
                <span style={styles.stepNumber}>{step.number}</span>
              </div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepText}>{step.text}</p>
              {index < steps.length - 1 && (
                <div style={styles.connector}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* === USP SECTION === */}
      <section style={styles.uspSection}>
        <p style={styles.eyebrow}>✦ Was Banroo anders macht</p>
        <h2 style={styles.heading}>Keine weitere Plattform. Ein neuer Weg.</h2>

        <div style={styles.uspGrid}>
          {usps.map((usp) => (
            <div key={usp.title} style={styles.uspCard}>
              <span style={styles.uspIcon}>{usp.icon}</span>
              <h3 style={styles.uspTitle}>{usp.title}</h3>
              <p style={styles.uspText}>{usp.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaGlow} />
        <h2 style={styles.ctaHeading}>
          Bereit für deinen ersten{" "}
          <span style={styles.ctaGradient}>Roo?</span>
        </h2>
        <p style={styles.ctaSubtext}>
          Dein nächster Song ist nur ein Match entfernt.
        </p>
        <button
          style={styles.ctaButton}
          onClick={() => navigate("/match")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.primaryHover;
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.primary;
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.25)";
          }}
        >
          Jetzt Matchen →
        </button>
        <p style={styles.ctaTrust}>
          Kostenlos. Kein Download. Direkt im Browser.
        </p>
      </section>
    </>
  );
}

const styles = {
  // === SHARED ===
  section: {
    padding: "80px 20px",
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
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginBottom: "56px",
    letterSpacing: "-0.02em",
  },

  // === STEPS ===
  stepsGrid: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  stepCard: {
    position: "relative",
    backgroundColor: theme.colors.surface,
    border: "1px solid " + theme.colors.border,
    borderTop: "2px solid " + theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: "36px 28px",
    minWidth: "260px",
    maxWidth: "320px",
    flex: "1",
    textAlign: "left",
  },
  stepTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  stepIcon: {
    fontSize: "32px",
  },
  stepNumber: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    opacity: 0.5,
  },
  stepTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: "12px",
  },
  stepText: {
    color: theme.colors.textSecondary,
    lineHeight: 1.7,
    fontSize: theme.fontSizes.md,
  },
  connector: {
    display: "none",
  },

  // === USP ===
  uspSection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },
  uspGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    textAlign: "left",
  },
  uspCard: {
    padding: "32px 24px",
    borderRadius: theme.borderRadius.lg,
    border: "1px solid " + theme.colors.border,
    backgroundColor: "rgba(26, 26, 26, 0.5)",
  },
  uspIcon: {
    fontSize: "28px",
    display: "block",
    marginBottom: "16px",
  },
  uspTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: "8px",
  },
  uspText: {
    color: theme.colors.textSecondary,
    lineHeight: 1.7,
    fontSize: theme.fontSizes.sm,
  },

  // === FINAL CTA ===
  ctaSection: {
    position: "relative",
    padding: "100px 20px",
    textAlign: "center",
    overflow: "hidden",
  },
  ctaGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "400px",
    background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  ctaHeading: {
    position: "relative",
    zIndex: 1,
    fontSize: "clamp(1.8rem, 5vw, 3rem)",
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginBottom: "16px",
    letterSpacing: "-0.02em",
  },
  ctaGradient: {
    background: "linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline",
  },
  ctaSubtext: {
    position: "relative",
    zIndex: 1,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.lg,
    marginBottom: "32px",
  },
  ctaButton: {
    position: "relative",
    zIndex: 1,
    backgroundColor: theme.colors.primary,
    color: "#fff",
    padding: "18px 40px",
    border: "none",
    borderRadius: theme.borderRadius.md,
    fontSize: "1.1rem",
    fontWeight: theme.fontWeights.semibold,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.25)",
    marginBottom: "16px",
  },
  ctaTrust: {
    position: "relative",
    zIndex: 1,
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
  },
};

export default Features;