// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";

function Login() {
  const navigate = useNavigate();

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

        <input
          type="email"
          placeholder="E-Mail"
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

        <button style={{
          width: "100%",
          padding: theme.spacing.md,
          backgroundColor: theme.colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: theme.borderRadius.sm,
          fontSize: theme.fontSizes.md,
          fontWeight: theme.fontWeights.semibold,
          cursor: "pointer",
          marginBottom: theme.spacing.lg,
        }}>
          Einloggen
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