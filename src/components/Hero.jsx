// src/components/Hero.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";

function Hero() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ musicians: 0, roos: 0, tracks: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesRes, roosRes, tracksRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("roos").select("id", { count: "exact", head: true }),
        supabase.from("published_tracks").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        musicians: profilesRes.count || 0,
        roos: roosRes.count || 0,
        tracks: tracksRes.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <section style={styles.hero}>
      {/* Glow-Effekte */}
      <div style={styles.glowViolet} />
      <div style={styles.glowOrange} />

      {/* Eyebrow */}
      <p style={styles.eyebrow}>✦ Musik-Kollaboration, neu gedacht</p>

      {/* Headline */}
      <h1 style={styles.title}>
        Mach Musik mit jemandem,{" "}
        <span style={styles.gradient}>den du noch nicht kennst.</span>
      </h1>

      {/* Subtext */}
      <p style={styles.subtitle}>
        Banroo matcht dich mit anderen Musikern. Zusammen baut ihr einen Song –
        von der ersten Idee bis zum fertigen Track. Einfach loslegen.
      </p>

      {/* CTA Button */}
      <button
        style={styles.ctaButton}
        onClick={() => navigate("/match")}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.colors.primaryHover;
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 8px 30px rgba(139, 92, 246, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = theme.colors.primary;
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.25)";
        }}
      >
        Jetzt Matchen →
      </button>

      {/* Trust-Zeile */}
      <p style={styles.trust}>Kostenlos. Kein Download. Direkt im Browser.</p>

      {/* Live Stats */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <span style={styles.statNumber}>{stats.musicians}</span>
          <span style={styles.statLabel}>Musiker</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <span style={styles.statNumber}>{stats.roos}</span>
          <span style={styles.statLabel}>Roos gestartet</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.stat}>
          <span style={styles.statNumber}>{stats.tracks}</span>
          <span style={styles.statLabel}>Songs released</span>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    position: "relative",
    textAlign: "center",
    padding: "100px 20px 80px",
    maxWidth: "820px",
    margin: "0 auto",
    overflow: "hidden",
  },

  // Glow-Effekte
  glowViolet: {
    position: "absolute",
    top: "5%",
    left: "30%",
    width: "500px",
    height: "400px",
    background: "radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  glowOrange: {
    position: "absolute",
    top: "20%",
    right: "20%",
    width: "400px",
    height: "350px",
    background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },

  // Eyebrow
  eyebrow: {
    position: "relative",
    zIndex: 1,
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "28px",
  },

  // Headline
  title: {
    position: "relative",
    zIndex: 1,
    fontSize: "clamp(2rem, 6vw, 3.8rem)",
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    lineHeight: 1.15,
    marginBottom: "24px",
    letterSpacing: "-0.02em",
  },
gradient: {
    background: "linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline",
  },
  // Subtext
  subtitle: {
    position: "relative",
    zIndex: 1,
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    color: theme.colors.textSecondary,
    lineHeight: 1.7,
    marginBottom: "40px",
    maxWidth: "560px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  // CTA
  ctaButton: {
    position: "relative",
    zIndex: 1,
    backgroundColor: theme.colors.primary,
    color: "#fff",
    padding: "18px 40px",
    border: "none",
    borderRadius: theme.borderRadius.md,
    fontSize: "1.1rem",
    fontWeight: theme.fontWeights.semibold,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.25)",
    marginBottom: "16px",
  },

  // Trust
  trust: {
    position: "relative",
    zIndex: 1,
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
    marginBottom: "48px",
  },

  // Stats
  statsRow: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  statNumber: {
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
  },
  statDivider: {
    width: "1px",
    height: "36px",
    backgroundColor: theme.colors.border,
  },
};

export default Hero;