import React from 'react';
import { MapPin, CheckCheck, Compass } from 'lucide-react';
import { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
  onOpenAttachment?: (attachment: NonNullable<ChatMessage['attachment']>) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onOpenAttachment
}) => {
  const isMine = message.isMine;

  return (
    <div className={`flex items-end gap-2.5 ${isMine ? 'justify-end' : 'justify-start'} group mb-3`}>
      {!isMine && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          referrerPolicy="no-referrer"
          className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#A8C9B2]/40 shrink-0 shadow-2xs"
        />
      )}

      <div className={`flex flex-col max-w-[85%] sm:max-w-md ${isMine ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isMine
              ? 'bg-[#DDF1E4] text-[#243D32] border border-[#A8C9B2]/50 font-medium rounded-br-xs shadow-xs'
              : 'bg-white text-[#243D32] rounded-bl-xs border border-[#A8C9B2]/40 shadow-xs'
          }`}
        >
          {/* Location Pin Attachment Card */}
          {message.attachment && message.attachment.type === 'location' && (
            <div
              onClick={() => onOpenAttachment?.(message.attachment!)}
              className={`p-3 rounded-xl mb-2 flex items-center gap-3 cursor-pointer transition-all ${
                isMine
                  ? 'bg-white/70 hover:bg-white border border-[#A8C9B2]/40 text-[#243D32]'
                  : 'bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 text-[#243D32]'
              }`}
            >
              <div className="p-2 rounded-lg bg-[#BDE5CF] text-[#285943]">
                <Compass className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="font-bold text-xs truncate text-[#243D32]">
                  {message.attachment.title}
                </p>
                <p className="text-[11px] truncate text-[#718579]">
                  {message.attachment.subtitle}
                </p>
              </div>
            </div>
          )}

          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>

        {/* Timestamp & Status */}
        <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-[#718579] font-mono">
          <span>{message.timestamp}</span>
          {isMine && <CheckCheck className="w-3.5 h-3.5 text-[#285943]" />}
        </div>
      </div>
    </div>
  );
};
