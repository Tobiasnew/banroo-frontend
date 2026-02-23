// src/pages/RooDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";

const statusOptions = ["Idee", "In Progress", "Fertig"];

const statusColor = {
  "In Progress": theme.colors.primary,
  "Idee": theme.colors.accent,
  "Fertig": theme.colors.success,
};

export default function RooDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roo, setRoo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoo = async () => {
      const { data, error } = await supabase
        .from("roos")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setRoo(data);
      setLoading(false);
    };

    fetchRoo();
  }, [id]);

  const updateStatus = async (newStatus) => {
    const { error } = await supabase
      .from("roos")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) setRoo(prev => ({ ...prev, status: newStatus }));
  };

  const deleteRoo = async () => {
    if (!confirm("Roo wirklich löschen?")) return;
    await supabase.from("roos").delete().eq("id", id);
    navigate("/app");
  };

  if (loading) return (
    <div style={{ padding: "40px", color: theme.colors.textSecondary }}>Lädt...</div>
  );

  if (!roo) return (
    <div style={{ padding: "40px", color: theme.colors.textSecondary }}>Roo nicht gefunden.</div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>

      {/* Back */}
      <button
        onClick={() => navigate("/app")}
        style={{
          background: "none",
          border: "none",
          color: theme.colors.textSecondary,
          cursor: "pointer",
          fontSize: theme.fontSizes.sm,
          marginBottom: theme.spacing.xl,
          padding: 0,
        }}
      >
        ← Zurück
      </button>

      {/* Header */}
      <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: theme.spacing.sm }}>
        {roo.title}
      </h1>
      <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.xl }}>
        {roo.genre} · Erstellt am {new Date(roo.created_at).toLocaleDateString("de-DE")}
      </p>

      {/* Status */}
      <div style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
      }}>
        <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.sm }}>
          Status
        </p>
        <div style={{ display: "flex", gap: theme.spacing.sm }}>
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: `1px solid ${roo.status === s ? statusColor[s] : theme.colors.border}`,
                backgroundColor: roo.status === s ? `${statusColor[s]}22` : "transparent",
                color: roo.status === s ? statusColor[s] : theme.colors.textSecondary,
                cursor: "pointer",
                fontSize: theme.fontSizes.sm,
                fontWeight: roo.status === s ? theme.fontWeights.semibold : theme.fontWeights.normal,
                transition: "all 0.2s",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={deleteRoo}
        style={{
          marginTop: theme.spacing.xl,
          background: "none",
          border: `1px solid #ef444444`,
          borderRadius: theme.borderRadius.md,
          color: "#ef4444",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: theme.fontSizes.sm,
          width: "100%",
        }}
      >
        Roo löschen
      </button>

    </div>
  );
}