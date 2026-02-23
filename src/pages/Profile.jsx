// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const instrumentOptions = ["Gitarre", "Bass", "Schlagzeug", "Klavier", "Gesang", "Produktion", "DJ", "Sonstiges"];
const genreOptions = ["Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "R&B", "Metal", "Indie"];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    instrument: null,
    genre: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username: profile.username,
        bio: profile.bio,
        instrument: profile.instrument,
        genre: profile.genre,
      });

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  if (loading) return (
    <div style={{ padding: "40px", color: theme.colors.textSecondary }}>Lädt...</div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>

      <button
        onClick={() => navigate("/app")}
        style={{ background: "none", border: "none", color: theme.colors.textSecondary, cursor: "pointer", fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.xl, padding: 0 }}
      >
        ← Zurück
      </button>

      <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.sm }}>
        Dein Profil
      </h1>
      <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.xl }}>
        {user?.email}
      </p>

      {/* Username */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <label style={{ display: "block", color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.sm }}>
          Name
        </label>
        <input
          value={profile.username || ""}
          onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
          placeholder="Dein Name oder Artist-Name"
          style={{
            width: "100%",
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Bio */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <label style={{ display: "block", color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.sm }}>
          Bio
        </label>
        <textarea
          value={profile.bio || ""}
          onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
          placeholder="Erzähl uns von dir..."
          rows={4}
          style={{
            width: "100%",
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Instrument */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <label style={{ display: "block", color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.sm }}>
          Instrument
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.sm }}>
          {instrumentOptions.map(i => (
            <button
              key={i}
              onClick={() => setProfile(p => ({ ...p, instrument: p.instrument === i ? null : i }))}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: `1px solid ${profile.instrument === i ? theme.colors.primary : theme.colors.border}`,
                backgroundColor: profile.instrument === i ? `${theme.colors.primary}22` : "transparent",
                color: profile.instrument === i ? "#fff" : theme.colors.textSecondary,
                cursor: "pointer",
                fontSize: theme.fontSizes.sm,
              }}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div style={{ marginBottom: theme.spacing.xl }}>
        <label style={{ display: "block", color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.sm }}>
          Genre
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.sm }}>
          {genreOptions.map(g => (
            <button
              key={g}
              onClick={() => setProfile(p => ({ ...p, genre: p.genre === g ? null : g }))}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: `1px solid ${profile.genre === g ? theme.colors.primary : theme.colors.border}`,
                backgroundColor: profile.genre === g ? `${theme.colors.primary}22` : "transparent",
                color: profile.genre === g ? "#fff" : theme.colors.textSecondary,
                cursor: "pointer",
                fontSize: theme.fontSizes.sm,
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: theme.spacing.md,
          backgroundColor: saved ? "#22c55e" : theme.colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: theme.borderRadius.md,
          fontSize: theme.fontSizes.md,
          fontWeight: theme.fontWeights.semibold,
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
      >
        {saved ? "✓ Gespeichert" : saving ? "Speichert..." : "Profil speichern"}
      </button>

    </div>
  );
}