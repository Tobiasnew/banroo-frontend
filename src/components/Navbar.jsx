// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.inner}>
          <div style={styles.brand} onClick={() => navigate("/")}>Banroo</div>

          {/* Desktop Nav */}
          <nav style={styles.desktopNav} className="desktop-only">
            <NavLink to="/" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : null) })} end>
              Home
            </NavLink>
            <NavLink to="/listen" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : null) })}>
              🎧 Sounds
            </NavLink>

            {user && (
              <>
                <NavLink to="/app" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : null) })}>
                  Dashboard
                </NavLink>
                <NavLink to="/match" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : null) })}>
                  🎯 Match
                </NavLink>
              </>
            )}

            {!user ? (
              <>
                <NavLink to="/login" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : null) })}>
                  Login
                </NavLink>
                <NavLink to="/register" style={({ isActive }) => ({ ...styles.registerButton, ...(isActive ? styles.registerButtonActive : null) })}>
                  Registrieren
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/profile" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : null) })}>
                  👤 Profil
                </NavLink>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.hamburger}
            className="mobile-only"
            aria-label="Menü"
          >
            <span style={{
              ...styles.hamburgerLine,
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }} />
            <span style={{
              ...styles.hamburgerLine,
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              ...styles.hamburgerLine,
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }} />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div style={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div style={{
        ...styles.mobileMenu,
        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
      }}>
        <nav style={styles.mobileNav}>
          <NavLink to="/" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.mobileLinkActive : null) })} end>
            Home
          </NavLink>
          <NavLink to="/listen" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.mobileLinkActive : null) })}>
            🎧 Sounds
          </NavLink>

          {user && (
            <>
              <NavLink to="/app" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.mobileLinkActive : null) })}>
                Dashboard
              </NavLink>
              <NavLink to="/match" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.mobileLinkActive : null) })}>
                🎯 Match
              </NavLink>
            </>
          )}

          <div style={styles.mobileDivider} />

          {!user ? (
            <>
              <NavLink to="/login" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.mobileLinkActive : null) })}>
                Login
              </NavLink>
              <NavLink to="/register" style={styles.mobileRegisterButton}>
                Registrieren
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.mobileLinkActive : null) })}>
                👤 Profil
              </NavLink>
              <button onClick={handleLogout} style={styles.mobileLogoutButton}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
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
    fontSize: "18px",
  },
  desktopNav: {
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
  logoutButton: {
    backgroundColor: "transparent",
    color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "8px 14px",
    fontSize: "14px",
    cursor: "pointer",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "5px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    zIndex: 110,
  },
  hamburgerLine: {
    display: "block",
    width: "22px",
    height: "2px",
    backgroundColor: "#ffffff",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 90,
  },
  mobileMenu: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "280px",
    height: "100vh",
    backgroundColor: "#0E0B1A",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
    zIndex: 95,
    transition: "transform 0.3s ease",
    paddingTop: "80px",
    overflowY: "auto",
  },
  mobileNav: {
    display: "flex",
    flexDirection: "column",
    padding: "0 24px",
    gap: "4px",
  },
  mobileLink: {
    textDecoration: "none",
    color: "rgba(255,255,255,0.75)",
    fontSize: "16px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid transparent",
    display: "block",
  },
  mobileLinkActive: {
    color: "#ffffff",
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
  },
  mobileDivider: {
    height: "1px",
    backgroundColor: "rgba(255,255,255,0.08)",
    margin: "12px 0",
  },
  mobileRegisterButton: {
    textDecoration: "none",
    color: "#ffffff",
    fontSize: "16px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(139, 92, 246, 0.6)",
    background: "rgba(139, 92, 246, 0.2)",
    textAlign: "center",
    display: "block",
  },
  mobileLogoutButton: {
    backgroundColor: "transparent",
    color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
};

export default Navbar;