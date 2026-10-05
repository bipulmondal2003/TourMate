"use client";

import Avatar from "@/components/ui/Avatar";
import { formatDate } from "@/utils/format";

export default function ConversationList({ conversations, activeId, onSelect, currentUserId }) {
  if (conversations.length === 0) {
    return <p className="text-sm text-charcoal/50 p-4">No conversations yet.</p>;
  }

  return (
    <div className="divide-y divide-black/5 dark:divide-white/5">
      {conversations.map((c) => {
        const other = c.participants.find((p) => p._id !== currentUserId) || c.participants[0];
        return (
          <button
            key={c._id}
            onClick={() => onSelect(c)}
            className={`w-full flex items-center gap-3 p-3 text-left hover:bg-black/5 dark:hover:bg-white/5 ${
              activeId === c._id ? "bg-gold-500/10" : ""
            }`}
          >
            <Avatar name={other?.name || "User"} src={other?.avatar} size={36} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{other?.name || "User"}</p>
              <p className="text-xs text-charcoal/50 dark:text-white/50 truncate">{c.lastMessage || "No messages yet"}</p>
            </div>
            <span className="text-[10px] text-charcoal/40 dark:text-white/40 shrink-0">{formatDate(c.lastMessageAt)}</span>
          </button>
        );
      })}
    </div>
  );
}
