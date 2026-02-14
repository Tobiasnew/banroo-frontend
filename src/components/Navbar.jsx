import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand}>Banroo</div>

        <nav style={styles.nav}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.active : null),
            })}
            end
          >
            Home
          </NavLink>

          <NavLink
            to="/app"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.active : null),
            })}
          >
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(11, 11, 15, 0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  inner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  brand: {
    fontWeight: 800,
    letterSpacing: "0.3px",
  },
  nav: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.75)",
    fontSize: "14px",
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid transparent",
  },
  active: {
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
  },
};

export default Navbar;
