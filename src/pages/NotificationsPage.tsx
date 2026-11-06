import React, { useState } from 'react';
import { Bell, CheckCheck, Filter, Trash2 } from 'lucide-react';
import { AppNotification } from '../types';
import { NotificationCard } from '../components/common/NotificationCard';
import { EmptyState } from '../components/common/EmptyState';

interface NotificationsPageProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onAction?: (notification: AppNotification, actionType: 'accept' | 'decline' | 'view') => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onAction
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'requests') return n.type === 'friend_request';
    if (filterType === 'places') return n.type === 'place_shared';
    if (filterType === 'groups') return n.type === 'group_invitation' || n.type === 'trip_update';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-[#EDF5EE] border border-[#A8C9B2]/50 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#285943]" />
              <h2 className="font-display font-bold text-2xl text-[#243D32] tracking-tight">
                Activity Radar
              </h2>
            </div>
            <p className="text-xs text-[#718579] mt-1">
              Friend invitations, shared curiosities, and circle expedition updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#DDF1E4] text-xs font-semibold text-[#285943] border border-[#A8C9B2]/40 transition-all cursor-pointer self-start sm:self-center shrink-0 shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#285943]" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-t border-[#A8C9B2]/30 pt-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#BDE5CF] text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32] bg-white border border-[#A8C9B2]/30'
            }`}
          >
            All Activity ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'unread'
                ? 'bg-[#BDE5CF] text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32] bg-white border border-[#A8C9B2]/30'
            }`}
          >
            Unread ({unreadCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('requests')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'requests'
                ? 'bg-[#BDE5CF] text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32] bg-white border border-[#A8C9B2]/30'
            }`}
          >
            Requests
          </button>

          <button
            type="button"
            onClick={() => setFilterType('places')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'places'
                ? 'bg-[#BDE5CF] text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32] bg-white border border-[#A8C9B2]/30'
            }`}
          >
            Places Shared
          </button>

          <button
            type="button"
            onClick={() => setFilterType('groups')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'groups'
                ? 'bg-[#BDE5CF] text-[#285943] font-bold border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32] bg-white border border-[#A8C9B2]/30'
            }`}
          >
            Circles & Trips
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
              onAction={onAction}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="All caught up"
          description="No notifications currently match your filter. Check back when your circle shares new coordinates!"
          actionLabel="Show All Activity"
          onAction={() => setFilterType('all')}
        />
      )}
    </div>
  );
};
