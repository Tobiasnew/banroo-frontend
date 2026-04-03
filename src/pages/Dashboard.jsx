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

      if (error) {
        setLoading(false);
        return;
      }

      // Partner-Profile für jeden Roo laden
      const enriched = await Promise.all((data || []).map(async (roo) => {
        if (!roo.partner_id) return { ...roo, partner: null };

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, instrument")
          .eq("id", roo.partner_id)
          .maybeSingle();

        return { ...roo, partner: profile };
      }));

      setRoos(enriched);
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

      const enriched = await Promise.all((data || []).map(async (conv) => {
        const partnerId = conv.user1_id === user.id
          ? conv.user2_id : conv.user1_id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, instrument, genre")
          .eq("id", partnerId)
          .maybeSingle();

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
          <div style={{
            textAlign: "center",
            padding: theme.spacing.xl,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <p style={{ fontSize: "40px", marginBottom: theme.spacing.md }}>🎵</p>
            <p style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.sm }}>
              Noch keine Roos
            </p>
            <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
              Starte deinen ersten Roo und finde einen Partner!
            </p>
          </div>
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
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = theme.colors.primary}
                onMouseLeave={e => e.currentTarget.style.borderColor = theme.colors.border}
              >
                {/* Obere Zeile: Titel + Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, margin: 0 }}>
                    {roo.title}
                  </h3>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    backgroundColor: `${statusColor[roo.status] ?? theme.colors.primary}22`,
                    border: `1px solid ${statusColor[roo.status] ?? theme.colors.primary}`,
                    color: statusColor[roo.status] ?? theme.colors.primary,
                    fontSize: "12px",
                    fontWeight: theme.fontWeights.medium,
                    flexShrink: 0,
                  }}>
                    {roo.status}
                  </span>
                </div>

                {/* Untere Zeile: Partner + Meta */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {roo.partner ? (
                    <>
                      <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(124, 58, 237, 0.2)",
                        border: `1.5px solid ${theme.colors.primary}`,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        flexShrink: 0,
                      }}>
                        {roo.partner.avatar_url
                          ? <img src={roo.partner.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : "🎵"
                        }
                      </div>
                      <span style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
                        mit <span style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.medium }}>{roo.partner.username || "Unbekannt"}</span>
                      </span>
                    </>
                  ) : (
                    <span style={{ color: theme.colors.textMuted, fontSize: theme.fontSizes.sm }}>
                      Solo
                    </span>
                  )}
                  <span style={{ color: theme.colors.textMuted, fontSize: "12px", marginLeft: "auto" }}>
                    {roo.genre} · {new Date(roo.created_at).toLocaleDateString("de-DE")}
                  </span>
                </div>
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
          <div style={{
            textAlign: "center",
            padding: theme.spacing.xl,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${theme.colors.border}`,
          }}>
            <p style={{ fontSize: "40px", marginBottom: theme.spacing.md }}>💬</p>
            <p style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.sm }}>
              Noch keine Chats
            </p>
            <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
              Match jemanden und schreib ihm!
            </p>
          </div>
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
                  <p style={{ color: theme.colors.textMuted, fontSize: "12px", flexShrink: 0, margin: 0 }}>
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