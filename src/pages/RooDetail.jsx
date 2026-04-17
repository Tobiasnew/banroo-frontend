// src/pages/RooDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { JitsiMeeting } from "@jitsi/react-sdk";

const statusOptions = ["Idee", "In Progress", "Fertig"];
const statusColor = {
  "In Progress": theme.colors.primary,
  "Idee": theme.colors.accent,
  "Fertig": theme.colors.success,
};

const ALLOWED_EXTENSIONS = [".wav", ".mp3", ".mid", ".midi", ".gp", ".gpx", ".zip"];

export default function RooDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [roo, setRoo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("session");

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const commentBottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef(null);

  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedTrack, setPublishedTrack] = useState(null);
  const [selectedFileForPublish, setSelectedFileForPublish] = useState(null);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishStep, setPublishStep] = useState(1);

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

    const fetchFiles = async () => {
      const { data } = await supabase
        .from("roo_files")
        .select("*")
        .eq("roo_id", id)
        .order("created_at", { ascending: false });
      setFiles(data || []);
    };

    const fetchComments = async () => {
      const { data } = await supabase
        .from("roo_comments")
        .select("*")
        .eq("roo_id", id)
        .order("created_at", { ascending: true });
      setComments(data || []);
    };

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("roo_messages")
        .select("*")
        .eq("roo_id", id)
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };

    const checkPublished = async () => {
      const { data } = await supabase
        .from("published_tracks")
        .select("*, roo_files(file_name)")
        .eq("roo_id", id)
        .maybeSingle();
      if (data) {
        setPublished(true);
        setPublishedTrack(data);
        setPublishTitle(data.title);
      }
    };

    fetchRoo();
    fetchFiles();
    fetchComments();
    fetchMessages();
    checkPublished();
  }, [id]);

  useEffect(() => {
    const channel = supabase
      .channel(`roo-comments:${id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "roo_comments",
        filter: `roo_id=eq.${id}`,
      }, (payload) => {
        setComments(prev => [...prev, payload.new]);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [id]);

  useEffect(() => {
    const channel = supabase
      .channel(`roo-chat:${id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "roo_messages",
        filter: `roo_id=eq.${id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [id]);

  useEffect(() => {
    commentBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`Nicht erlaubtes Format. Erlaubt: ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }

    setUploading(true);
    const path = `${id}/${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("roo-files")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      console.error("Upload Fehler:", uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("roo-files").getPublicUrl(path);

    const { data: fileRecord } = await supabase
      .from("roo_files")
      .insert({
        roo_id: id,
        user_id: user.id,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: ext,
      })
      .select()
      .single();

    if (fileRecord) setFiles(prev => [fileRecord, ...prev]);
    setUploading(false);
  };

  const handlePublish = async () => {
    if (!selectedFileForPublish || !publishTitle.trim()) return;
    setPublishing(true);

    const { data: track, error } = await supabase
      .from("published_tracks")
      .insert({
        roo_id: id,
        title: publishTitle.trim(),
        genre: roo.genre,
        file_url: selectedFileForPublish.file_url,
      })
      .select()
      .single();

    if (error) {
      console.error("Fehler beim Veröffentlichen:", error.message);
      setPublishing(false);
      return;
    }

    const artists = [{ track_id: track.id, user_id: user.id }];
    if (roo.partner_id && roo.partner_id !== user.id) {
      artists.push({ track_id: track.id, user_id: roo.partner_id });
    }
    await supabase.from("published_track_artists").insert(artists);

    setPublished(true);
    setPublishedTrack(track);
    setPublishing(false);
  };

  const handleUnpublish = async () => {
    if (!confirm("Veröffentlichung wirklich zurückziehen?")) return;
    await supabase.from("published_tracks").delete().eq("roo_id", id);
    setPublished(false);
    setPublishedTrack(null);
    setSelectedFileForPublish(null);
    setPublishTitle("");
    setPublishStep(1);
  };

  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    const content = commentInput.trim();
    setCommentInput("");
    await supabase.from("roo_comments").insert({
      roo_id: id,
      user_id: user.id,
      content,
    });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const content = chatInput.trim();
    setChatInput("");
    await supabase.from("roo_messages").insert({
      roo_id: id,
      user_id: user.id,
      content,
    });
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendComment(); }
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const getFileIcon = (type) => {
    if ([".wav", ".mp3"].includes(type)) return "🎵";
    if ([".mid", ".midi"].includes(type)) return "🎹";
    if ([".gp", ".gpx"].includes(type)) return "🎸";
    if (type === ".zip") return "📦";
    return "📄";
  };

  const mp3Files = files.filter(f => f.file_type === ".mp3");

  if (loading) return (
    <div style={{ padding: "40px", color: theme.colors.textSecondary }}>Lädt...</div>
  );

  if (!roo) return (
    <div style={{ padding: "40px", color: theme.colors.textSecondary }}>Roo nicht gefunden.</div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>

      <button
        onClick={() => navigate("/app")}
        style={{ background: "none", border: "none", color: theme.colors.textSecondary, cursor: "pointer", fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.xl, padding: 0 }}
      >
        ← Zurück
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: theme.spacing.sm }}>
        <div>
          <h1 style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.xxl, fontWeight: theme.fontWeights.bold, marginBottom: "4px" }}>
            {roo.title}
          </h1>
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
          fontWeight: theme.fontWeights.semibold,
        }}>
          {roo.status}
        </span>
      </div>

      <div style={{ display: "flex", gap: theme.spacing.sm, marginBottom: theme.spacing.xl }}>
        {statusOptions.map(s => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              border: `1px solid ${roo.status === s ? statusColor[s] : theme.colors.border}`,
              backgroundColor: roo.status === s ? `${statusColor[s]}22` : "transparent",
              color: roo.status === s ? statusColor[s] : theme.colors.textSecondary,
              cursor: "pointer",
              fontSize: theme.fontSizes.sm,
              transition: "all 0.2s",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Veröffentlichen Block */}
      {roo.status === "Fertig" && (
        <div style={{
          backgroundColor: published ? "rgba(34, 197, 94, 0.1)" : "rgba(245, 158, 11, 0.1)",
          border: `1px solid ${published ? "#22c55e" : theme.colors.accent}`,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.xl,
        }}>
          {published ? (
            <div>
              <p style={{ color: "#22c55e", fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.md }}>
                ✓ Dieser Roo wurde veröffentlicht! 🎉
              </p>
              <div style={{
                padding: "12px 14px",
                borderRadius: theme.borderRadius.sm,
                border: `1px solid ${theme.colors.accent}`,
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: theme.spacing.sm,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.sm }}>
                  <span style={{ fontSize: "24px" }}>🎵</span>
                  <div>
                    <p style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.semibold, margin: 0 }}>
                      {publishedTrack?.title || publishTitle}
                    </p>
                    <p style={{ color: theme.colors.textSecondary, fontSize: "12px", margin: 0 }}>
                      {publishedTrack?.genre} · veröffentlicht
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUnpublish}
                  style={{
                    padding: "6px 12px",
                    borderRadius: theme.borderRadius.sm,
                    border: `1px solid #ef444466`,
                    backgroundColor: "transparent",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: "12px",
                    flexShrink: 0,
                  }}
                >
                  Zurückziehen
                </button>
              </div>
            </div>
          ) : (
            <>
              <p style={{ color: theme.colors.accent, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.sm }}>
                🎵 Roo veröffentlichen
              </p>

              {/* Schritt Anzeige */}
              <div style={{ display: "flex", gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
                {[1, 2].map(step => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: publishStep >= step ? theme.colors.accent : theme.colors.surface,
                      border: `1px solid ${publishStep >= step ? theme.colors.accent : theme.colors.border}`,
                      color: publishStep >= step ? "#fff" : theme.colors.textMuted,
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: theme.fontWeights.semibold,
                    }}>
                      {step}
                    </div>
                    <span style={{ color: publishStep >= step ? theme.colors.textPrimary : theme.colors.textMuted, fontSize: theme.fontSizes.sm }}>
                      {step === 1 ? "Finale MP3 wählen" : "Song benennen"}
                    </span>
                    {step < 2 && <span style={{ color: theme.colors.textMuted, marginLeft: "4px" }}>→</span>}
                  </div>
                ))}
              </div>

              {/* Schritt 1 */}
              {publishStep === 1 && (
                <>
                  <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.md }}>
                    Welche MP3 ist die finale Version?
                  </p>
                  {mp3Files.length === 0 ? (
                    <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
                      Keine MP3 gefunden. Lade zuerst die finale Version hoch.
                    </p>
                  ) : (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
                        {mp3Files.map(file => (
                          <div
                            key={file.id}
                            onClick={() => setSelectedFileForPublish(file)}
                            style={{
                              padding: "12px 14px",
                              borderRadius: theme.borderRadius.sm,
                              border: `1px solid ${selectedFileForPublish?.id === file.id ? theme.colors.accent : theme.colors.border}`,
                              backgroundColor: selectedFileForPublish?.id === file.id ? "rgba(245, 158, 11, 0.15)" : theme.colors.surface,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: theme.spacing.sm,
                            }}
                          >
                            <span style={{ fontSize: "20px" }}>🎵</span>
                            <div>
                              <p style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.semibold, margin: 0 }}>
                                {file.file_name}
                              </p>
                              <p style={{ color: theme.colors.textSecondary, fontSize: "12px", margin: 0 }}>
                                {new Date(file.created_at).toLocaleDateString("de-DE")}
                              </p>
                            </div>
                            {selectedFileForPublish?.id === file.id && (
                              <span style={{ marginLeft: "auto", color: theme.colors.accent, fontSize: "18px" }}>✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setPublishStep(2)}
                        disabled={!selectedFileForPublish}
                        style={{
                          width: "100%",
                          padding: theme.spacing.md,
                          backgroundColor: selectedFileForPublish ? theme.colors.accent : theme.colors.surface,
                          color: selectedFileForPublish ? "#fff" : theme.colors.textMuted,
                          border: "none",
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.fontSizes.md,
                          fontWeight: theme.fontWeights.semibold,
                          cursor: selectedFileForPublish ? "pointer" : "not-allowed",
                        }}
                      >
                        Weiter →
                      </button>
                    </>
                  )}
                </>
              )}

              {/* Schritt 2 */}
              {publishStep === 2 && (
                <>
                  <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, marginBottom: theme.spacing.md }}>
                    Wie heißt der Song?
                  </p>
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: theme.borderRadius.sm,
                    border: `1px solid ${theme.colors.accent}`,
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    marginBottom: theme.spacing.md,
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                  }}>
                    <span>🎵</span>
                    <span style={{ color: theme.colors.textPrimary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.semibold }}>
                      {selectedFileForPublish?.file_name}
                    </span>
                  </div>
                  <input
                    value={publishTitle}
                    onChange={e => setPublishTitle(e.target.value)}
                    placeholder="Song-Titel eingeben..."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: theme.colors.surface,
                      border: `1px solid ${publishTitle.trim() ? theme.colors.accent : theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      color: theme.colors.textPrimary,
                      fontSize: theme.fontSizes.md,
                      outline: "none",
                      marginBottom: theme.spacing.md,
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ display: "flex", gap: theme.spacing.sm }}>
                    <button
                      onClick={() => setPublishStep(1)}
                      style={{
                        flex: 1,
                        padding: theme.spacing.md,
                        backgroundColor: "transparent",
                        color: theme.colors.textSecondary,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.fontSizes.md,
                        cursor: "pointer",
                      }}
                    >
                      ← Zurück
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={publishing || !publishTitle.trim()}
                      style={{
                        flex: 2,
                        padding: theme.spacing.md,
                        backgroundColor: publishTitle.trim() ? theme.colors.accent : theme.colors.surface,
                        color: publishTitle.trim() ? "#fff" : theme.colors.textMuted,
                        border: "none",
                        borderRadius: theme.borderRadius.md,
                        fontSize: theme.fontSizes.md,
                        fontWeight: theme.fontWeights.semibold,
                        cursor: publishTitle.trim() ? "pointer" : "not-allowed",
                      }}
                    >
                      {publishing ? "Wird veröffentlicht..." : "🚀 Jetzt veröffentlichen"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", marginBottom: theme.spacing.xl, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: "4px" }}>
        {["session", "chat", "video"].map(tab => (
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
{tab === "session" ? "🎸 Session" : tab === "chat" ? "💬 Chat" : "📹 Video"}
          </button>
        ))}
      </div>

      {activeTab === "session" && (
        <div>
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            style={{
              width: "100%",
              padding: theme.spacing.lg,
              backgroundColor: "transparent",
              border: `2px dashed ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              color: theme.colors.textSecondary,
              cursor: "pointer",
              fontSize: theme.fontSizes.md,
              marginBottom: theme.spacing.lg,
            }}
          >
            {uploading ? "Lädt hoch..." : "＋ Datei hochladen (WAV, MP3, MIDI, GP, ZIP)"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".wav,.mp3,.mid,.midi,.gp,.gpx,.zip"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />

          {files.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: "center", marginTop: "20px", marginBottom: "40px" }}>
              Noch keine Dateien. Lade die erste Datei hoch!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md, marginBottom: theme.spacing.xl }}>
              {files.map((file, index) => (
                <div key={file.id} style={{
                  backgroundColor: theme.colors.surface,
                  border: `1px solid ${index === 0 ? theme.colors.primary : theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  padding: theme.spacing.lg,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.md,
                }}>
                  <span style={{ fontSize: "28px" }}>{getFileIcon(file.file_type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <p style={{ color: theme.colors.textPrimary, fontWeight: theme.fontWeights.semibold, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.file_name}
                      </p>
                      {index === 0 && (
                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", backgroundColor: `${theme.colors.primary}33`, color: theme.colors.primary, flexShrink: 0 }}>
                          Aktuell
                        </span>
                      )}
                    </div>
                    <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, margin: 0 }}>
                      {new Date(file.created_at).toLocaleDateString("de-DE")} {new Date(file.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {file.file_type === ".mp3" && (
                      <audio controls src={file.file_url} style={{ width: "100%", marginTop: "8px", height: "32px" }} />
                    )}
                  </div>
                  
                    <a href={file.file_url}
                    download={file.file_name}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "8px 14px",
                      borderRadius: theme.borderRadius.sm,
                      border: `1px solid ${theme.colors.border}`,
                      color: theme.colors.textSecondary,
                      textDecoration: "none",
                      fontSize: theme.fontSizes.sm,
                      flexShrink: 0,
                    }}
                  >
                    ↓
                  </a>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: `1px solid ${theme.colors.border}`, marginBottom: theme.spacing.xl }} />

          <h3 style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, fontWeight: theme.fontWeights.semibold, marginBottom: theme.spacing.md, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            🎵 Session Notes
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm, marginBottom: theme.spacing.md, minHeight: "100px" }}>
            {comments.length === 0 ? (
              <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
                Noch keine Session Notes. Schreib Ideen, Feedback oder Anweisungen zu deinen Dateien.
              </p>
            ) : (
              comments.map(comment => {
                const isOwn = comment.user_id === user.id;
                return (
                  <div key={comment.id} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      backgroundColor: isOwn ? `${theme.colors.primary}33` : theme.colors.surface,
                      border: `1px solid ${isOwn ? theme.colors.primary : theme.colors.border}`,
                      color: theme.colors.textPrimary,
                      fontSize: theme.fontSizes.sm,
                      lineHeight: "1.5",
                    }}>
                      {comment.content}
                      <p style={{ color: theme.colors.textSecondary, fontSize: "11px", margin: "4px 0 0 0" }}>
                        {new Date(comment.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={commentBottomRef} />
          </div>

          <div style={{ display: "flex", gap: theme.spacing.sm }}>
            <input
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={handleCommentKeyDown}
              placeholder="Session Note schreiben..."
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
              onClick={handleSendComment}
              disabled={!commentInput.trim()}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: commentInput.trim() ? theme.colors.primary : theme.colors.surface,
                color: "#fff",
                border: "none",
                cursor: commentInput.trim() ? "pointer" : "not-allowed",
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
      )}

      {activeTab === "chat" && (
        <div style={{ display: "flex", flexDirection: "column", height: "500px" }}>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: theme.spacing.sm, paddingBottom: theme.spacing.md }}>
            {messages.length === 0 ? (
              <p style={{ color: theme.colors.textSecondary, textAlign: "center", marginTop: "40px" }}>
                Noch keine Nachrichten. 💬
              </p>
            ) : (
              messages.map(msg => {
                const isOwn = msg.user_id === user.id;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
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
            <div ref={chatBottomRef} />
          </div>

          <div style={{ display: "flex", gap: theme.spacing.sm, paddingTop: theme.spacing.md, borderTop: `1px solid ${theme.colors.border}` }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
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
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: chatInput.trim() ? theme.colors.primary : theme.colors.surface,
                color: "#fff",
                border: "none",
                cursor: chatInput.trim() ? "pointer" : "not-allowed",
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
      )}
      {activeTab === "video" && (
        <div style={{
          borderRadius: theme.borderRadius.md,
          overflow: "hidden",
          border: "1px solid " + theme.colors.border,
          height: "500px",
        }}>
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={"banroo-roo-" + id}
            configOverwrite={{
              startWithAudioMuted: true,
              startWithVideoMuted: false,
              prejoinPageEnabled: true,
              disableModeratorIndicator: true,
              hideConferenceSubject: true,
            }}
            interfaceConfigOverwrite={{
              TOOLBAR_BUTTONS: [
                "microphone", "camera", "hangup",
                "chat", "raisehand", "tileview",
                "select-background", "fullscreen",
              ],
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
            }}
            userInfo={{
              displayName: user?.email?.split("@")[0] || "Musiker",
            }}
            getIFrameRef={(node) => {
              if (node) {
                node.style.height = "100%";
                node.style.width = "100%";
              }
            }}
          />
        </div>
      )}

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