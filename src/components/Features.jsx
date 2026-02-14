function Features() {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Wie Banroo funktioniert</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.kicker}>1</div>
          <h3 style={styles.title}>Match finden</h3>
          <p style={styles.text}>
            Wähle Instrument &amp; Genre. Banroo verbindet dich mit passenden
            Musiker*innen.
          </p>
        </div>

        <div style={styles.card}>
          <div style={styles.kicker}>2</div>
          <h3 style={styles.title}>Gemeinsam bauen</h3>
          <p style={styles.text}>
            Tausche Ideen aus, lade Spuren hoch und entwickle Songs zusammen.
          </p>
        </div>

        <div style={styles.card}>
          <div style={styles.kicker}>3</div>
          <h3 style={styles.title}>Release</h3>
          <p style={styles.text}>
            Exportiere dein Projekt, veröffentliche es – und sammle Feedback.
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
    minWidth: "250px",
    maxWidth: "320px",
    textAlign: "left",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  kicker: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    background: "rgba(255,255,255,0.10)",
    marginBottom: "12px",
  },

  title: {
    fontSize: "20px",
    margin: "0 0 10px 0",
  },

  text: {
    margin: 0,
    opacity: 0.75,
    lineHeight: 1.6,
  },
}

export default Features
