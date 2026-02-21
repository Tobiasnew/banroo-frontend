// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: theme.colors.background,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        width: "100%",
        maxWidth: "400px",
      }}>
        <h1 style={{
          color: theme.colors.textPrimary,
          fontSize: theme.fontSizes.xl,
          fontWeight: theme.fontWeights.bold,
          marginBottom: theme.spacing.lg,
          textAlign: "center",
        }}>
          Willkommen zurück
        </h1>

        {error && (
          <p style={{ color: "red", marginBottom: theme.spacing.md, textAlign: "center", fontSize: theme.fontSizes.sm }}>
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: theme.spacing.md,
            marginBottom: theme.spacing.md,
            backgroundColor: theme.colors.surfaceHover,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.sm,
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            backgroundColor: theme.colors.surfaceHover,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.sm,
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: theme.spacing.md,
            backgroundColor: theme.colors.primary,
            color: "#fff",
            border: "none",
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semibold,
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: theme.spacing.lg,
            opacity: loading ? 0.7 : 1,
          }}>
          {loading ? "Wird eingeloggt..." : "Einloggen"}
        </button>

        <p style={{
          textAlign: "center",
          color: theme.colors.textSecondary,
          fontSize: theme.fontSizes.sm,
        }}>
          Noch kein Konto?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: theme.colors.primary,
              cursor: "pointer",
              fontWeight: theme.fontWeights.semibold,
            }}
          >
            Jetzt registrieren
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;