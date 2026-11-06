import React, { useState, useEffect } from 'react';
import { Star, Bookmark, MapPin, Eye, Compass } from 'lucide-react';
import { Place } from '../../types';

interface PlaceCardProps {
  place: Place;
  onView: (place: Place) => void;
  onToggleSave: (placeId: string) => void;
  compact?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onView,
  onToggleSave,
  compact = false
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [place.id, place.image]);

  const getCategoryBadgeClass = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('hik') || cat.includes('trail') || cat.includes('outdoor')) {
      return 'bg-[#EDF5EE] text-[#285943] border-[#A8C9B2]/60';
    }
    if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('food') || cat.includes('lounge') || cat.includes('dining')) {
      return 'bg-[#FFFDF4] text-[#285943] border-[#A8C9B2]/50';
    }
    if (cat.includes('nature') || cat.includes('park') || cat.includes('beach') || cat.includes('cove')) {
      return 'bg-[#DDF1E4] text-[#285943] border-[#A8C9B2]/60';
    }
    if (cat.includes('cultur') || cat.includes('art') || cat.includes('museum') || cat.includes('history')) {
      return 'bg-[#E9E2F7] text-[#285943] border-[#A8C9B2]/50';
    }
    return 'bg-[#EDF5EE] text-[#285943] border-[#A8C9B2]/50';
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-[#A8C9B2]/40 hover:border-[#A8C9B2] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md hover:shadow-[#285943]/08 hover:-translate-y-0.5">
      {/* Media Container with Measured Scrim */}
      <div className={`relative w-full ${compact ? 'h-40' : 'h-52'} overflow-hidden bg-[#EDF5EE]`}>
        {!imageError && place.image ? (
          <img
            src={place.image}
            alt={place.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FFFDF4] via-[#EDF5EE] to-[#E9E2F7] p-4 text-center">
            <Compass className="w-8 h-8 text-[#285943] mb-2 opacity-60" />
            <span className="text-xs text-[#718579] font-medium">{place.name}</span>
          </div>
        )}

        {/* Top Badges / Action Row */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Category kicker */}
          <span className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-lg backdrop-blur-md border pointer-events-auto shadow-xs ${getCategoryBadgeClass(place.category)}`}>
            {place.category}
          </span>

          {/* Quick Save Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(place.id);
            }}
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-xs ${
              place.saved
                ? 'bg-[#285943] text-white shadow-xs'
                : 'bg-white/90 text-[#718579] hover:text-[#285943] hover:bg-white border border-[#A8C9B2]/40'
            }`}
            aria-label={place.saved ? 'Remove from saved' : 'Save place'}
          >
            <Bookmark className={`w-4 h-4 ${place.saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Friends who saved overlay */}
        {place.savedByFriends && place.savedByFriends.length > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-[#A8C9B2]/30 text-[11px] text-[#243D32] shadow-xs">
            <div className="flex -space-x-1.5 overflow-hidden">
              {place.savedByFriends.slice(0, 3).map((f) => (
                <img
                  key={f.id}
                  src={f.avatar}
                  alt={f.name}
                  referrerPolicy="no-referrer"
                  className="inline-block w-4 h-4 rounded-full ring-1 ring-white object-cover"
                />
              ))}
            </div>
            <span className="font-medium text-[#243D32]">{place.savedByFriends.length} friends saved</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-display font-bold text-base text-[#243D32] group-hover:text-[#285943] transition-colors line-clamp-1">
            {place.name}
          </h3>

          {/* Clean Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-[#718579]">
            <span className="flex items-center gap-1 text-[#243D32]">
              <MapPin className="w-3 h-3 text-[#285943] shrink-0" />
              <span className="truncate max-w-[120px]">{place.locationName}</span>
            </span>
            <span aria-hidden="true" className="text-[#A8C9B2]">·</span>
            <span className="text-[#718579] shrink-0">{place.distance}</span>
            <span aria-hidden="true" className="text-[#A8C9B2]">·</span>
            <span className="flex items-center gap-1 text-amber-600 font-medium shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{place.rating.toFixed(2)}</span>
            </span>
          </div>

          {!compact && (
            <p className="text-xs text-[#718579] mt-2.5 line-clamp-2 leading-relaxed">
              {place.description}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-[#EDF5EE] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-[#718579]">
            {place.curiosityScore && (
              <span className="font-medium text-[#285943] bg-[#DDF1E4] px-1.5 py-0.5 rounded">
                ✨ {place.curiosityScore}% Match
              </span>
            )}
            {place.priceLevel && (
              <>
                <span className="text-[#A8C9B2]">·</span>
                <span className="font-medium text-[#243D32]">{place.priceLevel}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onView(place)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] border border-[#A8C9B2]/60 transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
