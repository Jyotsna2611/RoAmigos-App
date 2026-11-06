import React, { useState } from 'react';
import { Plus, Users, Compass, Search, Sparkles } from 'lucide-react';
import { Group } from '../types';
import { GroupCard } from '../components/common/GroupCard';
import { Modal } from '../components/common/Modal';

interface GroupsPageProps {
  groups: Group[];
  onToggleJoinGroup: (groupId: string) => void;
  onCreateGroup: (newGroup: Omit<Group, 'id' | 'memberCount' | 'activity' | 'lastActive' | 'isMember' | 'members'>) => void;
}

export const GroupsPage: React.FC<GroupsPageProps> = ({
  groups,
  onToggleJoinGroup,
  onCreateGroup
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'my' | 'discover'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroupModal, setSelectedGroupModal] = useState<Group | null>(null);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Weekend Escapes');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupDestination, setNewGroupDestination] = useState('');

  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterMode === 'my') return matchesSearch && g.isMember;
    if (filterMode === 'discover') return matchesSearch && !g.isMember;
    return matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    onCreateGroup({
      name: newGroupName.trim(),
      category: newGroupCategory,
      description: newGroupDescription.trim() || 'A curious circle of friends exploring new destinations.',
      avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=200&q=80',
      pinnedDestination: newGroupDestination.trim() || undefined
    });

    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupDestination('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action */}
      <div className="rounded-3xl bg-[#EDF5EE] border border-[#A8C9B2]/50 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#285943]" />
              <h2 className="font-display font-bold text-2xl text-[#243D32] tracking-tight">
                Expedition Circles
              </h2>
            </div>
            <p className="text-xs text-[#718579] mt-1">
              Group up with friends for weekend discoveries, roadtrips, and secret spot crawls.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] font-bold text-xs sm:text-sm border border-[#A8C9B2]/60 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Circle</span>
          </button>
        </div>

        {/* Search and Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#285943] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups by title, destination, or vibe..."
              className="w-full bg-white border border-[#A8C9B2]/50 focus:border-[#285943] rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-[#243D32] placeholder-[#9BAA9F] focus:outline-none focus:ring-1 focus:ring-[#BDE5CF]"
            />
          </div>

          <div className="flex p-1 bg-white rounded-xl border border-[#A8C9B2]/40 shrink-0">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#BDE5CF] text-[#285943] shadow-xs font-bold'
                  : 'text-[#718579] hover:text-[#243D32]'
              }`}
            >
              All Circles
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('my')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterMode === 'my'
                  ? 'bg-[#BDE5CF] text-[#285943] shadow-xs font-bold'
                  : 'text-[#718579] hover:text-[#243D32]'
              }`}
            >
              My Groups ({groups.filter((g) => g.isMember).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('discover')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterMode === 'discover'
                  ? 'bg-[#BDE5CF] text-[#285943] shadow-xs font-bold'
                  : 'text-[#718579] hover:text-[#243D32]'
              }`}
            >
              Discover
            </button>
          </div>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            onToggleJoin={onToggleJoinGroup}
            onViewGroup={(g) => setSelectedGroupModal(g)}
          />
        ))}
      </div>

      {/* Create Group Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Form an Expedition Circle"
        subtitle="Gather your friends, pin travel coordinates, and plan group memories."
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#243D32]">Circle Name</label>
            <input
              type="text"
              required
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g. Kyoto Night Wanderers, Weekend Explorers"
              className="w-full bg-white border border-[#A8C9B2]/50 focus:border-[#285943] rounded-xl py-2.5 px-3.5 text-xs text-[#243D32] placeholder-[#9BAA9F] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#243D32]">Category</label>
            <select
              value={newGroupCategory}
              onChange={(e) => setNewGroupCategory(e.target.value)}
              className="w-full bg-white border border-[#A8C9B2]/50 focus:border-[#285943] rounded-xl py-2.5 px-3 text-xs text-[#243D32] focus:outline-none"
            >
              <option value="Weekend Escapes">Weekend Escapes</option>
              <option value="Trip Planning">Trip Planning</option>
              <option value="Social Circle">Social Circle</option>
              <option value="Action & Adventure">Action & Adventure</option>
              <option value="Cafes & Ambiance">Cafes & Ambiance</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#243D32]">Description & Mission</label>
            <textarea
              rows={3}
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              placeholder="What makes this circle special? e.g. Exploring secluded viewpoints and hidden tearooms every month."
              className="w-full bg-white border border-[#A8C9B2]/50 focus:border-[#285943] rounded-xl py-2.5 px-3.5 text-xs text-[#243D32] placeholder-[#9BAA9F] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#243D32]">First Destination Target (Optional)</label>
            <input
              type="text"
              value={newGroupDestination}
              onChange={(e) => setNewGroupDestination(e.target.value)}
              placeholder="e.g. Aetheria Observatory, Goa Butterfly Beach"
              className="w-full bg-white border border-[#A8C9B2]/50 focus:border-[#285943] rounded-xl py-2.5 px-3.5 text-xs text-[#243D32] placeholder-[#9BAA9F] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDF5EE]">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718579] hover:text-[#243D32]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] font-bold text-xs border border-[#A8C9B2]/60 shadow-xs transition-all cursor-pointer"
            >
              Establish Circle
            </button>
          </div>
        </form>
      </Modal>

      {/* View Group Details Modal */}
      {selectedGroupModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedGroupModal(null)}
          title={selectedGroupModal.name}
          subtitle={`Category: ${selectedGroupModal.category}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#718579] leading-relaxed">
              {selectedGroupModal.description}
            </p>

            {selectedGroupModal.pinnedDestination && (
              <div className="p-3 rounded-xl bg-[#EDF5EE] border border-[#A8C9B2]/40 flex items-center gap-3">
                <Compass className="w-5 h-5 text-[#285943] shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-[#285943] tracking-wider">Active Pin</span>
                  <p className="text-xs font-semibold text-[#243D32] truncate">{selectedGroupModal.pinnedDestination}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-[#243D32] mb-2">Members ({selectedGroupModal.memberCount})</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedGroupModal.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#EDF5EE]/60 border border-[#A8C9B2]/30">
                    <img src={m.avatar} alt={m.name} referrerPolicy="no-referrer" className="w-7 h-7 rounded-lg object-cover" />
                    <div className="truncate">
                      <p className="text-xs font-medium text-[#243D32] truncate">{m.name}</p>
                      <p className="text-[10px] text-[#285943] font-medium">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#EDF5EE] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onToggleJoinGroup(selectedGroupModal.id);
                  setSelectedGroupModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] font-bold text-xs border border-[#A8C9B2]/60 shadow-xs cursor-pointer"
              >
                {selectedGroupModal.isMember ? 'Leave Circle' : 'Join This Circle'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
