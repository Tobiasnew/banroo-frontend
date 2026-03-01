// src/pages/Profile.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const instrumentOptions = ["Gitarre", "Bass", "Schlagzeug", "Klavier", "Gesang", "Produktion", "DJ", "Sonstiges"];
const genreOptions = ["Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "R&B", "Metal", "Indie"];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    instrument: null,
    genre: null,
    avatar_url: null,
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

  useEffect(() => {
    if (showCamera && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          setStream(s);
          videoRef.current.srcObject = s;
        })
        .catch(err => console.error("Kamera Fehler:", err));
    } else if (!showCamera && stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
  }, [showCamera]);

  const uploadAvatar = async (file) => {
    setUploadingAvatar(true);
    const ext = file.name?.split(".").pop() || "jpg";
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error("Upload Fehler:", uploadError.message);
      setUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatar_url = data.publicUrl;

    await supabase.from("profiles").upsert({ id: user.id, avatar_url });
    setProfile(p => ({ ...p, avatar_url }));
    setUploadingAvatar(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadAvatar(file);
  };

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      setShowCamera(false);
      uploadAvatar(file);
    }, "image/jpeg");
  };

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
        avatar_url: profile.avatar_url,
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

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.border}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "32px",
        }}>
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "👤"
          }
        </div>
        <div style={{ display: "flex", gap: theme.spacing.sm }}>
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploadingAvatar}
            style={{
              padding: "8px 16px",
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: "transparent",
              color: theme.colors.textSecondary,
              cursor: "pointer",
              fontSize: theme.fontSizes.sm,
            }}
          >
            {uploadingAvatar ? "Lädt hoch..." : "📁 Bild hochladen"}
          </button>
          <button
            onClick={() => setShowCamera(!showCamera)}
            style={{
              padding: "8px 16px",
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: "transparent",
              color: theme.colors.textSecondary,
              cursor: "pointer",
              fontSize: theme.fontSizes.sm,
            }}
          >
            📷 Kamera
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      </div>

      {/* Kamera */}
      {showCamera && (
        <div style={{ marginBottom: theme.spacing.xl, borderRadius: theme.borderRadius.md, overflow: "hidden", border: `1px solid ${theme.colors.border}` }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", display: "block" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <button
            onClick={handleCapture}
            style={{
              width: "100%",
              padding: theme.spacing.md,
              backgroundColor: theme.colors.primary,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: theme.fontSizes.md,
              fontWeight: theme.fontWeights.semibold,
            }}
          >
            📸 Foto aufnehmen
          </button>
        </div>
      )}

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