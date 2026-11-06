import React, { useState } from 'react';
import { 
  Place, 
  Friend, 
  Group, 
  Conversation, 
  AppNotification, 
  User, 
  NavTab, 
  ChatMessage 
} from './types';
import { 
  currentUser as initialFallbackUser, 
  samplePlaces as initialPlaces, 
  sampleFriends as initialFriends, 
  sampleGroups as initialGroups, 
  sampleConversations as initialConversations, 
  sampleNotifications as initialNotifications 
} from './data/mockData';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Modal } from './components/common/Modal';
import { CurioLogo } from './components/common/CurioLogo';
import { APIProvider } from '@vis.gl/react-google-maps';
import { getGoogleMapsApiKey } from './services/places/placesService';

import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ChatsPage } from './pages/ChatsPage';
import { FriendsPage } from './pages/FriendsPage';
import { GroupsPage } from './pages/GroupsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

import { 
  MapPin, 
  Star, 
  Bookmark, 
  Share2, 
  Check, 
  Compass, 
  Plus, 
  Users,
  Navigation
} from 'lucide-react';

function AppContent() {
  const { user, firebaseUser, loading: authLoading, logout, updateProfileData } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Core Data States (persisting community places, mock friends, groups, and mock chats for stage 1)
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // App-level settings & active location
  const [currentLocation, setCurrentLocation] = useState('San Francisco, CA');
  const [discoverInitialCategory, setDiscoverInitialCategory] = useState('all');
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  // Client-Side Quota Defense Listener (Tier 1 & 2)
  React.useEffect(() => {
    const handleQuotaExceeded = () => {
      setIsQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // Modals
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isShareSpotModalOpen, setIsShareSpotModalOpen] = useState(false);

  // New Spot Form State
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotCategory, setNewSpotCategory] = useState<Place['category']>('Hidden Gems');
  const [newSpotDistance, setNewSpotDistance] = useState('1.5 km away');
  const [newSpotDesc, setNewSpotDesc] = useState('');
  const [newSpotLocation, setNewSpotLocation] = useState('Marin Headlands, CA');

  // Loading State while Firebase Auth initializes
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#FFFDF4] via-[#F5FAF5] to-[#EDF5EE] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#A8C9B2]/50 animate-ping" />
          <div className="w-20 h-20 rounded-3xl bg-white border border-[#A8C9B2]/60 flex items-center justify-center p-3 shadow-xl shadow-[#285943]/5">
            <CurioLogo size="md" />
          </div>
        </div>

        <h3 className="font-display font-extrabold text-xl text-[#243D32] tracking-tight">
          RoAmigos
        </h3>
        <p className="text-xs text-[#718579] mt-1 max-w-xs font-medium">
          Connecting explorer journeys & memories...
        </p>
      </div>
    );
  }

  // PROTECTED ROUTE CHECK:
  // If not authenticated, redirect to Login
  if (!firebaseUser || !user) {
    return <LoginPage onLoginSuccess={() => setCurrentTab('home')} />;
  }

  // Active Authenticated User Profile (real Firestore data)
  const activeUser: User = user;

  // Handlers
  const handleToggleSavePlace = (placeId: string) => {
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          const nextSaved = !p.saved;
          // Update user's stats
          updateProfileData({
            stats: {
              ...activeUser.stats,
              savedPlacesCount: nextSaved
                ? (activeUser.stats?.savedPlacesCount || 0) + 1
                : Math.max(0, (activeUser.stats?.savedPlacesCount || 0) - 1)
            }
          }).catch(console.warn);
          return { ...p, saved: nextSaved };
        }
        return p;
      })
    );

    if (selectedPlace && selectedPlace.id === placeId) {
      setSelectedPlace((prev) => (prev ? { ...prev, saved: !prev.saved } : null));
    }
  };

  const handleToggleFriendStatus = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friendId) {
          if (f.status === 'friend') {
            return { ...f, status: 'suggested' };
          } else if (f.status === 'pending_incoming') {
            return { ...f, status: 'friend' };
          } else if (f.status === 'suggested') {
            return { ...f, status: 'pending_outgoing' };
          } else {
            return { ...f, status: 'suggested' };
          }
        }
        return f;
      })
    );
  };

  const handleToggleJoinGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const nextIsMember = !g.isMember;
          return {
            ...g,
            isMember: nextIsMember,
            memberCount: nextIsMember ? g.memberCount + 1 : Math.max(1, g.memberCount - 1)
          };
        }
        return g;
      })
    );
  };

  const handleCreateGroup = (
    newGroupData: Omit<Group, 'id' | 'memberCount' | 'activity' | 'lastActive' | 'isMember' | 'members'>
  ) => {
    const newGroup: Group = {
      ...newGroupData,
      id: `grp_${Date.now()}`,
      memberCount: 1,
      activity: 'Circle newly established',
      lastActive: 'Just now',
      isMember: true,
      members: [
        {
          id: activeUser.id,
          name: activeUser.name,
          avatar: activeUser.photoURL || activeUser.avatar,
          role: 'Leader'
        }
      ]
    };
    setGroups((prev) => [newGroup, ...prev]);
    updateProfileData({
      stats: {
        ...activeUser.stats,
        groupsCount: (activeUser.stats?.groupsCount || 0) + 1
      }
    }).catch(console.warn);
  };

  const handleSendMessage = (
    conversationId: string,
    text: string,
    attachment?: ChatMessage['attachment']
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatar: activeUser.photoURL || activeUser.avatar,
      text,
      timestamp: timeStr,
      isMine: true,
      attachment
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: timeStr,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationAction = (
    notif: AppNotification,
    actionType: 'accept' | 'decline' | 'view'
  ) => {
    handleMarkNotificationRead(notif.id);

    if (notif.type === 'friend_request' && actionType === 'accept') {
      const actorUsername = notif.actor.username || notif.actor.name.toLowerCase().replace(/\s/g, '');
      const friendObj = friends.find((f) => f.username === actorUsername);
      if (friendObj) {
        handleToggleFriendStatus(friendObj.id);
      }
    } else if (notif.type === 'place_shared') {
      const place = places.find((p) => p.name === notif.targetDetails?.placeName);
      if (place) {
        setSelectedPlace(place);
      } else {
        setCurrentTab('discover');
      }
    } else if (notif.type === 'group_invitation' && actionType === 'accept') {
      const group = groups.find((g) => g.name === notif.targetDetails?.groupName);
      if (group) {
        handleToggleJoinGroup(group.id);
      }
      setCurrentTab('groups');
    }
  };

  const handleShareSpotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotName.trim()) return;

    const newPlace: Place = {
      id: `place_${Date.now()}`,
      name: newSpotName.trim(),
      category: newSpotCategory,
      distance: newSpotDistance,
      rating: 4.9,
      reviewsCount: 1,
      image: places[0]?.image || '',
      locationName: newSpotLocation.trim() || currentLocation,
      coordinates: { lat: 37.7749, lng: -122.4194 },
      tags: ['New Spot', 'Explorer Found'],
      description: newSpotDesc.trim() || 'A newly recorded curiosity shared with the RoAmigos network.',
      saved: true,
      priceLevel: '$$',
      bestTimeToVisit: 'Sunset & Dusk',
      curiosityScore: 97
    };

    setPlaces((prev) => [newPlace, ...prev]);
    setIsShareSpotModalOpen(false);
    setNewSpotName('');
    setNewSpotDesc('');
  };

  // Unread badge counts
  const unreadChatsCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Available worldwide locations
  const availableLocations = [
    'Visakhapatnam, India',
    'San Francisco, CA',
    'Kyoto, Japan',
    'Goa, India',
    'Reykjavik, Iceland',
    'Rome, Italy',
    'New York, NY',
    'Oaxaca, Mexico'
  ];

  return (
    <>
      {isQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <AppLayout
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={activeUser}
        unreadChatsCount={unreadChatsCount}
        unreadNotifsCount={unreadNotifsCount}
        onLogout={logout}
        currentLocation={currentLocation}
        onSelectLocation={() => setIsLocationModalOpen(true)}
        onOpenNewPlaceModal={() => setIsShareSpotModalOpen(true)}
      >
      {/* Dynamic View Router */}
      {currentTab === 'home' && (
        <HomePage
          user={activeUser}
          places={places}
          onToggleSave={handleToggleSavePlace}
          onViewPlace={(p) => setSelectedPlace(p)}
          onExploreCategory={(cat) => {
            setDiscoverInitialCategory(cat);
            setCurrentTab('discover');
          }}
          onNavigateToDiscover={() => {
            setDiscoverInitialCategory('all');
            setCurrentTab('discover');
          }}
        />
      )}

      {currentTab === 'discover' && (
        <DiscoverPage
          places={places}
          onToggleSave={handleToggleSavePlace}
          onViewPlace={(p) => setSelectedPlace(p)}
          currentLocation={currentLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          initialCategory={discoverInitialCategory}
          onSelectLocation={(loc) => setCurrentLocation(loc)}
        />
      )}

      {currentTab === 'chats' && (
        <ChatsPage
          conversations={conversations}
          currentUser={activeUser}
          onSendMessage={handleSendMessage}
        />
      )}

      {currentTab === 'friends' && (
        <FriendsPage
          friends={friends}
          onToggleFriendStatus={handleToggleFriendStatus}
          onOpenChatWithFriend={(friend) => {
            setCurrentTab('chats');
          }}
        />
      )}

      {currentTab === 'groups' && (
        <GroupsPage
          groups={groups}
          onToggleJoinGroup={handleToggleJoinGroup}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {currentTab === 'profile' && (
        <ProfilePage
          user={activeUser}
          savedPlaces={places.filter((p) => p.saved)}
          userGroups={groups.filter((g) => g.isMember)}
          friends={friends}
          onUpdateUser={updateProfileData}
          onViewPlace={(p) => setSelectedPlace(p)}
          onToggleSavePlace={handleToggleSavePlace}
        />
      )}

      {currentTab === 'notifications' && (
        <NotificationsPage
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onAction={handleNotificationAction}
        />
      )}

      {currentTab === 'settings' && (
        <SettingsPage
          user={activeUser}
          onLogout={logout}
        />
      )}

      {/* Place Detail Modal */}
      {selectedPlace && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPlace(null)}
          title={selectedPlace.name}
          subtitle={`${selectedPlace.category} · ${selectedPlace.locationName}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-[#EDF5EE]">
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#285943] border border-[#A8C9B2]/60 shadow-xs">
                  {selectedPlace.category}
                </span>
                {selectedPlace.priceLevel && (
                  <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[11px] font-mono text-[#243D32] border border-[#A8C9B2]/40 shadow-xs">
                    {selectedPlace.priceLevel}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#718579]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#243D32] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#285943]" />
                  <span>{selectedPlace.locationName}</span>
                </span>
                <span>·</span>
                <span>{selectedPlace.distance}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-amber-600 font-mono font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedPlace.rating.toFixed(2)}</span>
                  <span className="text-[#9BAA9F]">({selectedPlace.reviewsCount})</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#243D32] leading-relaxed">
              {selectedPlace.description}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#EDF5EE] border border-[#A8C9B2]/40 text-xs">
              <div>
                <span className="text-[#718579] block text-[11px]">Best Time To Visit</span>
                <span className="text-[#285943] font-semibold">{selectedPlace.bestTimeToVisit || 'Twilight & Evening'}</span>
              </div>
              <div>
                <span className="text-[#718579] block text-[11px]">Coordinates</span>
                <span className="text-[#243D32] font-mono">{selectedPlace.coordinates.lat.toFixed(4)}° N, {Math.abs(selectedPlace.coordinates.lng).toFixed(4)}° W</span>
              </div>
            </div>

            {selectedPlace.savedByFriends && selectedPlace.savedByFriends.length > 0 && (
              <div className="p-3 rounded-2xl bg-[#DDF1E4]/50 border border-[#A8C9B2]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#285943]" />
                  <span className="text-xs text-[#243D32] font-medium">
                    Saved by {selectedPlace.savedByFriends.map((f) => f.name).join(', ')}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#A8C9B2]/30">
              <button
                type="button"
                onClick={() => handleToggleSavePlace(selectedPlace.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedPlace.saved
                    ? 'bg-[#285943] text-[#FFFDF4] shadow-xs'
                    : 'bg-[#EDF5EE] text-[#243D32] hover:bg-[#DDF1E4] border border-[#A8C9B2]/50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${selectedPlace.saved ? 'fill-current' : ''}`} />
                <span>{selectedPlace.saved ? 'Saved in RoAmigos' : 'Save Spot'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlace(null);
                  setCurrentTab('chats');
                }}
                className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] border border-[#A8C9B2]/60 font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share with Friend</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Location Selector Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => {
          setIsLocationModalOpen(false);
          setCustomLocationInput('');
        }}
        title="Select Exploration Center"
        subtitle="Choose or enter your active exploration coordinates to discover worldwide curiosities."
        maxWidth="sm"
      >
        <div className="space-y-4">
          {/* Custom Location Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customLocationInput.trim()) {
                setCurrentLocation(customLocationInput.trim());
                setIsLocationModalOpen(false);
                setCustomLocationInput('');
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={customLocationInput}
              onChange={(e) => setCustomLocationInput(e.target.value)}
              placeholder="Enter any city or region (e.g. Visakhapatnam)..."
              className="flex-1 bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/40 rounded-xl py-2 px-3 text-xs text-[#243D32] placeholder:text-[#9BAA9F] outline-none"
            />
            <button
              type="submit"
              disabled={!customLocationInput.trim()}
              className="px-3 py-2 rounded-xl bg-[#285943] hover:bg-[#1f4634] disabled:opacity-50 text-[#FFFDF4] font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              Set
            </button>
          </form>

          <div className="text-[11px] font-bold uppercase tracking-wider text-[#718579]">
            Popular Worldwide Destinations
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {availableLocations.map((loc) => {
              const isSelected = loc === currentLocation;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setCurrentLocation(loc);
                    setIsLocationModalOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#DDF1E4] border-[#285943] text-[#285943] font-bold shadow-2xs'
                      : 'bg-white border-[#A8C9B2]/40 text-[#243D32] hover:bg-[#EDF5EE]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#285943]' : 'text-[#718579]'}`} />
                    <span className="text-xs">{loc}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#285943]" />}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Share Spot / Add Curiosity Modal */}
      <Modal
        isOpen={isShareSpotModalOpen}
        onClose={() => setIsShareSpotModalOpen(false)}
        title="Share a Curiosity Spot"
        subtitle="Pin a secret place, vista, or cafe for your friends to discover."
        maxWidth="md"
      >
        <form onSubmit={handleShareSpotSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#243D32]">Spot Name</label>
            <input
              type="text"
              required
              value={newSpotName}
              onChange={(e) => setNewSpotName(e.target.value)}
              placeholder="e.g. Hidden Tunnel Viewpoint, Lantern Alley"
              className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/40 rounded-xl py-2 px-3 text-xs text-[#243D32] placeholder:text-[#9BAA9F] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#243D32]">Category</label>
              <select
                value={newSpotCategory}
                onChange={(e) => setNewSpotCategory(e.target.value as any)}
                className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] rounded-xl py-2 px-2.5 text-xs text-[#243D32] focus:outline-none cursor-pointer"
              >
                <option value="Hidden Gems">Hidden Gems</option>
                <option value="Adventure">Adventure</option>
                <option value="Cafes">Cafes</option>
                <option value="Nature">Nature</option>
                <option value="Weekend Trips">Weekend Trips</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Rooftop">Rooftop</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#243D32]">Distance Estimate</label>
              <input
                type="text"
                value={newSpotDistance}
                onChange={(e) => setNewSpotDistance(e.target.value)}
                placeholder="e.g. 2.1 km away"
                className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] rounded-xl py-2 px-3 text-xs text-[#243D32] placeholder:text-[#9BAA9F] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#243D32]">Location Area</label>
            <input
              type="text"
              value={newSpotLocation}
              onChange={(e) => setNewSpotLocation(e.target.value)}
              placeholder="e.g. Marin Headlands Coast"
              className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] rounded-xl py-2 px-3 text-xs text-[#243D32] placeholder:text-[#9BAA9F] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#243D32]">Curiosity Description</label>
            <textarea
              rows={3}
              value={newSpotDesc}
              onChange={(e) => setNewSpotDesc(e.target.value)}
              placeholder="Describe what makes this spot atmospheric, special, or worth discovering..."
              className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] rounded-xl py-2 px-3 text-xs text-[#243D32] placeholder:text-[#9BAA9F] focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#A8C9B2]/30">
            <button
              type="button"
              onClick={() => setIsShareSpotModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#243D32] hover:bg-[#EDF5EE] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#285943] hover:bg-[#1f4634] text-[#FFFDF4] font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Pin to RoAmigos
            </button>
          </div>
        </form>
      </Modal>
      </AppLayout>
    </>
  );
}

export default function App() {
  const mapsApiKey = getGoogleMapsApiKey();

  return (
    <APIProvider apiKey={mapsApiKey} libraries={['places', 'marker']}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </APIProvider>
  );
}
