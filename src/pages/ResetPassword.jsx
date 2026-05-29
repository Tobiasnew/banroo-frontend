// src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { theme } from "../styles/theme";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    setError("");

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate("/login");
    }, 2000);
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
          Neues Passwort setzen
        </h1>

        {!ready && !success && (
          <p style={{
            color: theme.colors.textSecondary,
            fontSize: theme.fontSizes.sm,
            textAlign: "center",
            marginBottom: theme.spacing.md,
          }}>
            Reset-Link wird überprüft...
          </p>
        )}

        {error && (
          <p style={{ color: "red", marginBottom: theme.spacing.md, textAlign: "center", fontSize: theme.fontSizes.sm }}>
            {error}
          </p>
        )}

        {success ? (
          <p style={{
            color: "#22c55e",
            textAlign: "center",
            fontSize: theme.fontSizes.md,
            fontWeight: theme.fontWeights.semibold,
          }}>
            ✓ Passwort geändert. Du wirst weitergeleitet...
          </p>
        ) : (
          <>
            <div style={{ position: "relative", marginBottom: theme.spacing.md }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Neues Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!ready}
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
                  opacity: ready ? 1 : 0.5,
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                disabled={!ready}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: theme.colors.textSecondary,
                  cursor: ready ? "pointer" : "not-allowed",
                  fontSize: "18px",
                  padding: "0",
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div style={{ position: "relative", marginBottom: theme.spacing.lg }}>
              <input
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="Passwort bestätigen"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                disabled={!ready}
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
                  opacity: ready ? 1 : 0.5,
                }}
              />
              <button
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                disabled={!ready}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: theme.colors.textSecondary,
                  cursor: ready ? "pointer" : "not-allowed",
                  fontSize: "18px",
                  padding: "0",
                }}
              >
                {showPasswordConfirm ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <button
              onClick={handleReset}
              disabled={loading || !ready}
              style={{
                width: "100%",
                padding: theme.spacing.md,
                backgroundColor: theme.colors.primary,
                color: "#fff",
                border: "none",
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.fontSizes.md,
                fontWeight: theme.fontWeights.semibold,
                cursor: (loading || !ready) ? "not-allowed" : "pointer",
                opacity: (loading || !ready) ? 0.6 : 1,
              }}
            >
              {loading ? "Speichert..." : "Passwort speichern"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;