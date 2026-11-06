import React from 'react';
import { Home, Compass, MessageSquare, UserCheck, Users, User } from 'lucide-react';
import { NavTab } from '../../types';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadChatsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  unreadChatsCount
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'discover' as NavTab, label: 'Discover', icon: <Compass className="w-5 h-5" /> },
    { 
      id: 'chats' as NavTab, 
      label: 'Chats', 
      icon: <MessageSquare className="w-5 h-5" />,
      badge: unreadChatsCount > 0 ? unreadChatsCount : undefined
    },
    { id: 'friends' as NavTab, label: 'Friends', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'groups' as NavTab, label: 'Groups', icon: <Users className="w-5 h-5" /> },
    { id: 'profile' as NavTab, label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#A8C9B2]/40 px-2 py-1 safe-area-inset-bottom shadow-lg shadow-[#285943]/05">
      <div className="grid grid-cols-6 items-center h-14">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-colors cursor-pointer ${
                isActive ? 'text-[#285943]' : 'text-[#718579] hover:text-[#243D32]'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#285943] text-[#FFFDF4] font-bold text-[9px] shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#285943] mt-0.5 shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
