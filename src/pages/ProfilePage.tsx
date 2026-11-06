import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, 
  MapPin, 
  Calendar, 
  Users, 
  Bookmark, 
  Compass, 
  Sparkles,
  Plane,
  Camera,
  Trash2,
  Check,
  AlertCircle,
  AtSign,
  User as UserIcon,
  X,
  Plus,
  Lock,
  Heart,
  Image as ImageIcon
} from 'lucide-react';
import { User, Place, Group, Trip, TripInput, Friend } from '../types';
import { PlaceCard } from '../components/common/PlaceCard';
import { Modal } from '../components/common/Modal';
import { checkUsernameAvailability, uploadProfilePicture } from '../services/users/userService';
import { subscribeUserTrips, createTrip, updateTrip, deleteTrip } from '../services/trips/tripService';
import { TripCard } from '../components/trips/TripCard';
import { TripCreateEditModal } from '../components/trips/TripCreateEditModal';
import { TripDetailModal } from '../components/trips/TripDetailModal';

interface ProfilePageProps {
  user: User;
  savedPlaces: Place[];
  userGroups: Group[];
  friends?: Friend[];
  onUpdateUser: (updatedUser: Partial<User>) => Promise<void> | void;
  onViewPlace: (place: Place) => void;
  onToggleSavePlace: (placeId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  savedPlaces,
  userGroups,
  friends = [],
  onUpdateUser,
  onViewPlace,
  onToggleSavePlace
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'saved' | 'groups'>('trips');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Trips real-time state
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  // Trip modals
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedTripDetail, setSelectedTripDetail] = useState<Trip | null>(null);

  // Edit profile form state
  const [name, setName] = useState(user.name || '');
  const [username, setUsername] = useState(user.username || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [interestsText, setInterestsText] = useState((user.interests || []).join(', '));
  
  // Profile picture state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.photoURL || user.avatar || '');
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);

  // Validation & status
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'same'>('same');
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to user trips from Firestore
  useEffect(() => {
    if (!user.uid) return;
    setTripsLoading(true);
    const unsubscribe = subscribeUserTrips(
      user.uid,
      (fetchedTrips) => {
        setTrips(fetchedTrips || []);
        setTripsLoading(false);
      },
      (err) => {
        console.warn('Failed to load trips for user:', err);
        setTripsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user.uid]);

  // Reset profile edit modal state when opened
  useEffect(() => {
    if (isEditModalOpen) {
      setName(user.name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setLocation(user.location || '');
      setInterestsText((user.interests || []).join(', '));
      setAvatarPreview(user.photoURL || user.avatar || '');
      setNewAvatarFile(null);
      setIsAvatarRemoved(false);
      setEditError(null);
      setEditSuccess(null);
      setUsernameStatus('same');
    }
  }, [isEditModalOpen, user]);

  const handleUsernameChange = (val: string) => {
    const clean = val.trim().toLowerCase().replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 30);
    setUsername(clean);
    setEditError(null);

    if (clean === user.username.toLowerCase()) {
      setUsernameStatus('same');
      return;
    }

    if (clean.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    setUsernameStatus('checking');

    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const isAvail = await checkUsernameAvailability(clean, user.uid);
        setUsernameStatus(isAvail ? 'available' : 'taken');
      } catch (err) {
        console.warn('Profile username availability check error:', err);
        setUsernameStatus('idle');
      }
    }, 350);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setEditError('Only image files (JPEG, PNG, WEBP) are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setEditError('Image file size must be less than 5MB.');
      return;
    }

    setNewAvatarFile(file);
    setIsAvatarRemoved(false);
    setEditError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setNewAvatarFile(null);
    setAvatarPreview(null);
    setIsAvatarRemoved(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(null);

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();

    if (!cleanName) {
      setEditError('Full name cannot be empty.');
      return;
    }

    if (!cleanUsername || cleanUsername.length < 3) {
      setEditError('Username must be at least 3 characters.');
      return;
    }

    if (usernameStatus === 'taken') {
      setEditError(`The username @${cleanUsername} is already taken by another explorer.`);
      return;
    }

    setEditLoading(true);
    try {
      let finalPhotoURL = user.photoURL || user.avatar;

      // Handle avatar updates
      if (isAvatarRemoved) {
        finalPhotoURL = '';
      } else if (newAvatarFile) {
        finalPhotoURL = await uploadProfilePicture(user.uid, newAvatarFile);
      }

      const parsedInterests = interestsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await onUpdateUser({
        name: cleanName,
        username: cleanUsername,
        bio: bio.trim(),
        location: location.trim() || 'San Francisco, CA',
        photoURL: finalPhotoURL,
        avatar: finalPhotoURL,
        interests: parsedInterests.length > 0 ? parsedInterests : ['Exploration'],
      });

      setEditSuccess('Profile coordinates updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 600);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // TRIP ACTIONS
  const handleOpenCreateTrip = () => {
    setEditingTrip(null);
    setIsCreateEditModalOpen(true);
  };

  const handleOpenEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsCreateEditModalOpen(true);
  };

  const handleSaveTrip = async (tripInput: TripInput) => {
    if (editingTrip) {
      await updateTrip(user.uid, editingTrip.id, tripInput);
      // Update selected trip detail if open
      if (selectedTripDetail && selectedTripDetail.id === editingTrip.id) {
        setSelectedTripDetail({
          ...selectedTripDetail,
          ...tripInput,
          photoCount: tripInput.photos?.length || 0,
          placeCount: tripInput.places?.length || 0,
          friendCount: tripInput.participants?.length || 0
        });
      }
    } else {
      await createTrip(user.uid, tripInput);
    }
  };

  const handleDeleteTrip = async (trip: Trip) => {
    const photoPaths = (trip.photos || [])
      .map((p) => p.storagePath)
      .filter((p): p is string => Boolean(p));

    await deleteTrip(user.uid, trip.id, photoPaths);
    if (selectedTripDetail && selectedTripDetail.id === trip.id) {
      setSelectedTripDetail(null);
    }
  };

  const currentAvatar = user.photoURL || user.avatar;

  return (
    <div className="space-y-8 pb-14 text-[#243D32]">
      {/* 1. Profile Header Card - Mint Explorer Theme */}
      <div className="relative rounded-3xl bg-white border border-[#A8C9B2]/50 shadow-sm overflow-hidden">
        {/* Cover Backdrop with soft nature gradient */}
        <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-[#EDF5EE] via-[#DDF1E4] to-[#E9E2F7] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#285943_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#BDE5CF]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-60 h-60 bg-[#E9E2F7]/35 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            {/* Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl bg-[#EDF5EE] shrink-0">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#DDF1E4] flex items-center justify-center text-[#285943]">
                  <UserIcon className="w-12 h-12" />
                </div>
              )}
              <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-[#285943] ring-2 ring-white" />
            </div>

            {/* Quick Actions (Edit Profile + Create Trip) */}
            <div className="flex items-center gap-2.5 self-start sm:self-end">
              <button
                type="button"
                onClick={handleOpenCreateTrip}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] text-xs font-bold border border-[#A8C9B2]/60 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Trip</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-[#EDF5EE] text-[#243D32] border border-[#A8C9B2]/40 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#285943]" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* User Names & Bio */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#243D32]">
                  {user.name}
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDF5EE] text-[#285943] border border-[#A8C9B2]/50 font-mono uppercase tracking-wider">
                  EXPLORER
                </span>
              </div>
              <p className="text-xs text-[#718579] mt-0.5 font-medium">@{user.username}</p>
            </div>

            <p className="text-sm text-[#718579] max-w-2xl leading-relaxed">
              {user.bio || 'Wandering secret coastlines, recording memories, and finding authentic local spaces.'}
            </p>

            {/* Location & Joined Date */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#718579] pt-1 font-medium">
              <span className="flex items-center gap-1.5 text-[#243D32]">
                <MapPin className="w-3.5 h-3.5 text-[#285943]" />
                <span>{user.location || 'San Francisco, CA'}</span>
              </span>
              <span aria-hidden="true" className="text-[#A8C9B2]">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#285943]" />
                <span>Joined {user.joinedDate}</span>
              </span>
            </div>

            {/* Curiosity Interests Tags */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#718579] uppercase tracking-wider block mb-2">
                Travel Curiosities:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {(user.interests || ['Exploration']).map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-xl bg-[#EDF5EE] border border-[#A8C9B2]/40 text-xs text-[#285943] font-semibold"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#EDF5EE]">
            <div className="p-3.5 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30 text-center">
              <span className="font-display font-extrabold text-2xl text-[#243D32] font-mono tabular-nums">
                {trips.length}
              </span>
              <span className="block text-xs text-[#718579] font-medium mt-0.5">Trips & Memories</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30 text-center">
              <span className="font-display font-extrabold text-2xl text-[#285943] font-mono tabular-nums">
                {savedPlaces.length || user.stats?.savedPlacesCount || 0}
              </span>
              <span className="block text-xs text-[#718579] font-medium mt-0.5">Saved Places</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30 text-center">
              <span className="font-display font-extrabold text-2xl text-[#285943] font-mono tabular-nums">
                {friends.length || user.stats?.friendsCount || 0}
              </span>
              <span className="block text-xs text-[#718579] font-medium mt-0.5">Travel Friends</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30 text-center">
              <span className="font-display font-extrabold text-2xl text-[#285943] font-mono tabular-nums">
                {userGroups.length || user.stats?.groupsCount || 0}
              </span>
              <span className="block text-xs text-[#718579] font-medium mt-0.5">Circles</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tabs: My Trips / Saved Places / Circles */}
      <div className="space-y-6">
        <div className="flex p-1 bg-white rounded-2xl border border-[#A8C9B2]/40 max-w-lg shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('trips')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'trips'
                ? 'bg-[#BDE5CF] text-[#285943] border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32]'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>My Trips ({trips.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-[#BDE5CF] text-[#285943] border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Places ({savedPlaces.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'groups'
                ? 'bg-[#BDE5CF] text-[#285943] border border-[#A8C9B2]/60 shadow-xs'
                : 'text-[#718579] hover:text-[#243D32]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Circles ({userGroups.length})</span>
          </button>
        </div>

        {/* Tab 1: MY TRIPS & MEMORIES */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-[#243D32]">
                  Travel Collections & Memories
                </h3>
                <p className="text-xs text-[#718579]">
                  Journeys you've completed, sunset vista photos, and travel memories with companions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateTrip}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#A8C9B2]/50 hover:bg-[#EDF5EE] text-[#285943] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Journey</span>
              </button>
            </div>

            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onOpen={(t) => setSelectedTripDetail(t)}
                    onEdit={(t) => handleOpenEditTrip(t)}
                    onDelete={(t) => handleDeleteTrip(t)}
                    isOwner={true}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 px-6 text-center rounded-3xl bg-white border border-dashed border-[#A8C9B2]/60 space-y-4 max-w-xl mx-auto shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-[#EDF5EE] text-[#285943] flex items-center justify-center mx-auto shadow-inner">
                  <Plane className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-lg text-[#243D32]">
                    No trip memories recorded yet
                  </h4>
                  <p className="text-xs text-[#718579] leading-relaxed max-w-sm mx-auto">
                    Preserve your favorite weekend wanderings, beach escapes, and road trips with stories, day timelines, and photo highlights.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenCreateTrip}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] font-bold text-xs border border-[#A8C9B2]/60 shadow-xs cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Trip</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: SAVED PLACES */}
        {activeTab === 'saved' && (
          <div>
            {savedPlaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onView={onViewPlace}
                    onToggleSave={onToggleSavePlace}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-3xl bg-white border border-dashed border-[#A8C9B2]/60 max-w-md mx-auto space-y-2">
                <Bookmark className="w-8 h-8 text-[#A8C9B2] mx-auto" />
                <h4 className="font-display font-bold text-sm text-[#243D32]">No saved curiosities yet</h4>
                <p className="text-xs text-[#718579]">
                  Bookmark places from the Discover tab to build your travel bucket list.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: MY CIRCLES */}
        {activeTab === 'groups' && (
          <div>
            {userGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-4.5 rounded-3xl bg-white border border-[#A8C9B2]/40 flex items-center gap-3.5 shadow-xs hover:border-[#A8C9B2] transition-colors"
                  >
                    <img
                      src={group.avatar}
                      alt={group.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#EDF5EE]"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-[#243D32] truncate">{group.name}</h4>
                      <p className="text-xs text-[#718579] font-medium">{group.memberCount} members</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-3xl bg-white border border-dashed border-[#A8C9B2]/60 max-w-md mx-auto space-y-2">
                <Users className="w-8 h-8 text-[#A8C9B2] mx-auto" />
                <h4 className="font-display font-bold text-sm text-[#243D32]">No circles joined yet</h4>
                <p className="text-xs text-[#718579]">
                  Join explorer circles from the Circles tab to plan journeys with others.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* TRIP CREATE / EDIT MODAL */}
      <TripCreateEditModal
        isOpen={isCreateEditModalOpen}
        onClose={() => setIsCreateEditModalOpen(false)}
        onSave={handleSaveTrip}
        initialTrip={editingTrip}
        userId={user.uid}
        availableFriends={friends}
      />

      {/* TRIP DETAIL VIEW MODAL */}
      <TripDetailModal
        isOpen={Boolean(selectedTripDetail)}
        onClose={() => setSelectedTripDetail(null)}
        trip={selectedTripDetail}
        onEdit={(t) => handleOpenEditTrip(t)}
        onDelete={(t) => handleDeleteTrip(t)}
        isOwner={true}
      />

      {/* REAL FIRESTORE EDIT PROFILE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !editLoading && setIsEditModalOpen(false)}
        title="Edit Explorer Profile"
        subtitle="Update your traveler profile, bio, handle, and avatar."
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs text-[#243D32]">
          {editError && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{editError}</span>
            </div>
          )}

          {editSuccess && (
            <div className="p-3 rounded-2xl bg-[#DDF1E4] border border-[#A8C9B2]/50 text-[#285943] text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-[#285943] shrink-0" />
              <span>{editSuccess}</span>
            </div>
          )}

          {/* Profile Picture Management */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#EDF5EE]/50 border border-[#A8C9B2]/40">
            <div className="relative w-16 h-16 rounded-2xl bg-[#DDF1E4] border border-[#A8C9B2]/40 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-8 h-8 text-[#285943]" />
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <label className="block text-xs font-bold text-[#243D32]">
                Explorer Avatar
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EDF5EE] text-[#285943] border border-[#A8C9B2]/50 text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                </label>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#243D32]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#EDF5EE]/40 border border-[#A8C9B2]/40 focus:border-[#285943] focus:bg-white rounded-xl py-2 px-3 text-xs text-[#243D32] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#243D32]">Username (@handle)</label>
                {usernameStatus === 'checking' && (
                  <span className="text-[10px] text-[#718579]">checking...</span>
                )}
                {usernameStatus === 'available' && (
                  <span className="text-[10px] text-[#285943] font-semibold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> available
                  </span>
                )}
                {usernameStatus === 'taken' && (
                  <span className="text-[10px] text-red-500 font-semibold">taken</span>
                )}
              </div>
              <div className="relative">
                <AtSign className="w-3.5 h-3.5 text-[#9BAA9F] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className={`w-full bg-[#EDF5EE]/40 border rounded-xl py-2 pl-8 pr-3 text-xs text-[#243D32] focus:outline-none ${
                    usernameStatus === 'taken' ? 'border-red-400' : 'border-[#A8C9B2]/40 focus:border-[#285943] focus:bg-white'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#243D32]">Base Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA & Kyoto"
              className="w-full bg-[#EDF5EE]/40 border border-[#A8C9B2]/40 focus:border-[#285943] focus:bg-white rounded-xl py-2 px-3 text-xs text-[#243D32] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#243D32]">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your curiosities and wanderlust..."
              className="w-full bg-[#EDF5EE]/40 border border-[#A8C9B2]/40 focus:border-[#285943] focus:bg-white rounded-xl py-2 px-3 text-xs text-[#243D32] focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#243D32]">Interests (comma separated)</label>
            <input
              type="text"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              placeholder="e.g. Night Views, Secret Cafes, Cliff Hikes"
              className="w-full bg-[#EDF5EE]/40 border border-[#A8C9B2]/40 focus:border-[#285943] focus:bg-white rounded-xl py-2 px-3 text-xs text-[#243D32] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#EDF5EE]">
            <button
              type="button"
              disabled={editLoading}
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#243D32]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editLoading || usernameStatus === 'taken'}
              className="px-5 py-2.5 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] disabled:opacity-40 text-[#285943] font-bold text-xs border border-[#A8C9B2]/60 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {editLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-[#285943] border-t-transparent rounded-full animate-spin" />
              ) : (
                'Save Coordinates'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
