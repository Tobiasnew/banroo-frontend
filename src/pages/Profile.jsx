// src/pages/Profile.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const instrumentOptions = ["Gitarre", "Bass", "Schlagzeug", "Klavier", "Gesang", "Produktion", "DJ", "Sonstiges"];
const genreOptions = ["Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "R&B", "Metal", "Indie", "Classical", "Reggae"];
const experienceOptions = ["Anfänger", "Fortgeschritten", "Profi"];

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
    instruments: [],
    genres: [],
    experience: null,
    instagram: "",
    spotify: "",
    soundcloud: "",
    avatar_url: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          username: data.username || "",
          bio: data.bio || "",
          instrument: data.instrument || null,
          genre: data.genre || null,
          instruments: data.instruments || [],
          genres: data.genres || [],
          experience: data.experience || null,
          instagram: data.instagram || "",
          spotify: data.spotify || "",
          soundcloud: data.soundcloud || "",
          avatar_url: data.avatar_url || null,
        });
      }
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

  const toggleInstrument = (inst) => {
    setProfile(p => ({
      ...p,
      instruments: p.instruments.includes(inst)
        ? p.instruments.filter(i => i !== inst)
        : [...p.instruments, inst],
    }));
  };

  const toggleGenre = (genre) => {
    setProfile(p => ({
      ...p,
      genres: p.genres.includes(genre)
        ? p.genres.filter(g => g !== genre)
        : [...p.genres, genre],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username: profile.username,
        bio: profile.bio,
        instrument: profile.instruments[0] || profile.instrument,
        genre: profile.genres[0] || profile.genre,
        instruments: profile.instruments,
        genres: profile.genres,
        experience: profile.experience,
        instagram: profile.instagram,
        spotify: profile.spotify,
        soundcloud: profile.soundcloud,
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
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 20px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <button
          onClick={() => navigate("/app")}
          style={{ background: "none", border: "none", color: theme.colors.textSecondary, cursor: "pointer", fontSize: theme.fontSizes.sm, marginBottom: "24px", padding: 0 }}
        >
          ← Zurück zum Dashboard
        </button>
        <h1 style={{ color: theme.colors.textPrimary, fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: theme.fontWeights.bold, marginBottom: "8px" }}>
          Dein Profil
        </h1>
        <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSizes.sm }}>
          {user?.email}
        </p>
      </div>

      {/* Avatar Section */}
      <div style={{
        backgroundColor: theme.colors.surface,
        border: "1px solid " + theme.colors.border,
        borderRadius: theme.borderRadius.lg,
        padding: "32px",
        marginBottom: "24px",
        textAlign: "center",
      }}>
        <div style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: theme.colors.background,
          border: "3px solid " + theme.colors.primary,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          margin: "0 auto 20px",
        }}>
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "🎵"
          }
        </div>

        {showCamera ? (
          <div style={{ marginBottom: "16px" }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "300px", borderRadius: theme.borderRadius.md, marginBottom: "12px" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              <button onClick={handleCapture} style={styles.smallButton}>
                📸 Aufnehmen
              </button>
              <button onClick={() => setShowCamera(false)} style={{ ...styles.smallButton, backgroundColor: "transparent", border: "1px solid " + theme.colors.border, color: theme.colors.textSecondary }}>
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar} style={styles.smallButton}>
              {uploadingAvatar ? "Lädt..." : "📁 Foto hochladen"}
            </button>
            <button onClick={() => setShowCamera(true)} style={styles.smallButton}>
              📸 Kamera
            </button>
          </div>
        )}
      </div>

      {/* Persönliche Infos */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Persönliche Infos</h2>

        {/* Username */}
        <div style={styles.field}>
          <label style={styles.label}>Artist-Name</label>
          <input
            value={profile.username || ""}
            onChange={e => setProfile(p => ({ ...p, username: e.target.value }))}
            placeholder="Dein Name oder Künstlername"
            style={styles.input}
          />
        </div>

        {/* Bio */}
        <div style={styles.field}>
          <label style={styles.label}>Über dich</label>
          <textarea
            value={profile.bio || ""}
            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
            placeholder="Erzähl kurz was über dich und deine Musik..."
            rows={3}
            style={{ ...styles.input, resize: "vertical" }}
          />
        </div>

        {/* Experience */}
        <div style={styles.field}>
          <label style={styles.label}>Erfahrung</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {experienceOptions.map(exp => (
              <button
                key={exp}
                onClick={() => setProfile(p => ({ ...p, experience: p.experience === exp ? null : exp }))}
                style={{
                  ...styles.chip,
                  borderColor: profile.experience === exp ? theme.colors.accent : theme.colors.border,
                  backgroundColor: profile.experience === exp ? theme.colors.accent + "22" : "transparent",
                  color: profile.experience === exp ? theme.colors.accent : theme.colors.textSecondary,
                }}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Musik */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Deine Musik</h2>

        {/* Instruments (Multi-Select) */}
        <div style={styles.field}>
          <label style={styles.label}>Instrumente <span style={{ color: theme.colors.textMuted, fontWeight: "normal" }}>(mehrere möglich)</span></label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {instrumentOptions.map(inst => (
              <button
                key={inst}
                onClick={() => toggleInstrument(inst)}
                style={{
                  ...styles.chip,
                  borderColor: profile.instruments.includes(inst) ? theme.colors.primary : theme.colors.border,
                  backgroundColor: profile.instruments.includes(inst) ? theme.colors.primary + "22" : "transparent",
                  color: profile.instruments.includes(inst) ? "#fff" : theme.colors.textSecondary,
                }}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* Genres (Multi-Select) */}
        <div style={styles.field}>
          <label style={styles.label}>Genres <span style={{ color: theme.colors.textMuted, fontWeight: "normal" }}>(mehrere möglich)</span></label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {genreOptions.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                style={{
                  ...styles.chip,
                  borderColor: profile.genres.includes(genre) ? theme.colors.primary : theme.colors.border,
                  backgroundColor: profile.genres.includes(genre) ? theme.colors.primary + "22" : "transparent",
                  color: profile.genres.includes(genre) ? "#fff" : theme.colors.textSecondary,
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Social Links</h2>
        <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSizes.sm, marginBottom: "20px" }}>
          Trag deinen Benutzernamen ein – die Links werden automatisch gebaut.
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Instagram</label>
          <div style={styles.socialRow}>
            <span style={styles.socialPrefix}>instagram.com/</span>
            <input
              value={profile.instagram || ""}
              onChange={e => setProfile(p => ({ ...p, instagram: e.target.value }))}
              placeholder="dein_name"
              style={styles.socialInput}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Spotify</label>
          <div style={styles.socialRow}>
            <span style={styles.socialPrefix}>open.spotify.com/artist/</span>
            <input
              value={profile.spotify || ""}
              onChange={e => setProfile(p => ({ ...p, spotify: e.target.value }))}
              placeholder="artist-id"
              style={styles.socialInput}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>SoundCloud</label>
          <div style={styles.socialRow}>
            <span style={styles.socialPrefix}>soundcloud.com/</span>
            <input
              value={profile.soundcloud || ""}
              onChange={e => setProfile(p => ({ ...p, soundcloud: e.target.value }))}
              placeholder="dein_name"
              style={styles.socialInput}
            />
          </div>
        </div>
      </div>
      {/* Preview Button */}
      <button
        onClick={() => navigate(`/profile/${user.id}`)}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: "transparent",
          color: theme.colors.textSecondary,
          border: "1px solid " + theme.colors.border,
          borderRadius: theme.borderRadius.md,
          fontSize: theme.fontSizes.md,
          cursor: "pointer",
          marginBottom: "12px",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={e => e.target.style.borderColor = theme.colors.primary}
        onMouseLeave={e => e.target.style.borderColor = theme.colors.border}
      >
        👁️ So sehen andere dein Profil
      </button>
      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "18px",
          backgroundColor: saved ? theme.colors.success : theme.colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: theme.borderRadius.md,
          fontSize: "1.1rem",
          fontWeight: theme.fontWeights.semibold,
          cursor: saving ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(139, 92, 246, 0.25)",
        }}
      >
        {saved ? "✓ Gespeichert!" : saving ? "Speichert..." : "Profil speichern"}
      </button>

    </div>
  );
}

const styles = {
  card: {
    backgroundColor: theme.colors.surface,
    border: "1px solid " + theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: "32px",
    marginBottom: "24px",
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
    marginBottom: "24px",
    paddingBottom: "12px",
    borderBottom: "1px solid " + theme.colors.border,
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    backgroundColor: theme.colors.background,
    border: "1px solid " + theme.colors.border,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.md,
    boxSizing: "border-box",
    outline: "none",
  },
  chip: {
    padding: "8px 16px",
    borderRadius: "999px",
    border: "1px solid " + theme.colors.border,
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: theme.fontSizes.sm,
    transition: "all 0.15s ease",
  },
  smallButton: {
    padding: "10px 20px",
    backgroundColor: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    cursor: "pointer",
  },
  socialRow: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    border: "1px solid " + theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  socialPrefix: {
    padding: "14px 12px",
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRight: "1px solid " + theme.colors.border,
    whiteSpace: "nowrap",
  },
  socialInput: {
    flex: 1,
    padding: "14px 12px",
    backgroundColor: "transparent",
    border: "none",
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.md,
    outline: "none",
  },
};