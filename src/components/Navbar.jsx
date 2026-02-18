import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

          {user && (
            <NavLink
              to="/app"
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.active : null),
              })}
            >
              Dashboard
            </NavLink>
          )}

          {!user ? (
            <>
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
            </>
          ) : (
            <>
              <span style={styles.username}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </>
          )}
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
    background: "rgba(14, 11, 26, 0.90)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    borderTop: "1px solid rgba(245, 158, 11, 0.45)",
    boxShadow: "0 1px 0 0 rgba(245, 158, 11, 0.08)",
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
    border: "1px solid rgba(139, 92, 246, 0.6)",
    background: "rgba(139, 92, 246, 0.2)",
  },
  registerButtonActive: {
    background: "rgba(139, 92, 246, 0.5)",
    border: "1px solid rgba(139, 92, 246, 1)",
  },
  username: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "14px",
    padding: "8px 10px",
  },
  logoutButton: {
    backgroundColor: "transparent",
    color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "8px 14px",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default Navbar;