import Hero from "./components/Hero"
import Features from "./components/Features"

function App() {
  return (
    <div style={styles.page}>
      <Hero />
      <Features />
    </div>
  )
}

const styles = {
  page: {
    background: "#0b0b0f",
    color: "#ffffff",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
}

export default App
