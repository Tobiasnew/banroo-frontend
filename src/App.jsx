import Hero from './components/Hero'

function App() {
  return (
    <main style={styles.page}>
      <Hero />
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
}

export default App
