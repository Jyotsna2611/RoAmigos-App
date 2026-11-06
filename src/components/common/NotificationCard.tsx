import React from 'react';
import { UserPlus, MessageSquare, Compass, Users, MapPin, Check, X } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onAction?: (notification: AppNotification, actionType: 'accept' | 'decline' | 'view') => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  onAction
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'friend_request':
        return <UserPlus className="w-4 h-4 text-[#285943]" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-[#285943]" />;
      case 'place_shared':
        return <Compass className="w-4 h-4 text-[#285943]" />;
      case 'group_invitation':
        return <Users className="w-4 h-4 text-[#285943]" />;
      case 'trip_update':
        return <MapPin className="w-4 h-4 text-[#285943]" />;
      default:
        return <Compass className="w-4 h-4 text-[#285943]" />;
    }
  };

  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      className={`relative p-4 rounded-2xl border transition-all duration-150 cursor-pointer ${
        notification.read
          ? 'bg-white/80 border-[#A8C9B2]/30 hover:border-[#A8C9B2]/60'
          : 'bg-white border-[#BDE5CF] shadow-sm shadow-[#285943]/05 hover:border-[#A8C9B2]'
      }`}
    >
      {!notification.read && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#285943] shadow-xs animate-pulse" />
      )}

      <div className="flex items-start gap-3.5">
        {/* Avatar with type badge */}
        <div className="relative shrink-0">
          <img
            src={notification.actor.avatar}
            alt={notification.actor.name}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-xl object-cover ring-1 ring-[#A8C9B2]/30"
          />
          <span className="absolute -bottom-1 -right-1 p-1 rounded-md bg-white border border-[#A8C9B2]/40 shadow-xs">
            {getIcon()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-[#243D32] truncate">
              {notification.title}
            </h4>
            <span aria-hidden="true" className="text-[#A8C9B2]">·</span>
            <span className="text-xs text-[#718579] font-mono">
              {notification.time}
            </span>
          </div>

          <p className="text-xs text-[#718579] mt-1 leading-relaxed">
            {notification.message}
          </p>

          {/* Interactive Actions if present */}
          {notification.actions && (
            <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
              {notification.actions.acceptLabel && (
                <button
                  type="button"
                  onClick={() => onAction?.(notification, 'accept')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#BDE5CF] text-[#285943] hover:bg-[#A8C9B2] border border-[#A8C9B2]/50 shadow-xs transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{notification.actions.acceptLabel}</span>
                </button>
              )}

              {notification.actions.declineLabel && (
                <button
                  type="button"
                  onClick={() => onAction?.(notification, 'decline')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EDF5EE] text-[#718579] hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-[#A8C9B2]/40 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{notification.actions.declineLabel}</span>
                </button>
              )}

              {notification.actions.viewLabel && (
                <button
                  type="button"
                  onClick={() => onAction?.(notification, 'view')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EDF5EE] text-[#285943] hover:bg-[#DDF1E4] border border-[#A8C9B2]/50 transition-all cursor-pointer"
                >
                  <span>{notification.actions.viewLabel}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
