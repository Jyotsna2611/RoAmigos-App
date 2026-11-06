import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Flame, 
  Users, 
  MapPin, 
  Heart,
  Plane,
  Navigation
} from 'lucide-react';
import { Place, User } from '../types';
import { PlaceCard } from '../components/common/PlaceCard';
import { sampleCategories } from '../data/mockData';

// Scenic travel hero background
const heroBgImage = '/src/assets/images/mint_travel_hero_1793859787385.jpg';

interface HomePageProps {
  user: User;
  places: Place[];
  onToggleSave: (placeId: string) => void;
  onViewPlace: (place: Place) => void;
  onExploreCategory: (categoryName: string) => void;
  onNavigateToDiscover: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  places,
  onToggleSave,
  onViewPlace,
  onExploreCategory,
  onNavigateToDiscover
}) => {
  // Places Near You (e.g. within 5km)
  const nearYouPlaces = places.slice(0, 3);
  
  // Trending With Friends (places that have friends saved/interested)
  const trendingWithFriends = places.filter((p) => p.savedByFriends && p.savedByFriends.length > 0).slice(0, 3);

  // Time-of-day greeting for personalization
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user.name ? user.name.split(' ')[0] : 'Explorer';

  return (
    <div className="space-y-10 pb-12 select-none">
      {/* 1. MINT EXPLORER TRAVEL HERO BANNER */}
      <section className="relative rounded-3xl overflow-hidden border border-[#A8C9B2]/60 shadow-xl shadow-[#285943]/5 min-h-[360px] sm:min-h-[420px] lg:min-h-[450px] flex items-center">
        {/* Full-bleed Scenic Background Image */}
        <img
          src={heroBgImage}
          alt="Scenic Mountain Landscape"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Sophisticated Magazine Gradient Scrim: Cream/White on left to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDF4]/98 via-[#FFFDF4]/90 to-[#285943]/25 sm:from-[#FFFDF4]/98 sm:via-[#FFFDF4]/85 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EDF5EE]/50 via-transparent to-transparent" />

        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#BDE5CF]/30 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#DDF1E4]/40 rounded-full blur-[80px] pointer-events-none" />

        {/* Airplane Soaring Across the Sky with flight path */}
        <div className="absolute top-6 right-6 sm:right-16 lg:right-24 pointer-events-none">
          <svg className="w-32 sm:w-44 lg:w-56 h-20 sm:h-28" viewBox="0 0 160 80" fill="none">
            {/* Dashed flight trail */}
            <path 
              d="M 10 70 C 45 62, 85 45, 126 22" 
              stroke="#285943" 
              strokeWidth="1.2" 
              strokeDasharray="3 4" 
              opacity="0.4" 
            />
            {/* Little puffy cloud */}
            <path 
              d="M 50 62 Q 54 55, 60 58 Q 66 52, 74 58 Q 80 58, 82 64 Z" 
              fill="#FFFDF4" 
              opacity="0.6" 
            />
            {/* Travel Airplane */}
            <g transform="translate(118, 14) rotate(-20) scale(0.95)">
              {/* Fuselage */}
              <path d="M 0 11 L 24 11 Q 31 11 35 9 Q 31 7 24 7 L 0 7 Z" fill="#285943" />
              {/* Top Wing */}
              <polygon points="13,9 5,0 18,0 20,9" fill="#3B7D5D" />
              {/* Lower Wing */}
              <polygon points="13,9 5,18 18,18 20,9" fill="#243D32" />
              {/* Tail Fin */}
              <polygon points="3,7 -1,1 5,1 6,7" fill="#3B7D5D" />
              {/* Windows */}
              <circle cx="17" cy="9" r="0.8" fill="#FFFDF4" />
              <circle cx="21" cy="9" r="0.8" fill="#FFFDF4" />
              <circle cx="25" cy="9" r="0.8" fill="#FFFDF4" />
              {/* Cockpit */}
              <path d="M 29 8 Q 33 8.5 31 9.5 Q 29 9 29 8 Z" fill="#BDE5CF" />
            </g>
          </svg>
        </div>

        {/* Content Area */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl space-y-4">
          {/* Greeting Badge & Location Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#A8C9B2]/60 text-[#285943] text-xs font-semibold shadow-2xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#285943]" />
              <span>{getGreeting()}, {firstName}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EDF5EE]/90 border border-[#A8C9B2]/40 text-[#718579] text-xs font-medium backdrop-blur-xs">
              <MapPin className="w-3 h-3 text-[#285943]" />
              <span>Explorer Coordinates Active</span>
            </span>
          </div>

          {/* MAIN HEADING: "Travel. Connect. Remember." */}
          <div className="space-y-1 pt-1">
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#243D32] tracking-tight leading-[1.08] drop-shadow-xs">
              Travel. Connect. Remember.
            </h1>

            {/* SUBTITLE: "With RoAmigos ♡" */}
            <div className="flex items-center gap-2 pt-0.5">
              <span 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#285943] tracking-wide"
                style={{ fontFamily: "'Caveat', cursive, serif" }}
              >
                With RoAmigos ♡
              </span>
              <span className="hidden sm:inline-block w-8 h-[2px] bg-[#A8C9B2]/50 rounded-full" />
              <span className="hidden sm:inline-block text-[11px] font-semibold text-[#718579] tracking-wider uppercase font-mono">
                Worldwide Discovery
              </span>
            </div>
          </div>

          {/* Body Description */}
          <p className="text-sm sm:text-base text-[#718579] font-normal leading-relaxed max-w-xl">
            Uncover secret spots, share unforgettable journeys with trusted companions, and preserve your travel memories in one peaceful space.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onNavigateToDiscover}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] font-bold text-sm shadow-sm hover:shadow border border-[#A8C9B2]/60 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <Compass className="w-4 h-4 text-[#285943] group-hover:rotate-45 transition-transform duration-300" />
              <span>Explore Places</span>
            </button>

            <button
              type="button"
              onClick={() => onExploreCategory('Hidden Gems')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/95 hover:bg-[#EDF5EE] text-[#243D32] text-xs font-semibold border border-[#A8C9B2]/60 shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
            >
              <span>Scan Hidden Gems</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#285943] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. NEAR YOU SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#DDF1E4] text-[#285943]">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#243D32] tracking-tight">
                Near You
              </h2>
            </div>
            <p className="text-xs text-[#718579] mt-0.5">
              Secret vistas, quiet cafes, and atmospheric escapes within 5 km of your coordinates.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToDiscover}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EDF5EE] border border-[#A8C9B2]/40 text-xs font-semibold text-[#285943] hover:text-[#243D32] transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearYouPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onView={onViewPlace}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      </section>

      {/* 3. TRENDING WITH FRIENDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#DDF1E4] text-[#285943]">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#243D32] tracking-tight">
                Trending With Friends
              </h2>
            </div>
            <p className="text-xs text-[#718579] mt-0.5">
              Places your circle is bookmarking, reviewing, and planning weekend getaways for.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToDiscover}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EDF5EE] border border-[#A8C9B2]/40 text-xs font-semibold text-[#285943] hover:text-[#243D32] transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <span>Explore network saves</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingWithFriends.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onView={onViewPlace}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      </section>

      {/* 4. EXPLORE SOMETHING NEW (CATEGORIES) */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-[#DDF1E4] text-[#285943]">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#243D32] tracking-tight">
              Explore Something New
            </h2>
          </div>
          <p className="text-xs text-[#718579] mt-0.5">
            Curated adventure collections to spark your next group journey.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sampleCategories
            .filter((c) => c.id !== 'all')
            .map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onExploreCategory(cat.id)}
                className="flex flex-col items-start p-4 rounded-2xl bg-white hover:bg-[#EDF5EE]/50 border border-[#A8C9B2]/40 hover:border-[#A8C9B2] transition-all group text-left cursor-pointer shadow-xs hover:shadow-sm hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EDF5EE] border border-[#A8C9B2]/50 text-[#285943] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-sm text-[#243D32] group-hover:text-[#285943] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#718579] font-medium mt-1">
                  {cat.count} curated
                </span>
              </button>
            ))}
        </div>
      </section>

      {/* 5. TRAVEL ATMOSPHERE MOTIF: TRAVEL JOURNAL QUOTE STRIP */}
      <section className="rounded-2xl bg-gradient-to-r from-[#FFFDF4] via-[#EDF5EE] to-[#E9E2F7] border border-[#A8C9B2]/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#BDE5CF] text-[#285943] flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div>
            <p 
              className="text-base sm:text-lg text-[#285943] font-bold"
              style={{ fontFamily: "'Caveat', cursive, serif" }}
            >
              "Every horizon begins with a single shared curiosity."
            </p>
            <p className="text-[11px] text-[#718579] font-medium">
              Keep exploring, connecting, and documenting every trail with RoAmigos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToDiscover}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#DDF1E4] text-[#285943] border border-[#A8C9B2]/50 text-xs font-semibold transition-all cursor-pointer shadow-2xs whitespace-nowrap"
        >
          Find a New Spot Today
        </button>
      </section>
    </div>
  );
};
