// src/pages/Chat.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      // Partner-Profil laden
      const { data: partnerData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      setPartner(partnerData);

      // Conversation suchen oder erstellen
      const user1 = user.id < userId ? user.id : userId;
      const user2 = user.id < userId ? userId : user.id;

      let { data: conv } = await supabase
        .from("conversations")
        .select("*")
        .eq("user1_id", user1)
        .eq("user2_id", user2)
        .maybeSingle();

      if (!conv) {
        const { data: newConv } = await supabase
          .from("conversations")
          .insert({ user1_id: user1, user2_id: user2 })
          .select()
          .single();
        conv = newConv;
      }

      setConversationId(conv.id);

      // Nachrichten laden
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: true });

      setMessages(msgs || []);
      setLoading(false);
    };

    init();
  }, [userId]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;

    const content = input.trim();
    setInput("");

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      height: "100vh",
      backgroundColor: theme.colors.background,
      display: "flex",
      flexDirection: "column",
      maxWidth: "600px",
      margin: "0 auto",
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.md,
        padding: theme.spacing.lg,
        borderBottom: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.background,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: theme.colors.textSecondary, cursor: "pointer", fontSize: "20px", padding: 0 }}
        >
          ←
        </button>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: theme.colors.surface,
          border: `2px solid ${theme.colors.primary}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
        }}>
          {partner?.avatar_url
            ? <img src={partner.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "🎵"
          }
        </div>
        <div>
          <p style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, margin: 0 }}>
            {partner?.username || "Unbekannt"}
          </p>
          <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, margin: 0 }}>
            {partner?.instrument} · {partner?.genre}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: theme.spacing.lg,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.sm,
      }}>
        {loading ? (
          <p style={{ color: theme.colors.textSecondary, textAlign: "center" }}>Lädt...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: theme.colors.textSecondary, textAlign: "center", marginTop: "40px" }}>
            Noch keine Nachrichten. Sag Hallo! 👋
          </p>
        ) : (
          messages.map(msg => {
            const isOwn = msg.sender_id === user.id;
            return (
              <div key={msg.id} style={{
                display: "flex",
                justifyContent: isOwn ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  backgroundColor: isOwn ? theme.colors.primary : theme.colors.surface,
                  color: theme.colors.textPrimary,
                  fontSize: theme.fontSizes.sm,
                  lineHeight: "1.5",
                  border: isOwn ? "none" : `1px solid ${theme.colors.border}`,
                }}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: "flex",
        gap: theme.spacing.sm,
        padding: theme.spacing.lg,
        borderTop: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.background,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nachricht schreiben..."
          style={{
            flex: 1,
            padding: "12px 16px",
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "999px",
            color: theme.colors.textPrimary,
            fontSize: theme.fontSizes.md,
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: input.trim() ? theme.colors.primary : theme.colors.surface,
            color: "#fff",
            border: "none",
            cursor: input.trim() ? "pointer" : "not-allowed",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>

    </div>
  );
}