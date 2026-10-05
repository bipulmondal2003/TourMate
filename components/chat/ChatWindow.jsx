"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { MessageSquare } from "lucide-react";

/**
 * Polling-based chat (per the project's "reliable API/polling
 * version" fallback instead of true real-time sockets).
 */
export default function ChatWindow({ conversationId, otherUser }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    const res = await fetch(`/api/messages?conversationId=${conversationId}`);
    const data = await res.json();
    if (data.success) setMessages(data.messages);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000); // simple polling
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const optimistic = { _id: `tmp-${Date.now()}`, text, sender: { _id: user.id, name: user.name }, createdAt: new Date() };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, text: optimistic.text }),
    });
    loadMessages();
  };

  if (!conversationId) {
    return <EmptyState icon={MessageSquare} title="Select a conversation" message="Choose a chat from the list to start messaging." />;
  }

  return (
    <div className="flex flex-col h-[500px] card">
      <div className="flex items-center gap-2 p-4 border-b border-black/5 dark:border-white/5">
        <Avatar name={otherUser?.name || "User"} src={otherUser?.avatar} size={32} />
        <p className="font-semibold text-sm">{otherUser?.name || "Conversation"}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-sm text-center text-charcoal/50">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-center text-charcoal/50">No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender?._id === user?.id;
            return (
              <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    mine ? "bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-950" : "bg-black/5 dark:bg-white/10"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-black/5 dark:border-white/5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="input-field flex-1"
          aria-label="Message input"
        />
        <button type="submit" className="btn-primary px-4 py-2.5" aria-label="Send message">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
