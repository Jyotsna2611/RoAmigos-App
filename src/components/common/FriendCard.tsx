import React from 'react';
import { UserPlus, UserCheck, MessageSquare, MapPin } from 'lucide-react';
import { Friend } from '../../types';

interface FriendCardProps {
  friend: Friend;
  onToggleStatus: (friendId: string) => void;
  onMessage?: (friend: Friend) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  onToggleStatus,
  onMessage
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#A8C9B2]/40 hover:border-[#A8C9B2] shadow-xs hover:shadow-sm transition-all duration-150">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Profile Picture with Online Status Indicator */}
        <div className="relative shrink-0">
          <img
            src={friend.avatar}
            alt={friend.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#A8C9B2]/30"
          />
          <span
            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
              friend.online ? 'bg-[#285943] ring-white shadow-xs' : 'bg-[#9BAA9F]'
            }`}
            title={friend.online ? 'Online' : 'Offline'}
          />
        </div>

        {/* User Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-semibold text-sm text-[#243D32] truncate">
              {friend.name}
            </h4>
            <span className="text-xs text-[#718579] truncate">
              @{friend.username}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#718579] mt-1">
            <span className="flex items-center gap-1 text-[#243D32]">
              <MapPin className="w-3 h-3 text-[#285943] shrink-0" />
              <span>{friend.location}</span>
            </span>
            <span aria-hidden="true" className="text-[#A8C9B2]">·</span>
            <span className={friend.online ? 'text-[#285943] font-medium' : 'text-[#718579]'}>
              {friend.lastActive}
            </span>
            {friend.mutualFriends > 0 && (
              <>
                <span aria-hidden="true" className="text-[#A8C9B2]">·</span>
                <span className="text-[#285943] bg-[#EDF5EE] px-1.5 py-0.5 rounded font-mono text-[11px] font-medium">
                  {friend.mutualFriends} mutual
                </span>
              </>
            )}
          </div>

          {friend.sharedInterests && friend.sharedInterests.length > 0 && (
            <p className="text-[11px] text-[#718579] mt-1.5 truncate">
              Shared: {friend.sharedInterests.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {onMessage && friend.status === 'friend' && (
          <button
            type="button"
            onClick={() => onMessage(friend)}
            className="p-2 rounded-xl text-[#285943] hover:text-[#243D32] bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 transition-all cursor-pointer"
            title="Chat with friend"
          >
            <MessageSquare className="w-4 h-4 text-[#285943]" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onToggleStatus(friend.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            friend.status === 'friend'
              ? 'bg-[#EDF5EE] text-[#285943] border border-[#A8C9B2]/60 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
              : friend.status === 'pending_incoming'
              ? 'bg-[#BDE5CF] text-[#285943] hover:bg-[#A8C9B2] font-bold shadow-xs border border-[#A8C9B2]/60'
              : friend.status === 'pending_outgoing'
              ? 'bg-[#EDF5EE] text-[#9BAA9F] border border-[#A8C9B2]/30'
              : 'bg-[#BDE5CF] text-[#285943] hover:bg-[#A8C9B2] border border-[#A8C9B2]/60 shadow-xs'
          }`}
        >
          {friend.status === 'friend' ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Friends</span>
            </>
          ) : friend.status === 'pending_incoming' ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Accept Request</span>
            </>
          ) : friend.status === 'pending_outgoing' ? (
            <span>Requested</span>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
