// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { theme } from "../styles/theme";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [showForgotPasswordField, setShowForgotPasswordField] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    if (!forgotEmail.trim()) {
      setError("Bitte gib deine E-Mail ein.");
      return;
    }

    setForgotLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setForgotSuccess(true);
      setForgotEmail("");
      setTimeout(() => {
        setShowForgotPassword(false);
        setShowForgotPasswordField(false);
        setForgotSuccess(false);
      }, 3000);
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

        {!showForgotPassword ? (
          <>
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

            <div style={{ position: "relative", marginBottom: theme.spacing.lg }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: theme.spacing.md,
                  paddingRight: "40px",
                  backgroundColor: theme.colors.surfaceHover,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.sm,
                  color: theme.colors.textPrimary,
                  fontSize: theme.fontSizes.md,
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: theme.colors.textSecondary,
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "0",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

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
              marginBottom: theme.spacing.md,
            }}>
              <span
                onClick={() => setShowForgotPassword(true)}
                style={{
                  color: theme.colors.primary,
                  cursor: "pointer",
                  fontWeight: theme.fontWeights.semibold,
                }}
              >
                Passwort vergessen?
              </span>
            </p>

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
          </>
        ) : (
          <>
            <p style={{
              color: theme.colors.textSecondary,
              fontSize: theme.fontSizes.sm,
              marginBottom: theme.spacing.md,
              textAlign: "center",
            }}>
              Gib deine E-Mail ein, um einen Reset-Link zu erhalten.
            </p>

            {forgotSuccess ? (
              <p style={{
                color: "#22c55e",
                textAlign: "center",
                fontSize: theme.fontSizes.md,
                fontWeight: theme.fontWeights.semibold,
                marginBottom: theme.spacing.md,
              }}>
                ✓ Reset-Link verschickt. Schau in deinem E-Mail-Postfach nach.
              </p>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="E-Mail"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
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

                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  style={{
                    width: "100%",
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.primary,
                    color: "#fff",
                    border: "none",
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.fontSizes.md,
                    fontWeight: theme.fontWeights.semibold,
                    cursor: forgotLoading ? "not-allowed" : "pointer",
                    marginBottom: theme.spacing.md,
                    opacity: forgotLoading ? 0.7 : 1,
                  }}
                >
                  {forgotLoading ? "Wird versendet..." : "Reset-Link senden"}
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotEmail("");
                setForgotSuccess(false);
                setError("");
              }}
              style={{
                width: "100%",
                padding: theme.spacing.md,
                backgroundColor: "transparent",
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.fontSizes.md,
                fontWeight: theme.fontWeights.semibold,
                cursor: "pointer",
              }}
            >
              ← Zurück zum Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;