import React from 'react';
import { 
  Compass, 
  Home, 
  MessageSquare, 
  Users, 
  UserCheck, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  MapPin
} from 'lucide-react';
import { NavTab, User as UserType } from '../../types';
import { CurioLogo } from '../common/CurioLogo';
import { AdventureAwaitsCard } from './AdventureAwaitsCard';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserType;
  unreadChatsCount: number;
  unreadNotifsCount: number;
  onLogout: () => void;
  currentLocation: string;
  onSelectLocation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  unreadChatsCount,
  unreadNotifsCount,
  onLogout,
  currentLocation,
  onSelectLocation
}) => {
  const mainNavItems = [
    { id: 'home' as NavTab, label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'discover' as NavTab, label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { 
      id: 'chats' as NavTab, 
      label: 'Chats', 
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadChatsCount > 0 ? unreadChatsCount : undefined 
    },
    { id: 'friends' as NavTab, label: 'Friends', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'groups' as NavTab, label: 'Groups', icon: <Users className="w-4 h-4" /> },
    { id: 'profile' as NavTab, label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 h-screen sticky top-0 bg-white/95 backdrop-blur-md border-r border-[#A8C9B2]/40 p-4 select-none shrink-0 z-30 shadow-xs overflow-y-auto overflow-x-hidden">
      {/* Brand & Location */}
      <div className="space-y-5">
        <div className="px-2 pt-2">
          <CurioLogo size="sm" onClick={() => onSelectTab('home')} />
        </div>

        {/* Location selector widget */}
        <div className="px-2">
          <button
            type="button"
            onClick={onSelectLocation}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 text-left transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-[#BDE5CF] text-[#285943] group-hover:scale-105 transition-transform">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className="text-[10px] text-[#718579] uppercase tracking-wider font-semibold">Location</div>
                <div className="text-xs text-[#243D32] font-semibold truncate">{currentLocation}</div>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#285943] px-2 py-0.5 rounded-md bg-white border border-[#A8C9B2]/40 shadow-2xs">
              Change
            </span>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#DDF1E4] text-[#285943] font-semibold shadow-xs border border-[#A8C9B2]/60'
                    : 'text-[#718579] hover:text-[#243D32] hover:bg-[#EDF5EE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#285943]' : 'text-[#718579]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-[#285943] text-[#FFFDF4] text-[10px] font-bold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation: Notifications, Settings, Profile Card */}
      <div className="pt-4 border-t border-[#EDF5EE] space-y-2">
        <button
          type="button"
          onClick={() => onSelectTab('notifications')}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            currentTab === 'notifications'
              ? 'bg-[#DDF1E4] text-[#285943] border border-[#A8C9B2]/60 font-semibold'
              : 'text-[#718579] hover:text-[#243D32] hover:bg-[#EDF5EE]'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-[#285943]" />
            <span>Notifications</span>
          </div>
          {unreadNotifsCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#285943] text-white text-[10px] font-bold">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            currentTab === 'settings'
              ? 'bg-[#DDF1E4] text-[#285943] border border-[#A8C9B2]/60 font-semibold'
              : 'text-[#718579] hover:text-[#243D32] hover:bg-[#EDF5EE]'
          }`}
        >
          <Settings className="w-4 h-4 text-[#718579]" />
          <span>Settings</span>
        </button>

        {/* Travel Postcard Illustration: Adventure Awaits */}
        <div className="py-1">
          <AdventureAwaitsCard />
        </div>

        {/* User preview */}
        <div className="p-2.5 rounded-xl bg-white border border-[#A8C9B2]/40 shadow-xs flex items-center justify-between gap-2 mt-1">
          <div 
            onClick={() => onSelectTab('profile')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
          >
            <div className="relative shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-[#DDF1E4] flex items-center justify-center ring-1 ring-[#A8C9B2]/50">
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
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#285943] ring-1 ring-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#243D32] group-hover:text-[#285943] truncate transition-colors">
                {user.name}
              </p>
              <p className="text-[10px] text-[#718579] truncate">
                @{user.username}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-[#718579] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
