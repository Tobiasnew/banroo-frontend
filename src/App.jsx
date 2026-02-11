function App() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Banroo</h1>
        <p style={styles.claim}>Match. Create. Release.</p>
        <p style={styles.subtitle}>
          Verbinde Musiker*innen weltweit. Finde Matches. Erschaffe Songs.
        </p>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0b0b0f',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '600px',
    padding: '40px',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '12px',
    letterSpacing: '2px',
  },
  claim: {
    fontSize: '1.4rem',
    fontWeight: '600',
    marginBottom: '16px',
  },
  subtitle: {
    opacity: 0.75,
    lineHeight: 1.6,
  },
}

export default App
