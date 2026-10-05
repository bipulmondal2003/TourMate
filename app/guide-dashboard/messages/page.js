"use client";

import { useEffect, useState } from "react";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

export default function GuideMessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
        if (data.conversations.length > 0) setActive(data.conversations[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner full />;

  const otherUser = active?.participants.find((p) => p._id !== user?.id);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Messages</h1>
      <div className="grid md:grid-cols-[280px_1fr] gap-4 card overflow-hidden md:h-[560px]">
        <div className="border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            activeId={active?._id}
            onSelect={setActive}
            currentUserId={user?.id}
          />
        </div>
        <div className="p-2">
          <ChatWindow conversationId={active?._id} otherUser={otherUser} />
        </div>
      </div>
    </div>
  );
}
