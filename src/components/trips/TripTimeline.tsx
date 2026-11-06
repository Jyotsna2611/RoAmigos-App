import React from 'react';
import { MapPin, Camera, Star, Calendar, Sparkles } from 'lucide-react';
import { Trip, TripPlace, TripPhoto } from '../../types';

interface TripTimelineProps {
  trip: Trip;
  onPhotoClick?: (photo: TripPhoto) => void;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({ trip, onPhotoClick }) => {
  const places = trip.places || [];
  const photos = trip.photos || [];

  // Group places and photos by Day (default to Day 1 if day is not explicitly assigned)
  const validPlaceDays = places.map((p) => Number(p.day) || 1);
  const validPhotoDays = photos.map((p) => Number(p.day) || 1);
  const calculatedMax = Math.max(1, ...validPlaceDays, ...validPhotoDays);
  const safeMaxDay = Math.min(60, isNaN(calculatedMax) ? 1 : calculatedMax);

  const daysArray = Array.from({ length: safeMaxDay }, (_, i) => i + 1);

  const getDayTheme = (dayIndex: number) => {
    const themes = [
      { emoji: '🌅', name: 'Dawn of the Journey', color: 'from-[#A8C9B2] to-[#285943]' },
      { emoji: '🌊', name: 'Coastal Wander & Hidden Gems', color: 'from-[#BDE5CF] to-[#285943]' },
      { emoji: '🌄', name: 'Mountain Trails & Highlands', color: 'from-[#285943] to-[#A8C9B2]' },
      { emoji: '✨', name: 'Twilight Discoveries', color: 'from-[#E9E2F7] to-[#285943]' },
      { emoji: '🌿', name: 'Serene Nature Escapes', color: 'from-[#DDF1E4] to-[#285943]' },
      { emoji: '🏮', name: 'Evening Celebrations', color: 'from-[#FFFDF4] to-[#BDE5CF]' }
    ];
    const safeIdx = Math.max(0, Math.floor(dayIndex) - 1);
    return themes[safeIdx % themes.length];
  };

  return (
    <div className="relative space-y-8 pl-4 sm:pl-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#285943] before:via-[#A8C9B2] before:to-[#BDE5CF]">
      {daysArray.map((dayNum) => {
        const dayPlaces = places.filter((p) => (p.day || 1) === dayNum);
        const dayPhotos = photos.filter((p) => (p.day || 1) === dayNum);
        const theme = getDayTheme(dayNum);

        // If no places or photos on this day and it's beyond day 1, skip
        if (dayPlaces.length === 0 && dayPhotos.length === 0 && dayNum > 1) {
          return null;
        }

        return (
          <div key={dayNum} className="relative space-y-4 group">
            {/* Timeline Day Marker Node */}
            <div className="absolute -left-6 sm:-left-7 top-0 w-6 h-6 rounded-full bg-white border-2 border-[#285943] flex items-center justify-center text-xs shadow-xs group-hover:scale-110 transition-transform">
              <span className="text-[10px] font-bold text-[#285943]">{dayNum}</span>
            </div>

            {/* Day Header */}
            <div className="flex items-center gap-3">
              <span className="text-xl">{theme.emoji}</span>
              <div>
                <h4 className="font-display font-bold text-base text-[#243D32]">
                  Day {dayNum}
                </h4>
                <p className="text-xs text-[#718579] font-medium">
                  {dayPlaces.length} {dayPlaces.length === 1 ? 'place' : 'places'} visited · {dayPhotos.length} {dayPhotos.length === 1 ? 'memory' : 'memories'} captured
                </p>
              </div>
            </div>

            {/* Day Places Visited Cards */}
            {dayPlaces.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {dayPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#A8C9B2]/40 shadow-2xs hover:border-[#A8C9B2] transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 rounded-xl bg-[#EDF5EE] text-[#285943] shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm text-[#243D32] leading-snug">
                            {place.name}
                          </h5>
                          {(place.city || place.country) && (
                            <p className="text-xs text-[#718579] mt-0.5">
                              {[place.city, place.country].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      {place.isFavorite && (
                        <span className="p-1 rounded-full bg-amber-50 text-amber-500 shadow-2xs shrink-0" title="Favorite Spot">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </span>
                      )}
                    </div>

                    {place.notes && (
                      <p className="text-xs text-[#718579] mt-2.5 pt-2 border-t border-[#A8C9B2]/20 italic leading-relaxed">
                        "{place.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Day Photos Grid */}
            {dayPhotos.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-xs text-[#718579] font-medium mb-2">
                  <Camera className="w-3.5 h-3.5 text-[#285943]" />
                  <span>Captured Memories</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {dayPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => onPhotoClick?.(photo)}
                      className="group/img relative aspect-square rounded-2xl overflow-hidden bg-[#EDF5EE] cursor-pointer shadow-2xs hover:shadow-md transition-all hover:scale-[1.02]"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Trip memory'}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-1.5">
                        {photo.caption && (
                          <span className="text-[10px] text-white line-clamp-1 font-medium drop-shadow-sm">
                            {photo.caption}
                          </span>
                        )}
                      </div>
                      {photo.isFavorite && (
                        <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 backdrop-blur-xs">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
