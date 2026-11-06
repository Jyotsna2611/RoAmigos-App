import React, { useState } from 'react';
import { Search, UserCheck, UserPlus, Users, Sparkles, Filter } from 'lucide-react';
import { Friend } from '../types';
import { FriendCard } from '../components/common/FriendCard';
import { EmptyState } from '../components/common/EmptyState';

interface FriendsPageProps {
  friends: Friend[];
  onToggleFriendStatus: (friendId: string) => void;
  onOpenChatWithFriend?: (friend: Friend) => void;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({
  friends,
  onToggleFriendStatus,
  onOpenChatWithFriend
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'suggestions'>('all');

  // Filter friends according to tab and search query
  const friendsList = friends.filter((f) => f.status === 'friend');
  const incomingRequests = friends.filter((f) => f.status === 'pending_incoming');
  const suggestedExplorers = friends.filter((f) => f.status === 'suggested');

  const matchesSearch = (f: Friend) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.sharedInterests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

  const displayedFriends = friendsList.filter(matchesSearch);
  const displayedRequests = incomingRequests.filter(matchesSearch);
  const displayedSuggestions = suggestedExplorers.filter(matchesSearch);

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Tabs Header */}
      <div className="rounded-3xl bg-[#EDF5EE] border border-[#A8C9B2]/50 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#243D32] tracking-tight">
              Explorer Network
            </h2>
            <p className="text-xs text-[#718579] mt-1">
              Connect with fellow wanderers, share coordinates, and form travel circles.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#285943] bg-white border border-[#A8C9B2]/40 px-3 py-1 rounded-xl font-semibold shadow-2xs">
              {friendsList.length} Connected Explorers
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#285943] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, handle, location, or shared interests..."
            className="w-full bg-white border border-[#A8C9B2]/50 focus:border-[#285943] rounded-2xl py-3 pl-11 pr-4 text-sm text-[#243D32] placeholder-[#9BAA9F] focus:outline-none focus:ring-2 focus:ring-[#BDE5CF]/50 shadow-2xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-[#A8C9B2]/30 pt-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#BDE5CF] text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32] bg-white border border-[#A8C9B2]/30'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Friends ({friendsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-[#BDE5CF] text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32] bg-white border border-[#A8C9B2]/30'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Friend Requests</span>
            {incomingRequests.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'requests' ? 'bg-[#285943] text-white' : 'bg-[#285943] text-[#FFFDF4]'
              }`}>
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suggestions')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'suggestions'
                ? 'bg-[#BDE5CF] text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32] bg-white border border-[#A8C9B2]/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suggestions ({suggestedExplorers.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Friend Requests Section */}
      {(activeTab === 'requests' || (activeTab === 'all' && incomingRequests.length > 0)) && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-[#285943] uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#285943]" />
              <span>Pending Requests ({incomingRequests.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedRequests.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onToggleStatus={onToggleFriendStatus}
                onMessage={onOpenChatWithFriend}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: All Friends List */}
      {(activeTab === 'all' || activeTab === 'requests' && incomingRequests.length === 0) && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-[#243D32] uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#285943]" />
              <span>Connected Friends ({displayedFriends.length})</span>
            </h3>
          </div>

          {displayedFriends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedFriends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onToggleStatus={onToggleFriendStatus}
                  onMessage={onOpenChatWithFriend}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No friends found"
              description={searchQuery ? `No friends matching "${searchQuery}".` : 'Start connecting with explorers nearby!'}
              actionLabel="Discover Explorers"
              onAction={() => setActiveTab('suggestions')}
            />
          )}
        </section>
      )}

      {/* Tab 3: Suggested Explorers */}
      {(activeTab === 'suggestions' || activeTab === 'all') && (
        <section className="space-y-3 pt-4 border-t border-[#EDF5EE]">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-[#243D32] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#285943]" />
              <span>Suggested Explorers Near You</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedSuggestions.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onToggleStatus={onToggleFriendStatus}
                onMessage={onOpenChatWithFriend}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
