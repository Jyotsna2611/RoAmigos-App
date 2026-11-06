import React from 'react';
import { Calendar, MapPin, Camera, Users, Lock, UserCheck, Eye, Trash2, Edit2 } from 'lucide-react';
import { Trip } from '../../types';

interface TripCardProps {
  trip: Trip;
  onOpen: (trip: Trip) => void;
  onEdit?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
  isOwner?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onOpen,
  onEdit,
  onDelete,
  isOwner = true
}) => {
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

  const coverImage = trip.coverPhotoUrl || (trip.photos?.[0]?.url) || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      onClick={() => onOpen(trip)}
      className="group relative flex flex-col rounded-3xl bg-white border border-[#A8C9B2]/40 hover:border-[#A8C9B2] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg hover:shadow-[#285943]/10 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Cover Photo */}
      <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-[#EDF5EE]">
        <img
          src={coverImage}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Soft natural scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Privacy Badge */}
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
            trip.visibility === 'private'
              ? 'bg-white/90 text-[#243D32] border border-[#A8C9B2]/50'
              : 'bg-[#285943] text-[#FFFDF4] border border-[#285943]'
          }`}>
            {trip.visibility === 'private' ? (
              <>
                <Lock className="w-3 h-3 text-[#285943]" />
                <span>Private</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3 h-3" />
                <span>Friends</span>
              </>
            )}
          </span>

          {/* Quick Action Buttons for Owner */}
          {isOwner && (
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(trip);
                  }}
                  className="p-1.5 rounded-xl bg-white/90 hover:bg-white text-[#243D32] hover:text-[#285943] border border-[#A8C9B2]/40 shadow-xs transition-colors cursor-pointer"
                  title="Edit Trip"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(trip);
                  }}
                  className="p-1.5 rounded-xl bg-white/90 hover:bg-red-50 text-[#243D32] hover:text-red-600 border border-[#A8C9B2]/40 shadow-xs transition-colors cursor-pointer"
                  title="Delete Trip"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom friends preview on cover */}
        {trip.participants && trip.participants.length > 0 && (
          <div className="absolute bottom-3 right-3 flex -space-x-2 overflow-hidden pointer-events-none">
            {trip.participants.slice(0, 4).map((friend) => (
              <img
                key={friend.id}
                src={friend.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={friend.name}
                className="inline-block w-6 h-6 rounded-full ring-2 ring-white object-cover shadow-xs"
              />
            ))}
          </div>
        )}

        {/* Date on Cover */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/95 font-medium drop-shadow-md">
          <Calendar className="w-3.5 h-3.5 text-[#BDE5CF]" />
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-display font-bold text-lg text-[#243D32] group-hover:text-[#285943] transition-colors line-clamp-1">
            {trip.title}
          </h3>

          {trip.description && (
            <p className="text-xs text-[#718579] mt-1.5 line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="pt-3 border-t border-[#A8C9B2]/30 flex items-center justify-between text-xs text-[#718579]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#243D32] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#285943]" />
              <span>{trip.placeCount || trip.places?.length || 0} places</span>
            </span>
            <span className="text-[#A8C9B2]">·</span>
            <span className="flex items-center gap-1 text-[#243D32] font-medium">
              <Camera className="w-3.5 h-3.5 text-[#718579]" />
              <span>{trip.photoCount || trip.photos?.length || 0} memories</span>
            </span>
            {trip.participants && trip.participants.length > 0 && (
              <>
                <span className="text-[#A8C9B2]">·</span>
                <span className="flex items-center gap-1 text-[#243D32] font-medium">
                  <Users className="w-3.5 h-3.5 text-[#718579]" />
                  <span>{trip.participants.length}</span>
                </span>
              </>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#285943] group-hover:translate-x-0.5 transition-transform">
            <span>View</span>
            <Eye className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
