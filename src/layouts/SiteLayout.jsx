import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { theme } from "../styles/theme";

function SiteLayout() {
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0E0B1A",
    color: theme.colors.textPrimary,
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  main: {
    padding: "60px 20px",
  },
};

export default SiteLayout;