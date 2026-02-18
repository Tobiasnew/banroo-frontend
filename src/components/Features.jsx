function Features() {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Wie Banroo funktioniert</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.kicker}>1</div>
          <h3 style={styles.title}>Match finden</h3>
          <p style={styles.text}>
            Wähle dein Instrument & Genre. Banroo verbindet dich mit passenden Musiker*innen.
          </p>
        </div>

        <div style={styles.card}>
          <div style={styles.kicker}>2</div>
          <h3 style={styles.title}>Gemeinsam bauen</h3>
          <p style={styles.text}>
            Tausche Ideen aus, lade Spuren hoch und entwickle Songs im Projekt-Flow.
          </p>
        </div>

        <div style={styles.card}>
          <div style={styles.kicker}>3</div>
          <h3 style={styles.title}>Release</h3>
          <p style={styles.text}>
            Exportiere deinen Track – und veröffentliche ihn, wenn du bereit bist.
          </p>
        </div>
      </div>
    </section>
  )
}

const styles = {
  section: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },

  heading: {
    fontSize: "36px",
    marginBottom: "50px",
  },

  grid: {
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  card: {
    background: "#111",
    padding: "30px",
    borderRadius: "12px",
    minWidth: "260px",
    maxWidth: "320px",
    textAlign: "left",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  kicker: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    background: "#fff",
    color: "#000",
    fontWeight: "700",
    fontSize: "14px",
  },

  title: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },

  text: {
    opacity: 0.75,
    lineHeight: 1.6,
    margin: 0,
  },
}

export default Features
