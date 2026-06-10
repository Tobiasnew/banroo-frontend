import { useState, useRef, useEffect, useCallback } from "react";
import { theme } from "../styles/theme";

// Globaler Sticky-Player: besitzt das einzige <audio>-Element der Listener-Seite.
// Welcher Track läuft, steuert die Seite über die Props – der Player kümmert sich
// nur um Wiedergabe, Fortschritt und Seek. Die Seite mountet ihn mit key={track.id},
// damit Fortschritt/Dauer bei Trackwechsel automatisch zurückgesetzt werden.
export default function AudioPlayer({ track, isPlaying, onTogglePlay, onNext, onPrev, onEnded, hasNext, hasPrev }) {
  const audioRef = useRef(null);
  const barRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      // play() kann abgebrochen werden, wenn schnell umgeschaltet wird – ignorieren
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const seekTo = useCallback((clientX) => {
    const bar = barRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !audio.duration) return;
    const rect = bar.getBoundingClientRect();
    const percent = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    audio.currentTime = percent * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    seekTo(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      seekTo(e.clientX);
    }
  };

  if (!track) return null;

  const artistNames = (track.published_track_artists || [])
    .map(a => a.profiles?.username)
    .filter(Boolean)
    .join(", ");

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: "rgba(14, 11, 26, 0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderTop: `1px solid ${theme.colors.border}`,
      padding: "10px 16px calc(10px + env(safe-area-inset-bottom))",
    }}>
      <audio
        ref={audioRef}
        src={track.file_url}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => onEnded?.()}
      />

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", alignItems: "center", gap: theme.spacing.md }}>

        {/* Steuerung */}
        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs, flexShrink: 0 }}>
          <ControlButton onClick={onPrev} disabled={!hasPrev} label="Vorheriger Track">
            ⏮
          </ControlButton>
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Abspielen"}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: theme.colors.primary,
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              flexShrink: 0,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <ControlButton onClick={onNext} disabled={!hasNext} label="Nächster Track">
            ⏭
          </ControlButton>
        </div>

        {/* Track-Info + Fortschritt */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: theme.spacing.sm, marginBottom: "2px" }}>
            <span style={{
              color: theme.colors.textPrimary,
              fontWeight: theme.fontWeights.semibold,
              fontSize: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {track.title}
            </span>
            {artistNames && (
              <span style={{
                color: theme.colors.textSecondary,
                fontSize: "12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexShrink: 1,
              }}>
                {artistNames}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.sm }}>
            <span style={{ color: theme.colors.textMuted, fontSize: "11px", flexShrink: 0, width: "34px" }}>
              {formatTime(currentTime)}
            </span>
            {/* Großzügige Hitbox für Touch, der sichtbare Balken bleibt schlank */}
            <div
              ref={barRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              style={{
                flex: 1,
                height: "24px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                touchAction: "none",
              }}
            >
              <div style={{
                flex: 1,
                height: "4px",
                backgroundColor: theme.colors.surfaceHover,
                borderRadius: "2px",
                position: "relative",
              }}>
                <div style={{
                  height: "100%",
                  backgroundColor: theme.colors.primary,
                  borderRadius: "2px",
                  width: `${progress}%`,
                }} />
              </div>
            </div>
            <span style={{ color: theme.colors.textMuted, fontSize: "11px", flexShrink: 0, width: "34px", textAlign: "right" }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

function ControlButton({ onClick, disabled, label, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        backgroundColor: "transparent",
        border: "none",
        color: disabled ? theme.colors.textMuted : theme.colors.textSecondary,
        cursor: disabled ? "default" : "pointer",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

function formatTime(time) {
  if (!time || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
