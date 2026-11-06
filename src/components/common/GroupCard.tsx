import React from 'react';
import { Users, Activity, Compass, ArrowRight, Check } from 'lucide-react';
import { Group } from '../../types';

interface GroupCardProps {
  group: Group;
  onToggleJoin: (groupId: string) => void;
  onViewGroup: (group: Group) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onToggleJoin,
  onViewGroup
}) => {
  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-[#A8C9B2]/40 hover:border-[#A8C9B2] shadow-xs hover:shadow-sm transition-all duration-200 group">
      <div>
        {/* Header: Icon / Avatar + Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={group.avatar}
              alt={group.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#A8C9B2]/30"
            />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#285943] bg-[#EDF5EE] px-2 py-0.5 rounded">
                {group.category}
              </span>
              <h3 className="font-display font-bold text-base text-[#243D32] group-hover:text-[#285943] transition-colors mt-1">
                {group.name}
              </h3>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#718579] line-clamp-2 leading-relaxed mb-4">
          {group.description}
        </p>

        {group.pinnedDestination && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EDF5EE]/70 border border-[#A8C9B2]/30 mb-4">
            <Compass className="w-4 h-4 text-[#285943] shrink-0" />
            <div className="text-xs truncate">
              <span className="text-[#718579]">Pinned Target: </span>
              <span className="text-[#243D32] font-medium">{group.pinnedDestination}</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[#EDF5EE] space-y-3">
        {/* Members & Activity */}
        <div className="flex items-center justify-between text-xs text-[#718579]">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              {group.members.slice(0, 3).map((m) => (
                <img
                  key={m.id}
                  src={m.avatar}
                  alt={m.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
            <span className="font-mono text-[#243D32]">{group.memberCount} members</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#285943] text-[11px] font-medium">
            <Activity className="w-3 h-3" />
            <span className="truncate max-w-[130px]">{group.activity}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onToggleJoin(group.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              group.isMember
                ? 'bg-[#EDF5EE] text-[#285943] border border-[#A8C9B2]/60 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                : 'bg-[#BDE5CF] text-[#285943] hover:bg-[#A8C9B2] font-semibold border border-[#A8C9B2]/60 shadow-xs'
            }`}
          >
            {group.isMember ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Joined</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5" />
                <span>Join Group</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onViewGroup(group)}
            className="p-2 rounded-xl text-[#285943] hover:text-[#243D32] bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 transition-all cursor-pointer"
            title="View group details"
          >
            <ArrowRight className="w-4 h-4 text-[#285943]" />
          </button>
        </div>
      </div>
    </div>
  );
};
