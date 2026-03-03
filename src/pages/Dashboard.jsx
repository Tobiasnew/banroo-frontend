// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const statusColor = {
  "In Progress": theme.colors.primary,
  "Idee": theme.colors.accent,
  "Fertig": theme.colors.success,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roos, setRoos] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeTab, setActiveTab] = useState("roos");

  useEffect(() => {
    const fetchRoos = async () => {
      const { data, error } = await supabase
        .from("roos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setRoos(data);
      setLoading(false);
    };

    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        setLoadingChats(false);
        return;
      }

      // Partner-Profile laden
      const enriched = await Promise.all((data || []).map(async (conv) => {
        const partnerId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, instrument, genre")
          .eq("id", partnerId)
          .maybeSingle();

        // Letzte Nachricht laden
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        return { ...conv, partner: profile, lastMessage: lastMsg };
      }));

      setConversations(enriched);
      setLoadingChats(false);
    };

    fetchRoos();
    fetchConversations();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>

      <div style={{ marginBottom: theme.spacing.xl }}>
        <p style={{ color: theme.colors.primary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.semibold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
          ✦ Willkommen zurück
        </p>
        <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: "8px" }}>
          Dein Studio
        </h1>
        <p style={{ color: theme.colors.textSecondary }}>
          {user?.email}
        </p>
      </div>

      <button
        onClick={() => navigate("/match")}
        style={{
          width: "100%",
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: theme.borderRadius.md,
          fontSize: theme.fontSizes.md,
          fontWeight: theme.fontWeights.semibold,
          cursor: "pointer",
          marginBottom: theme.spacing.xl,
          textAlign: "left",
        }}
      >
        + Neuen Roo starten →
      </button>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", marginBottom: theme.spacing.xl, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: "4px" }}>
        {["roos", "chats"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: theme.borderRadius.sm,
              border: "none",
              backgroundColor: activeTab === tab ? theme.colors.primary : "transparent",
              color: activeTab === tab ? "#fff" : theme.colors.textSecondary,
              cursor: "pointer",
              fontSize: theme.fontSizes.sm,
              fontWeight: theme.fontWeights.semibold,
              transition: "all 0.2s",
            }}
          >
            {tab === "roos" ? "🎵 Meine Roos" : "💬 Chats"}
          </button>
        ))}
      </div>

      {/* Roos Tab */}
      {activeTab === "roos" && (
        loading ? (
          <p style={{ color: theme.colors.textSecondary }}>Lädt...</p>
        ) : roos.length === 0 ? (
          <p style={{ color: theme.colors.textSecondary }}>Noch keine Roos. Starte deinen ersten!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
            {roos.map(roo => (
              <div
                key={roo.id}
                onClick={() => navigate(`/roo/${roo.id}`)}
                style={{
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.lg,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = theme.colors.primary}
                onMouseLeave={e => e.currentTarget.style.borderColor = theme.colors.border}
              >
                <div>
                  <h3 style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, marginBottom: "4px" }}>
                    {roo.title}
                  </h3>
                  <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
                    {roo.genre} · {new Date(roo.created_at).toLocaleDateString("de-DE")}
                  </p>
                </div>
                <span style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  backgroundColor: `${statusColor[roo.status] ?? theme.colors.primary}22`,
                  border: `1px solid ${statusColor[roo.status] ?? theme.colors.primary}`,
                  color: statusColor[roo.status] ?? theme.colors.primary,
                  fontSize: theme.fontSizes.sm,
                  fontWeight: theme.fontWeights.medium,
                }}>
                  {roo.status}
                </span>
              </div>
            ))}
          </div>
        )
      )}

      {/* Chats Tab */}
      {activeTab === "chats" && (
        loadingChats ? (
          <p style={{ color: theme.colors.textSecondary }}>Lädt...</p>
        ) : conversations.length === 0 ? (
          <p style={{ color: theme.colors.textSecondary }}>Noch keine Chats. Match jemanden und schreib ihm!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => navigate(`/chat/${conv.partner?.id}`)}
                style={{
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.lg,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.md,
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = theme.colors.primary}
                onMouseLeave={e => e.currentTarget.style.borderColor = theme.colors.border}
              >
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(124, 58, 237, 0.2)",
                  border: `2px solid ${theme.colors.primary}`,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}>
                  {conv.partner?.avatar_url
                    ? <img src={conv.partner.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : "🎵"
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, margin: 0, marginBottom: "4px" }}>
                    {conv.partner?.username || "Unbekannt"}
                  </p>
                  <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {conv.lastMessage?.content || "Noch keine Nachrichten"}
                  </p>
                </div>
                {conv.lastMessage && (
                  <p style={{ color: theme.colors.textMuted, fontSize: "12px", flexShrink: 0 }}>
                    {new Date(conv.lastMessage.created_at).toLocaleDateString("de-DE")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
}