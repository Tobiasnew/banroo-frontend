import { useState, useRef, useEffect } from "react";
import { theme } from "../styles/theme";

export default function AudioPlayer({ src, isPlaying, onPlay, onPause }) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
      setIsAudioPlaying(true);
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  }, [isPlaying]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      onPlay?.();
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      onPause?.();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.md,
    }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handlePause}
      />

      <button
        onClick={isAudioPlaying ? handlePause : handlePlay}
        style={{
          width: "40px",
          height: "40px",
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
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {isAudioPlaying ? "⏸" : "▶"}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          onClick={handleProgressClick}
          style={{
            height: "4px",
            backgroundColor: theme.colors.surfaceHover,
            borderRadius: "2px",
            cursor: "pointer",
            position: "relative",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              height: "100%",
              backgroundColor: theme.colors.primary,
              borderRadius: "2px",
              width: `${progress}%`,
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
          <span style={{
            color: theme.colors.textSecondary,
            fontSize: "12px",
            fontWeight: theme.fontWeights.semibold,
          }}>
            {formatTime(currentTime)}
          </span>
          <span style={{
            color: theme.colors.textMuted,
            fontSize: "12px",
          }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}