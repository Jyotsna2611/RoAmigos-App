import React from 'react';
import { Bell, Settings, MapPin, Sparkles, Plus } from 'lucide-react';
import { NavTab, User } from '../../types';
import { CurioLogo } from '../common/CurioLogo';

interface TopHeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: User;
  unreadNotifsCount: number;
  currentLocation: string;
  onOpenLocationModal: () => void;
  onOpenNewPlaceModal?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  unreadNotifsCount,
  currentLocation,
  onOpenLocationModal,
  onOpenNewPlaceModal
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'Discovery Feed';
      case 'discover':
        return 'Explore Curiosities';
      case 'chats':
        return 'Direct & Group Dispatch';
      case 'friends':
        return 'Explorer Network';
      case 'groups':
        return 'Expedition Circles';
      case 'profile':
        return 'My Travel Log';
      case 'notifications':
        return 'Activity Radar';
      case 'settings':
        return 'Preferences & Security';
      default:
        return 'RoAmigos';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-[#A8C9B2]/40 shadow-xs px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Brand Logo / Desktop Page Title */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="lg:hidden">
          <CurioLogo size="sm" onClick={() => onSelectTab('home')} />
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <h1 className="font-display font-bold text-lg text-[#243D32] tracking-tight truncate">
            {getTabTitle()}
          </h1>
          <span className="text-[#A8C9B2]">·</span>
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#718579] hover:text-[#243D32] bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 transition-colors cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-[#285943]" />
            <span className="truncate max-w-[140px]">{currentLocation}</span>
          </button>
        </div>
      </div>

      {/* Right Slot: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenNewPlaceModal && (
          <button
            type="button"
            onClick={onOpenNewPlaceModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] border border-[#A8C9B2]/60 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Share Spot</span>
          </button>
        )}

        {/* Notifications Icon Button */}
        <button
          type="button"
          onClick={() => onSelectTab('notifications')}
          className="relative p-2 rounded-xl text-[#718579] hover:text-[#243D32] bg-white hover:bg-[#EDF5EE] border border-[#A8C9B2]/40 transition-colors cursor-pointer"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4 text-[#285943]" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#285943] text-white font-bold text-[9px] shadow-xs">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Settings button on mobile/tablet */}
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          className="lg:hidden p-2 rounded-xl text-[#718579] hover:text-[#243D32] bg-white hover:bg-[#EDF5EE] border border-[#A8C9B2]/40 transition-colors cursor-pointer"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 text-[#718579]" />
        </button>

        {/* User Avatar link to Profile */}
        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          className="relative shrink-0 ring-1.5 ring-[#A8C9B2]/60 hover:ring-[#285943] rounded-xl overflow-hidden transition-all cursor-pointer w-8 h-8 bg-[#DDF1E4] flex items-center justify-center shadow-xs"
          title="My Profile"
        >
          {user.photoURL || user.avatar ? (
            <img
              src={user.photoURL || user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-[#285943]">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
