import React from 'react';
import { Conversation } from '../../types';

interface ChatListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  activeId,
  onSelect,
  searchQuery
}) => {
  const filtered = conversations.filter((c) =>
    c.friendName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.friendUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400">
        No conversations match your search.
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#EDF5EE]">
      {filtered.map((conv) => {
        const isActive = conv.id === activeId;
        return (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`flex items-center gap-3.5 p-3.5 transition-all cursor-pointer ${
              isActive
                ? 'bg-[#EDF5EE] border-l-3 border-[#285943]'
                : 'hover:bg-[#EDF5EE]/40 border-l-3 border-transparent'
            }`}
          >
            {/* Avatar with Online Dot */}
            <div className="relative shrink-0">
              <img
                src={conv.friendAvatar}
                alt={conv.friendName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#A8C9B2]/30 shadow-2xs"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white ${
                  conv.isOnline ? 'bg-[#285943]' : 'bg-[#9BAA9F]'
                }`}
              />
            </div>

            {/* Conversation Snippet */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="font-semibold text-sm text-[#243D32] truncate">
                  {conv.friendName}
                </h4>
                <span className="text-[10px] text-[#718579] font-mono shrink-0">
                  {conv.lastMessageTime}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-[#718579] truncate leading-snug">
                  {conv.lastMessage}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-[#285943] text-[#FFFDF4] font-bold text-[10px] shadow-xs">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
