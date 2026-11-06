import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  Video, 
  Smile, 
  Paperclip, 
  Send, 
  MapPin, 
  Compass, 
  MoreVertical,
  X,
  Sparkles
} from 'lucide-react';
import { Conversation, ChatMessage, User } from '../types';
import { ChatList } from '../components/chat/ChatList';
import { MessageBubble } from '../components/chat/MessageBubble';
import { Modal } from '../components/common/Modal';

interface ChatsPageProps {
  conversations: Conversation[];
  currentUser: User;
  onSendMessage: (conversationId: string, text: string, attachment?: ChatMessage['attachment']) => void;
  onViewFriendProfile?: (friendId: string) => void;
}

export const ChatsPage: React.FC<ChatsPageProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  onViewFriendProfile
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  // Call Modals
  const [callModal, setCallModal] = useState<{ isOpen: boolean; type: 'voice' | 'video'; name: string } | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const quickEmojis = ['✨', '📍', '🏔️', '☕', '🔥', '🌌', '🚀', '🙌'];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeConversation.id, inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleSharePlaceAttachment = () => {
    onSendMessage(
      activeConversation.id,
      'Sharing this curious location with you!',
      {
        type: 'location',
        title: 'Helix Botanical Sky Conservatory',
        subtitle: 'SoMa Arts District · 1.1 km away'
      }
    );
    setShowAttachmentMenu(false);
  };

  return (
    <div className="rounded-3xl bg-white border border-[#A8C9B2]/50 backdrop-blur-xl shadow-lg shadow-[#285943]/05 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[560px]">
      {/* Left Column: Conversation Directory */}
      <div className={`w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-[#EDF5EE] flex flex-col bg-[#EDF5EE]/30 shrink-0 ${activeConvId && 'hidden md:flex'}`}>
        {/* Search Header */}
        <div className="p-4 border-b border-[#EDF5EE] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#243D32]">
              Expedition Chats
            </h2>
            <span className="text-[11px] font-mono text-[#285943] bg-[#DDF1E4] border border-[#A8C9B2]/50 px-2 py-0.5 rounded-full font-semibold">
              {conversations.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#285943] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts or chats..."
              className="w-full bg-white border border-[#A8C9B2]/50 focus:border-[#285943] rounded-xl py-2 pl-9 pr-4 text-xs text-[#243D32] placeholder-[#9BAA9F] focus:outline-none focus:ring-1 focus:ring-[#BDE5CF]"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList
            conversations={conversations}
            activeId={activeConvId}
            onSelect={(id) => setActiveConvId(id)}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Right Column: Active Conversation Pane */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Chat Header: Friend Profile & Action Triggers */}
          <div className="h-16 px-4 sm:px-6 border-b border-[#EDF5EE] flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md shrink-0">
            {/* Friend Profile Banner */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Back button for mobile */}
              <button
                type="button"
                onClick={() => setActiveConvId('')}
                className="md:hidden p-1.5 rounded-lg text-[#718579] hover:text-[#243D32]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeConversation.friendAvatar}
                  alt={activeConversation.friendName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#A8C9B2]/40 shadow-2xs"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                    activeConversation.isOnline ? 'bg-[#285943]' : 'bg-[#9BAA9F]'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <h3 className="font-display font-semibold text-sm text-[#243D32] truncate">
                  {activeConversation.friendName}
                </h3>
                <p className="text-[11px] text-[#718579] flex items-center gap-1.5 truncate">
                  <span className={activeConversation.isOnline ? 'text-[#285943] font-medium' : 'text-[#718579]'}>
                    {activeConversation.isOnline ? 'Active now' : activeConversation.lastActive}
                  </span>
                  <span>·</span>
                  <span>@{activeConversation.friendUsername}</span>
                </p>
              </div>
            </div>

            {/* Calling & Profile Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setCallModal({ isOpen: true, type: 'voice', name: activeConversation.friendName })}
                className="p-2 rounded-xl text-[#285943] hover:text-[#243D32] bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 transition-colors cursor-pointer"
                title="Voice Call"
              >
                <Phone className="w-4 h-4 text-[#285943]" />
              </button>

              <button
                type="button"
                onClick={() => setCallModal({ isOpen: true, type: 'video', name: activeConversation.friendName })}
                className="p-2 rounded-xl text-[#285943] hover:text-[#243D32] bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 transition-colors cursor-pointer"
                title="Video Call"
              >
                <Video className="w-4 h-4 text-[#285943]" />
              </button>
            </div>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F5FAF5]/30">
            <div className="flex justify-center my-2">
              <span className="text-[11px] font-mono text-[#718579] px-3 py-1 rounded-full bg-[#EDF5EE] border border-[#A8C9B2]/40">
                Encrypted · Direct RoAmigos Chat
              </span>
            </div>

            {activeConversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          {/* Quick Emoji Bar (Collapsible) */}
          {showEmojiPicker && (
            <div className="px-4 py-2 border-t border-[#EDF5EE] bg-[#EDF5EE]/60 flex items-center gap-2">
              <span className="text-[11px] text-[#718579] font-medium">Quick React:</span>
              <div className="flex items-center gap-1.5">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => prev + emoji);
                    }}
                    className="p-1 hover:bg-white rounded text-base transition-transform hover:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attachment Quick Menu */}
          {showAttachmentMenu && (
            <div className="p-3 border-t border-[#EDF5EE] bg-[#EDF5EE]/80 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSharePlaceAttachment}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EDF5EE] border border-[#A8C9B2]/50 text-[#285943] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5 text-[#285943]" />
                <span>Share Pinned Travel Spot</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputText((prev) => prev + ' 📍 [Coordinates: 37.7858° N, 122.4008° W] ');
                  setShowAttachmentMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EDF5EE] border border-[#A8C9B2]/50 text-[#243D32] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#285943]" />
                <span>Share Current GPS Location</span>
              </button>
            </div>
          )}

          {/* Message Input Bar */}
          <div className="p-3 sm:p-4 border-t border-[#EDF5EE] bg-white">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  showAttachmentMenu
                    ? 'bg-[#BDE5CF] border-[#A8C9B2] text-[#285943]'
                    : 'bg-[#EDF5EE] hover:bg-[#DDF1E4] border-[#A8C9B2]/40 text-[#718579] hover:text-[#243D32]'
                }`}
                title="Add Attachment or Location"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  showEmojiPicker
                    ? 'bg-[#BDE5CF] border-[#A8C9B2] text-[#285943]'
                    : 'bg-[#EDF5EE] hover:bg-[#DDF1E4] border-[#A8C9B2]/40 text-[#718579] hover:text-[#243D32]'
                }`}
                title="Add Reaction"
              >
                <Smile className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConversation.friendName}...`}
                className="flex-1 bg-white border border-[#A8C9B2]/50 focus:border-[#285943] rounded-xl py-2.5 px-4 text-xs sm:text-sm text-[#243D32] placeholder-[#9BAA9F] focus:outline-none focus:ring-1 focus:ring-[#BDE5CF]"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] disabled:opacity-40 disabled:pointer-events-none text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs transition-all cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-[#718579]">
          Select an explorer conversation to open chat.
        </div>
      )}

      {/* Voice & Video Call Prototype Notification Modal */}
      {callModal && (
        <Modal
          isOpen={callModal.isOpen}
          onClose={() => setCallModal(null)}
          title={callModal.type === 'voice' ? 'RoAmigos Audio Call' : 'RoAmigos Video Call'}
          subtitle={`Connecting secure channel with ${callModal.name}...`}
          maxWidth="sm"
        >
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative w-20 h-20 rounded-full bg-[#EDF5EE] border border-[#A8C9B2]/60 flex items-center justify-center text-[#285943] shadow-md shadow-[#285943]/08">
              <span className="absolute inset-0 rounded-full border border-[#BDE5CF] animate-ping opacity-60" />
              {callModal.type === 'voice' ? (
                <Phone className="w-8 h-8" />
              ) : (
                <Video className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <h4 className="font-display font-bold text-[#243D32] text-base">
                Calling {callModal.name}
              </h4>
              <p className="text-xs text-[#718579]">
                Direct audio channel staged for Firebase Realtime layer in next release.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCallModal(null)}
              className="px-6 py-2 rounded-xl bg-[#285943] hover:bg-[#3B7D5D] text-[#FFFDF4] font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              End Call
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
