import React from 'react';
import { NavTab, User } from '../../types';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TopHeader } from './TopHeader';

interface AppLayoutProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: User;
  unreadChatsCount: number;
  unreadNotifsCount: number;
  onLogout: () => void;
  currentLocation: string;
  onSelectLocation: () => void;
  onOpenNewPlaceModal?: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onSelectTab,
  user,
  unreadChatsCount,
  unreadNotifsCount,
  onLogout,
  currentLocation,
  onSelectLocation,
  onOpenNewPlaceModal,
  children
}) => {
  return (
    <div className="min-h-screen bg-[#F5FAF5] text-[#243D32] flex flex-col lg:flex-row antialiased relative overflow-x-hidden selection:bg-[#BDE5CF] selection:text-[#285943]">
      {/* Subtle Mint Explorer ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#BDE5CF]/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-1000" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-[#E9E2F7]/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-1/3 w-80 h-80 bg-[#FFFDF4]/80 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Desktop Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        user={user}
        unreadChatsCount={unreadChatsCount}
        unreadNotifsCount={unreadNotifsCount}
        onLogout={onLogout}
        currentLocation={currentLocation}
        onSelectLocation={onSelectLocation}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-16 lg:pb-0">
        <TopHeader
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          user={user}
          unreadNotifsCount={unreadNotifsCount}
          currentLocation={currentLocation}
          onOpenLocationModal={onSelectLocation}
          onOpenNewPlaceModal={onOpenNewPlaceModal}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        unreadChatsCount={unreadChatsCount}
      />
    </div>
  );
};
