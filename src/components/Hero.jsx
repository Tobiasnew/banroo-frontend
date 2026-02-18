import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section style={styles.hero}>
      <h1 style={styles.title}>Banroo</h1>

      <p style={styles.subtitle}>
        Match. Create. Release.
      </p>

      <p style={styles.description}>
        Verbinde Musiker*innen weltweit. Finde Matches. Erschaffe Songs.
      </p>

      <div style={styles.buttonGroup}>
        <button
          style={styles.primaryButton}
          onClick={() => navigate("/match")}
        >
          Start Matching
        </button>

        <button style={styles.secondaryButton}>
          Mehr erfahren
        </button>
      </div>
    </section>
  )
}

const styles = {
  hero: {
    textAlign: "center",
    padding: "40px",
    maxWidth: "800px",
  },
  title: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "24px",
    marginBottom: "12px",
    opacity: 0.9,
  },
  description: {
    fontSize: "18px",
    marginBottom: "40px",
    opacity: 0.7,
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  primaryButton: {
    background: "#ffffff",
    color: "#000000",
    padding: "14px 28px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  secondaryButton: {
    background: "transparent",
    color: "#ffffff",
    padding: "14px 28px",
    border: "1px solid #ffffff",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
}

export default Hero;