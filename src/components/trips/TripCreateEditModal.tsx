import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Camera, 
  Users, 
  Lock, 
  UserCheck, 
  Plus, 
  Trash2, 
  Star, 
  Upload, 
  Check, 
  Loader2,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { Trip, TripInput, TripPlace, TripPhoto, TripParticipant, Friend } from '../../types';
import { uploadTripPhoto } from '../../services/trips/tripStorageService';

interface TripCreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tripData: TripInput) => Promise<void>;
  initialTrip?: Trip | null;
  userId: string;
  availableFriends?: Friend[];
}

export const TripCreateEditModal: React.FC<TripCreateEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTrip,
  userId,
  availableFriends = []
}) => {
  const isEditing = Boolean(initialTrip);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'friends'>('friends');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');

  // Sub-items
  const [places, setPlaces] = useState<TripPlace[]>([]);
  const [photos, setPhotos] = useState<TripPhoto[]>([]);
  const [participants, setParticipants] = useState<TripParticipant[]>([]);

  // Temp input states for adding items
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCity, setNewPlaceCity] = useState('');
  const [newPlaceNotes, setNewPlaceNotes] = useState('');
  const [newPlaceDay, setNewPlaceDay] = useState(1);
  const [newPlaceFavorite, setNewPlaceFavorite] = useState(false);

  // Friends selection helper
  const [selectedFriendId, setSelectedFriendId] = useState('');

  // Status & loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (initialTrip) {
      setTitle(initialTrip.title || '');
      setDescription(initialTrip.description || '');
      setStartDate(initialTrip.startDate || '');
      setEndDate(initialTrip.endDate || '');
      setVisibility(initialTrip.visibility || 'friends');
      setCoverPhotoUrl(initialTrip.coverPhotoUrl || '');
      setPlaces(initialTrip.places || []);
      setPhotos(initialTrip.photos || []);
      setParticipants(initialTrip.participants || []);
    } else {
      setTitle('');
      setDescription('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date().toISOString().split('T')[0]);
      setVisibility('friends');
      setCoverPhotoUrl('');
      setPlaces([]);
      setPhotos([]);
      setParticipants([]);
    }
    setErrorMsg(null);
  }, [initialTrip, isOpen]);

  if (!isOpen) return null;

  // Add a visited place
  const handleAddPlace = () => {
    if (!newPlaceName.trim()) return;
    const newPlace: TripPlace = {
      id: `plc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newPlaceName.trim(),
      city: newPlaceCity.trim() || '',
      notes: newPlaceNotes.trim() || '',
      day: Number(newPlaceDay) || 1,
      isFavorite: newPlaceFavorite
    };
    setPlaces([...places, newPlace]);
    setNewPlaceName('');
    setNewPlaceCity('');
    setNewPlaceNotes('');
    setNewPlaceFavorite(false);
  };

  const handleRemovePlace = (placeId: string) => {
    setPlaces(places.filter((p) => p.id !== placeId));
  };

  const handleTogglePlaceFavorite = (placeId: string) => {
    setPlaces(places.map((p) => p.id === placeId ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  // Add photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    setErrorMsg(null);

    const tripId = initialTrip?.id || `draft_${Date.now()}`;

    try {
      const newUploadedPhotos: TripPhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadTripPhoto(userId, tripId, file);
        const photoObj: TripPhoto = {
          id: `pho_${Date.now()}_${i}`,
          url: res.url,
          storagePath: res.storagePath,
          uploadedAt: new Date().toISOString(),
          day: 1,
          isFavorite: false
        };
        newUploadedPhotos.push(photoObj);

        // If no cover photo is set yet, default to the first uploaded photo
        if (!coverPhotoUrl && i === 0) {
          setCoverPhotoUrl(res.url);
        }
      }
      setPhotos((prev) => [...prev, ...newUploadedPhotos]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload photo.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(photos.filter((p) => p.id !== photoId));
    if (coverPhotoUrl && photos.find((p) => p.id === photoId)?.url === coverPhotoUrl) {
      const remaining = photos.filter((p) => p.id !== photoId);
      setCoverPhotoUrl(remaining[0]?.url || '');
    }
  };

  const handleTogglePhotoFavorite = (photoId: string) => {
    setPhotos(photos.map((p) => p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleUpdatePhotoCaption = (photoId: string, caption: string) => {
    setPhotos(photos.map((p) => p.id === photoId ? { ...p, caption } : p));
  };

  const handleUpdatePhotoDay = (photoId: string, day: number) => {
    setPhotos(photos.map((p) => p.id === photoId ? { ...p, day } : p));
  };

  // Add friend companion
  const handleAddFriend = () => {
    if (!selectedFriendId) return;
    const friend = availableFriends.find((f) => f.id === selectedFriendId);
    if (!friend) return;
    if (participants.some((p) => p.id === friend.id)) return;

    setParticipants([
      ...participants,
      {
        id: friend.id,
        name: friend.name,
        username: friend.username || '',
        avatar: friend.avatar || ''
      }
    ]);
    setSelectedFriendId('');
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please give your trip a title.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const finalCover = coverPhotoUrl || photos[0]?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
      const tripData: TripInput = {
        userId,
        title: title.trim(),
        description: description.trim(),
        startDate,
        endDate: endDate || startDate,
        coverPhotoUrl: finalCover,
        visibility,
        places,
        participants,
        photos
      };

      await onSave(tripData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#243D32]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl my-6 bg-white rounded-3xl border border-[#A8C9B2]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#A8C9B2]/40 bg-gradient-to-r from-[#FFFDF4] via-[#F5FAF5] to-[#EDF5EE] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#285943] text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#243D32]">
                {isEditing ? 'Edit Trip Collection' : 'Create New Trip & Memories'}
              </h2>
              <p className="text-xs text-[#718579]">
                Capture places, stories, photos, and friends from your adventures
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#718579] hover:text-[#243D32] hover:bg-[#EDF5EE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-sm text-[#243D32]">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* 1. Basic Trip Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#243D32] uppercase tracking-wider mb-1.5">
                Trip Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Coastal Voyage to South Goa, Tokyo Cherry Blossom Walk"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F5FAF5] border border-[#A8C9B2]/60 text-[#243D32] placeholder-[#9BAA9F] focus:outline-none focus:border-[#285943] focus:bg-white text-sm font-medium transition-all"
              />
            </div>

            {/* Dates & Visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#243D32] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#285943]" />
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5FAF5] border border-[#A8C9B2]/60 text-[#243D32] focus:outline-none focus:border-[#285943] focus:bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243D32] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#285943]" />
                  <span>End Date</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5FAF5] border border-[#A8C9B2]/60 text-[#243D32] focus:outline-none focus:border-[#285943] focus:bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#243D32] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#285943]" />
                  <span>Privacy</span>
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'private' | 'friends')}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F5FAF5] border border-[#A8C9B2]/60 text-[#243D32] focus:outline-none focus:border-[#285943] focus:bg-white text-xs font-medium cursor-pointer"
                >
                  <option value="friends">Visible to Friends</option>
                  <option value="private">Private (Only Me)</option>
                </select>
              </div>
            </div>

            {/* Trip Story / Notes */}
            <div>
              <label className="block text-xs font-bold text-[#243D32] uppercase tracking-wider mb-1.5">
                Personal Story & Travel Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What made this trip memorable? Describe the atmosphere, weather, funny anecdotes, or secret sunset spots..."
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F5FAF5] border border-[#A8C9B2]/60 text-[#243D32] placeholder-[#9BAA9F] focus:outline-none focus:border-[#285943] focus:bg-white text-xs leading-relaxed transition-all resize-none"
              />
            </div>
          </div>

          {/* 2. Places Visited Section */}
          <div className="p-4.5 rounded-3xl bg-[#EDF5EE] border border-[#A8C9B2]/40 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#DDF1E4] text-[#285943]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#243D32]">
                  Places Visited ({places.length})
                </h3>
              </div>
              <span className="text-xs text-[#718579]">Organized by Day</span>
            </div>

            {/* List of currently added places */}
            {places.length > 0 && (
              <div className="space-y-2">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="p-3 rounded-2xl bg-white border border-[#A8C9B2]/40 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded-lg bg-[#DDF1E4] text-[#285943] text-[10px] font-bold shrink-0">
                        Day {place.day || 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-[#243D32] truncate">
                            {place.name}
                          </span>
                          {place.isFavorite && (
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                          )}
                        </div>
                        {(place.city || place.notes) && (
                          <p className="text-[11px] text-[#718579] truncate">
                            {place.city} {place.notes ? `• ${place.notes}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePlaceFavorite(place.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          place.isFavorite
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-[#9BAA9F] hover:text-amber-500'
                        }`}
                        title="Mark as Favorite Spot"
                      >
                        <Star className={`w-3.5 h-3.5 ${place.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePlace(place.id)}
                        className="p-1.5 rounded-lg text-[#9BAA9F] hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove Place"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new place inline form */}
            <div className="p-3 rounded-2xl bg-white border border-dashed border-[#A8C9B2]/60 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Place or spot name *"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 rounded-xl bg-[#F5FAF5] border border-[#A8C9B2]/50 text-xs focus:outline-none focus:border-[#285943]"
                />
                <input
                  type="text"
                  placeholder="City, Country"
                  value={newPlaceCity}
                  onChange={(e) => setNewPlaceCity(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#F5FAF5] border border-[#A8C9B2]/50 text-xs focus:outline-none focus:border-[#285943]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-[#718579] font-medium shrink-0">Day:</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newPlaceDay}
                    onChange={(e) => setNewPlaceDay(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 px-2 py-1.5 rounded-xl bg-[#F5FAF5] border border-[#A8C9B2]/50 text-xs text-center focus:outline-none focus:border-[#285943]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Personal highlight or secret recommendation for this spot..."
                  value={newPlaceNotes}
                  onChange={(e) => setNewPlaceNotes(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-[#F5FAF5] border border-[#A8C9B2]/50 text-xs focus:outline-none focus:border-[#285943]"
                />

                <button
                  type="button"
                  onClick={() => setNewPlaceFavorite(!newPlaceFavorite)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    newPlaceFavorite
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-white border-[#A8C9B2]/40 text-[#718579] hover:border-amber-300'
                  }`}
                >
                  <Star className={`w-3 h-3 ${newPlaceFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>Favorite</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddPlace}
                  disabled={!newPlaceName.trim()}
                  className="px-3 py-1.5 rounded-xl bg-[#285943] hover:bg-[#1f4634] disabled:opacity-40 text-[#FFFDF4] font-semibold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Place</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Photos & Memories Section */}
          <div className="p-4.5 rounded-3xl bg-[#EDF5EE] border border-[#A8C9B2]/40 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#DDF1E4] text-[#285943]">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#243D32]">
                  Memories & Photos ({photos.length})
                </h3>
              </div>

              {/* Upload Button */}
              <label className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#A8C9B2]/60 text-[#285943] hover:bg-[#EDF5EE] text-xs font-semibold cursor-pointer shadow-2xs transition-colors">
                {isUploadingPhoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#285943]" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photos</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploadingPhoto}
                  className="hidden"
                />
              </label>
            </div>

            {/* Photos Preview Grid */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-2xl overflow-hidden border border-[#A8C9B2]/40 bg-white shadow-2xs flex flex-col"
                  >
                    <div className="relative aspect-square w-full bg-[#EDF5EE]">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Trip memory'}
                        className="w-full h-full object-cover"
                      />

                      {/* Cover Photo Indicator */}
                      {coverPhotoUrl === photo.url && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#285943] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                          Cover
                        </span>
                      )}

                      {/* Top actions */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTogglePhotoFavorite(photo.id)}
                          className={`p-1 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                            photo.isFavorite
                              ? 'bg-amber-400 text-white'
                              : 'bg-black/40 text-white hover:bg-black/60'
                          }`}
                          title="Favorite memory"
                        >
                          <Star className={`w-3 h-3 ${photo.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(photo.id)}
                          className="p-1 rounded-full bg-black/40 text-white hover:bg-red-600 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Caption Edit */}
                    <div className="p-2 space-y-1 bg-white">
                      <input
                        type="text"
                        placeholder="Caption..."
                        value={photo.caption || ''}
                        onChange={(e) => handleUpdatePhotoCaption(photo.id, e.target.value)}
                        className="w-full px-2 py-1 text-[11px] rounded-lg bg-[#F5FAF5] border border-[#A8C9B2]/50 text-[#243D32] focus:outline-none focus:border-[#285943]"
                      />
                      <div className="flex items-center justify-between text-[10px] text-[#718579]">
                        <div className="flex items-center gap-1">
                          <span>Day</span>
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={photo.day || 1}
                            onChange={(e) => handleUpdatePhotoDay(photo.id, parseInt(e.target.value) || 1)}
                            className="w-8 px-1 py-0.5 rounded bg-[#F5FAF5] border border-[#A8C9B2]/50 text-center"
                          />
                        </div>

                        {coverPhotoUrl !== photo.url && (
                          <button
                            type="button"
                            onClick={() => setCoverPhotoUrl(photo.url)}
                            className="text-[#285943] hover:underline font-semibold cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-[#A8C9B2]/60 rounded-2xl bg-white">
                <ImageIcon className="w-8 h-8 text-[#A8C9B2] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#243D32]">No memories uploaded yet</p>
                <p className="text-[11px] text-[#718579] mt-0.5">
                  Add photos of vistas, cafe receipts, sunsets, and candid smiles
                </p>
              </div>
            )}
          </div>

          {/* 4. Travel Friends Section */}
          <div className="p-4.5 rounded-3xl bg-[#EDF5EE] border border-[#A8C9B2]/40 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-[#DDF1E4] text-[#285943]">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[#243D32]">
                  Friends Who Joined ({participants.length})
                </h3>
              </div>
            </div>

            {/* Added friends chips */}
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#A8C9B2]/40 shadow-2xs"
                  >
                    <img
                      src={p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={p.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs font-medium text-[#243D32]">{p.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(p.id)}
                      className="text-[#9BAA9F] hover:text-red-500 cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Select friend dropdown */}
            {availableFriends.length > 0 ? (
              <div className="flex items-center gap-2">
                <select
                  value={selectedFriendId}
                  onChange={(e) => setSelectedFriendId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#A8C9B2]/60 text-xs font-medium text-[#243D32] focus:outline-none focus:border-[#285943]"
                >
                  <option value="">Select a friend to tag in this trip...</option>
                  {availableFriends
                    .filter((f) => !participants.some((p) => p.id === f.id))
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} (@{f.username})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddFriend}
                  disabled={!selectedFriendId}
                  className="px-3.5 py-2 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] border border-[#A8C9B2]/60 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#718579]">No connected friends yet to tag in this journey.</p>
            )}
          </div>
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#A8C9B2]/40 bg-white flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#243D32] hover:bg-[#EDF5EE] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="px-6 py-2.5 rounded-xl bg-[#285943] hover:bg-[#1f4634] text-[#FFFDF4] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Journey...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Create Trip Collection'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
