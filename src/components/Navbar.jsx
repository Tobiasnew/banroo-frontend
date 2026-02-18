import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand} onClick={() => navigate("/")}>Banroo</div>

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

          <NavLink
            to="/login"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.active : null),
            })}
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            style={({ isActive }) => ({
              ...styles.registerButton,
              ...(isActive ? styles.registerButtonActive : null),
            })}
          >
            Registrieren
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
    background: "rgba(14, 11, 26, 0.85)",
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
    cursor: "pointer",
    color: "#ffffff",
  },
  nav: {
    display: "flex",
    gap: "8px",
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
  registerButton: {
    textDecoration: "none",
    color: "#ffffff",
    fontSize: "14px",
    padding: "8px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(124, 58, 237, 0.6)",
    background: "rgba(124, 58, 237, 0.2)",
  },
  registerButtonActive: {
    background: "rgba(124, 58, 237, 0.5)",
    border: "1px solid rgba(124, 58, 237, 1)",
  },
};

export default Navbar;