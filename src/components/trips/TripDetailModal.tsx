import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Camera, 
  Users, 
  Lock, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Star, 
  Share2, 
  Clock, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Trip, TripPhoto } from '../../types';
import { TripTimeline } from './TripTimeline';

interface TripDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  onEdit?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
  isOwner?: boolean;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
  isOpen,
  onClose,
  trip,
  onEdit,
  onDelete,
  isOwner = true
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'photos' | 'places' | 'companions'>('timeline');
  const [selectedPhoto, setSelectedPhoto] = useState<TripPhoto | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !trip) return null;

  // Format date range nicely
  const formatDateRange = (start: any, end: any) => {
    if (!start && !end) return 'Dates flexible';
    const parseSafe = (val: any): Date | null => {
      if (!val) return null;
      if (typeof val?.toDate === 'function') return val.toDate();
      if (typeof val?.seconds === 'number') return new Date(val.seconds * 1000);
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    const sDate = parseSafe(start);
    const eDate = parseSafe(end);

    if (sDate && eDate) {
      const s = sDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const e = eDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      return `${s} – ${e}`;
    }
    if (sDate) {
      return sDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return String(start || end || 'Dates flexible');
  };

  const coverImage = trip.coverPhotoUrl || (trip.photos?.[0]?.url) || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(trip);
      setIsConfirmDeleteOpen(false);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-[#243D32]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-6 bg-white rounded-3xl border border-[#A8C9B2]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cover Photo Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#EDF5EE] shrink-0">
          <img
            src={coverImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Top Bar Navigation on Cover */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between">
            {/* Privacy indicator */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-xs ${
              trip.visibility === 'private'
                ? 'bg-white/95 text-[#243D32] border border-[#A8C9B2]/50'
                : 'bg-[#285943] text-[#FFFDF4]'
            }`}>
              {trip.visibility === 'private' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#285943]" />
                  <span>Private Collection</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Shared with Friends</span>
                </>
              )}
            </span>

            {/* Actions: Edit, Delete, Close */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#243D32] border border-[#A8C9B2]/40 shadow-xs transition-colors cursor-pointer"
                title="Share Trip link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {isOwner && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(trip)}
                  className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#243D32] hover:text-[#285943] border border-[#A8C9B2]/40 shadow-xs transition-colors cursor-pointer"
                  title="Edit Trip"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              {isOwner && onDelete && (
                <button
                  type="button"
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className="p-2 rounded-xl bg-white/90 hover:bg-red-50 text-[#243D32] hover:text-red-600 border border-[#A8C9B2]/40 shadow-xs transition-colors cursor-pointer"
                  title="Delete Trip"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#243D32] border border-[#A8C9B2]/40 shadow-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title, Date & Friends on Cover */}
          <div className="absolute bottom-4 inset-x-6 space-y-2 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#DDF1E4]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#BDE5CF]" />
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              </span>
              <span>·</span>
              <span>{trip.places?.length || 0} places</span>
              <span>·</span>
              <span>{trip.photos?.length || 0} photos</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight drop-shadow-md">
              {trip.title}
            </h1>

            {/* Companions Avatars */}
            {trip.participants && trip.participants.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex -space-x-2">
                  {trip.participants.map((friend) => (
                    <img
                      key={friend.id}
                      src={friend.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={friend.name}
                      title={friend.name}
                      className="w-7 h-7 rounded-full ring-2 ring-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <span className="text-xs text-[#EDF5EE] font-medium">
                  with {trip.participants.map((p) => p.name).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {copiedLink && (
          <div className="bg-[#DDF1E4] text-[#285943] text-xs py-1.5 text-center border-b border-[#A8C9B2]/40 font-medium">
            Trip link copied to clipboard!
          </div>
        )}

        {/* Trip Description / Story Quote */}
        {trip.description && (
          <div className="px-6 py-4 bg-[#EDF5EE]/60 border-b border-[#A8C9B2]/30">
            <p className="text-xs sm:text-sm text-[#243D32] leading-relaxed italic">
              "{trip.description}"
            </p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#A8C9B2]/40 bg-white flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-[#285943] text-[#285943]'
                : 'border-transparent text-[#718579] hover:text-[#243D32]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'photos'
                ? 'border-[#285943] text-[#285943]'
                : 'border-transparent text-[#718579] hover:text-[#243D32]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Memories & Photos ({trip.photos?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('places')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'places'
                ? 'border-[#285943] text-[#285943]'
                : 'border-transparent text-[#718579] hover:text-[#243D32]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Places Visited ({trip.places?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('companions')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'companions'
                ? 'border-[#285943] text-[#285943]'
                : 'border-transparent text-[#718579] hover:text-[#243D32]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Companions ({trip.participants?.length || 0})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-white to-[#F5FAF5]">
          {/* TAB 1: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="max-w-2xl mx-auto py-2">
              <TripTimeline
                trip={trip}
                onPhotoClick={(photo) => setSelectedPhoto(photo)}
              />
            </div>
          )}

          {/* TAB 2: PHOTOS */}
          {activeTab === 'photos' && (
            <div>
              {trip.photos && trip.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {trip.photos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-[#EDF5EE] shadow-2xs hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Trip memory'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end">
                        {photo.caption && (
                          <p className="text-xs font-medium text-white line-clamp-2">
                            {photo.caption}
                          </p>
                        )}
                        <span className="text-[10px] text-[#BDE5CF] mt-1">
                          Day {photo.day || 1}
                        </span>
                      </div>

                      {photo.isFavorite && (
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-white/80 backdrop-blur-xs">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-[#718579]">
                  <Camera className="w-8 h-8 text-[#A8C9B2] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#243D32]">No photos uploaded for this journey yet</p>
                  {isOwner && onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(trip)}
                      className="mt-3 px-4 py-2 rounded-xl bg-white border border-[#A8C9B2]/60 text-[#285943] hover:bg-[#EDF5EE] text-xs font-semibold shadow-2xs cursor-pointer"
                    >
                      Add Photos
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLACES VISITED */}
          {activeTab === 'places' && (
            <div className="space-y-3">
              {trip.places && trip.places.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {trip.places.map((place) => (
                    <div
                      key={place.id}
                      className="p-4 rounded-2xl bg-white border border-[#A8C9B2]/40 shadow-2xs flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-xl bg-[#EDF5EE] text-[#285943] shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-lg bg-[#DDF1E4] text-[#285943] text-[10px] font-bold">
                                Day {place.day || 1}
                              </span>
                              <h4 className="font-semibold text-sm text-[#243D32]">
                                {place.name}
                              </h4>
                            </div>
                            {(place.city || place.country) && (
                              <p className="text-xs text-[#718579] mt-1">
                                {[place.city, place.country].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>

                        {place.isFavorite && (
                          <span className="p-1.5 rounded-full bg-amber-50 text-amber-500 shadow-2xs" title="Favorite Spot">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          </span>
                        )}
                      </div>

                      {place.notes && (
                        <p className="text-xs text-[#718579] mt-3 pt-2.5 border-t border-[#A8C9B2]/20 italic leading-relaxed">
                          "{place.notes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-[#718579]">
                  <MapPin className="w-8 h-8 text-[#A8C9B2] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#243D32]">No places recorded for this trip yet</p>
                  {isOwner && onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(trip)}
                      className="mt-3 px-4 py-2 rounded-xl bg-white border border-[#A8C9B2]/60 text-[#285943] hover:bg-[#EDF5EE] text-xs font-semibold shadow-2xs cursor-pointer"
                    >
                      Add Visited Spots
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPANIONS */}
          {activeTab === 'companions' && (
            <div>
              {trip.participants && trip.participants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {trip.participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#A8C9B2]/40 shadow-2xs flex items-center gap-3"
                    >
                      <img
                        src={p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#A8C9B2]/30"
                      />
                      <div>
                        <h4 className="font-semibold text-xs text-[#243D32]">
                          {p.name}
                        </h4>
                        {p.username && (
                          <p className="text-[11px] text-[#718579]">
                            @{p.username}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-[#718579]">
                  <Users className="w-8 h-8 text-[#A8C9B2] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#243D32]">Solo Journey</p>
                  <p className="text-[11px] text-[#718579] mt-0.5">
                    No travel companions were tagged in this memory.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Photo Lightbox Preview */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#BDE5CF] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || 'Memory'}
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            {selectedPhoto.caption && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-medium max-w-lg text-center">
                {selectedPhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-60 bg-[#243D32]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#A8C9B2]/50 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#243D32]">
                Delete Trip Collection?
              </h3>
              <p className="text-xs text-[#718579] mt-1">
                Are you sure you want to permanently delete "{trip.title}" and its saved photos? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-[#A8C9B2]/50 text-xs font-semibold text-[#243D32] hover:bg-[#EDF5EE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
