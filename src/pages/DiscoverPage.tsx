import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Layers, 
  Crosshair, 
  Star, 
  Bookmark, 
  Eye, 
  Navigation,
  Search,
  Loader2,
  Sparkles,
  Compass,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Place } from '../types';
import { CategoryChip } from '../components/common/CategoryChip';
import { PlaceCard } from '../components/common/PlaceCard';
import { EmptyState } from '../components/common/EmptyState';
import { sampleCategories } from '../data/mockData';
import { usePlacesSearch } from '../hooks/usePlacesSearch';

// Mint Explorer pastel map style tokens
const MINT_EXPLORER_MAP_STYLE = [
  {
    featureType: 'all',
    elementType: 'geometry.fill',
    stylers: [{ color: '#F5FAF5' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#DDF1E4' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#285943' }]
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#EDF5EE' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#E3F2E7' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#A8C9B2' }, { weight: 0.5 }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#243D32' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#285943' }]
  }
];

// Map camera controller to smoothly pan when search location changes
function MapController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (map && center && (center.lat !== 0 || center.lng !== 0)) {
      map.panTo(center);
      map.setZoom(13);
    }
  }, [map, center]);
  return null;
}

interface DiscoverPageProps {
  places: Place[];
  onToggleSave: (placeId: string) => void;
  onViewPlace: (place: Place) => void;
  currentLocation: string;
  onOpenLocationModal: () => void;
  initialCategory?: string;
  onSelectLocation?: (loc: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  places: fallbackPlaces,
  onToggleSave,
  onViewPlace,
  currentLocation,
  onOpenLocationModal,
  initialCategory = 'all',
  onSelectLocation
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapPlace, setSelectedMapPlace] = useState<Place | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const {
    places,
    setPlaces,
    loading,
    error,
    mapCenter,
    setMapCenter,
    suggestions,
    executeSearch,
    fetchSuggestions,
    clearSuggestions
  } = usePlacesSearch({
    initialLocationName: currentLocation,
    initialCategory,
    initialPlaces: fallbackPlaces
  });

  // Keep selected place valid
  useEffect(() => {
    if (places.length > 0 && (!selectedMapPlace || !places.some((p) => p.id === selectedMapPlace.id))) {
      setSelectedMapPlace(places[0]);
    }
  }, [places, selectedMapPlace]);

  // Initial search on mount or when currentLocation changes
  useEffect(() => {
    const query = searchInput.trim() || currentLocation;
    executeSearch(query, selectedCategory);
  }, [currentLocation]);

  // When category changes, re-execute search
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const query = searchInput.trim() || currentLocation;
    executeSearch(query, categoryId);
  };

  // Close suggestions when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle typing in search input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    if (val.trim().length >= 2) {
      fetchSuggestions(val);
      setShowSuggestions(true);
    } else {
      clearSuggestions();
      setShowSuggestions(false);
    }
  };

  // Trigger search on Enter key or button click
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    clearSuggestions();
    const query = searchInput.trim() || currentLocation;
    executeSearch(query, selectedCategory);
  };

  // Select autocomplete suggestion
  const handleSelectSuggestion = (suggestionText: string) => {
    setSearchInput(suggestionText);
    setShowSuggestions(false);
    clearSuggestions();
    executeSearch(suggestionText, selectedCategory);
  };

  // Suggested popular destinations for quick discovery
  const popularSuggestions = [
    'Visakhapatnam, India',
    'Kyoto, Japan',
    'Reykjavik, Iceland',
    'San Francisco, CA',
    'Rome, Italy',
    'Goa, India'
  ];

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Top Search & Filter Bar - Highest Stacking Context (z-50) so suggestions hover above all cards/maps */}
      <div className="relative z-50 rounded-3xl bg-white border border-[#A8C9B2]/50 p-5 sm:p-6 backdrop-blur-xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main Large Search Bar with Live Autocomplete */}
          <div ref={searchContainerRef} className="flex-1 relative z-50">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-4 text-[#285943] pointer-events-none">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </div>

              <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                placeholder="Search worldwide places, cities, or landmarks (e.g. Visakhapatnam, Kyoto, Cafes)..."
                className="w-full pl-12 pr-24 py-3.5 bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/40 rounded-2xl text-sm text-[#243D32] placeholder:text-[#9BAA9F] transition-all outline-none font-medium shadow-2xs"
              />

              <div className="absolute right-2 flex items-center gap-1">
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      clearSuggestions();
                      setShowSuggestions(false);
                      executeSearch(currentLocation, selectedCategory);
                    }}
                    className="p-1.5 text-[#718579] hover:text-[#243D32] rounded-lg transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-[#285943] hover:bg-[#1f4634] text-[#FFFDF4] font-bold text-xs shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown - Positioned above all cards, map elements & z-index 100 */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                className="absolute left-0 right-0 top-full mt-2.5 bg-white rounded-2xl border border-[#A8C9B2]/60 shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/5"
                style={{ zIndex: 100 }}
              >
                <div className="p-2.5 text-[10px] uppercase font-bold tracking-wider text-[#718579] px-3.5 bg-[#EDF5EE]/80 border-b border-[#A8C9B2]/30 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#285943]" />
                    <span>Google Places Suggestions</span>
                  </span>
                  <span className="font-mono text-[#285943] text-[10px] bg-[#DDF1E4] px-1.5 py-0.5 rounded">Worldwide</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#EDF5EE]">
                  {suggestions.map((item) => (
                    <button
                      key={item.placeId || item.text}
                      type="button"
                      onClick={() => handleSelectSuggestion(item.text)}
                      className="w-full text-left px-4 py-3 hover:bg-[#F5FAF5] flex items-center gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#EDF5EE] group-hover:bg-[#DDF1E4] text-[#285943] flex items-center justify-center shrink-0 transition-colors">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[#243D32] truncate group-hover:text-[#285943] transition-colors">
                          {item.mainText || item.text}
                        </div>
                        {item.secondaryText && (
                          <div className="text-[11px] text-[#718579] truncate">
                            {item.secondaryText}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#A8C9B2] group-hover:text-[#285943] shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Selector Button */}
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 text-sm text-[#243D32] transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#285943]" />
              <span className="font-semibold truncate max-w-[140px]">{currentLocation}</span>
            </div>
            <span className="text-[10px] uppercase font-mono text-[#285943] font-bold">Change</span>
          </button>

          {/* View Mode Toggle: Grid vs Interactive Map */}
          <div className="flex p-1 bg-[#EDF5EE] rounded-2xl border border-[#A8C9B2]/40 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#285943] shadow-xs border border-[#A8C9B2]/40 font-bold'
                  : 'text-[#718579] hover:text-[#243D32]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grid ({places.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-[#285943] shadow-xs border border-[#A8C9B2]/40 font-bold'
                  : 'text-[#718579] hover:text-[#243D32]'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Live Map</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {sampleCategories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              count={category.count}
              active={selectedCategory === category.id}
              onClick={() => handleCategorySelect(category.id)}
              iconName={category.id}
            />
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && places.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white border border-[#A8C9B2]/40 p-4 space-y-4 animate-pulse"
            >
              <div className="h-44 bg-[#EDF5EE] rounded-2xl" />
              <div className="h-5 bg-[#EDF5EE] rounded-lg w-3/4" />
              <div className="h-4 bg-[#EDF5EE] rounded-lg w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-8 bg-[#EDF5EE] rounded-xl w-24" />
                <div className="h-8 bg-[#EDF5EE] rounded-xl w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main View: Grid vs Interactive Google Map */}
      {!loading && places.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            title="No places found"
            description={
              searchInput
                ? `No real places found matching "${searchInput}". Try exploring another city or selecting a popular destination.`
                : `No places found in ${currentLocation} for this category.`
            }
            actionLabel="Reset Search"
            onAction={() => {
              setSearchInput('');
              setSelectedCategory('all');
              executeSearch(currentLocation, 'all');
            }}
          />

          {/* Quick worldwide suggestions */}
          <div className="rounded-2xl bg-white border border-[#A8C9B2]/40 p-5 text-center max-w-xl mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#285943]">
              <Sparkles className="w-4 h-4 text-[#285943]" />
              <span>Try Discovering These Worldwide Destinations:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSuggestions.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSearchInput(city);
                    executeSearch(city, selectedCategory);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#EDF5EE] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40 text-xs text-[#243D32] font-semibold transition-all cursor-pointer shadow-2xs hover:scale-105"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onView={onViewPlace}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        /* Interactive Google Map with Mint Explorer Theme */
        <div className="relative z-10 rounded-3xl bg-white border border-[#A8C9B2]/60 overflow-hidden shadow-lg h-[640px] flex flex-col md:flex-row">
          {/* Main Visual Google Map */}
          <div className="flex-1 relative w-full h-[360px] md:h-full">
            <Map
              defaultCenter={mapCenter}
              center={mapCenter}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              styles={MINT_EXPLORER_MAP_STYLE}
              disableDefaultUI={false}
              gestureHandling="greedy"
              className="w-full h-full"
            >
              <MapController center={mapCenter} />

              {/* Real Place Markers using AdvancedMarker */}
              {places.map((place) => {
                const isSelected = selectedMapPlace?.id === place.id;
                return (
                  <AdvancedMarker
                    key={place.id}
                    position={place.coordinates}
                    onClick={() => setSelectedMapPlace(place)}
                    title={place.name}
                  >
                    <div className="relative flex flex-col items-center cursor-pointer group">
                      {/* Name tooltip */}
                      <div
                        className={`mb-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shadow-md backdrop-blur-md transition-all ${
                          isSelected
                            ? 'bg-[#285943] text-[#FFFDF4] scale-105 shadow-[#285943]/20 ring-2 ring-white'
                            : 'bg-white/95 text-[#243D32] border border-[#A8C9B2]/50 group-hover:border-[#285943]'
                        }`}
                      >
                        {place.name}
                      </div>

                      {/* Pin Marker with Mint Accent */}
                      <div
                        className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                          isSelected
                            ? 'bg-[#285943] text-[#FFFDF4] scale-110 ring-4 ring-[#BDE5CF]/60'
                            : 'bg-white border-2 border-[#285943] text-[#285943] hover:scale-110'
                        }`}
                      >
                        <Navigation className="w-4 h-4 fill-current rotate-45" />
                        {isSelected && (
                          <span className="absolute -inset-1 rounded-full border-2 border-[#285943] animate-ping opacity-75" />
                        )}
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>

            {/* Coordinates HUD overlay */}
            <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#A8C9B2]/50 font-mono text-[11px] text-[#243D32] shadow-xs pointer-events-none z-10 hidden sm:block">
              <div className="flex items-center gap-1.5 font-bold text-[#285943]">
                <Compass className="w-3.5 h-3.5 text-[#285943] animate-spin [animation-duration:10s]" />
                <span>WORLDWIDE MAP SCAN</span>
              </div>
              <div className="text-[#718579] mt-0.5">
                {places.length} live places synced · {mapCenter.lat.toFixed(4)}°, {mapCenter.lng.toFixed(4)}°
              </div>
            </div>
          </div>

          {/* Selected Place Detail Drawer / Sidebar on Map */}
          {selectedMapPlace && (
            <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-[#A8C9B2]/40 backdrop-blur-xl p-5 flex flex-col justify-between shrink-0 overflow-y-auto max-h-[280px] md:max-h-full">
              <div>
                <div className="relative h-36 rounded-xl overflow-hidden mb-3 shadow-2xs">
                  <img
                    src={selectedMapPlace.image}
                    alt={selectedMapPlace.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-2 left-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/95 text-[#285943] border border-[#A8C9B2]/50 shadow-2xs">
                    {selectedMapPlace.category}
                  </span>
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#285943] text-white shadow-2xs">
                    {selectedMapPlace.priceLevel || '$$'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-[#243D32] leading-snug">
                  {selectedMapPlace.name}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-[#718579] mt-1.5">
                  <span className="flex items-center gap-1 text-[#243D32] truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#285943] shrink-0" />
                    <span className="truncate">{selectedMapPlace.locationName}</span>
                  </span>
                  <span className="text-[#A8C9B2] shrink-0">·</span>
                  <span className="text-amber-600 font-medium flex items-center gap-0.5 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{selectedMapPlace.rating}</span>
                  </span>
                </div>

                <p className="text-xs text-[#718579] mt-2.5 leading-relaxed line-clamp-3">
                  {selectedMapPlace.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedMapPlace.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-[#EDF5EE] border border-[#A8C9B2]/40 text-[10px] font-semibold text-[#285943]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#EDF5EE]">
                <button
                  type="button"
                  onClick={() => onToggleSave(selectedMapPlace.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedMapPlace.saved
                      ? 'bg-[#285943] text-white shadow-xs'
                      : 'bg-[#EDF5EE] text-[#243D32] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${selectedMapPlace.saved ? 'fill-current' : ''}`} />
                  <span>{selectedMapPlace.saved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewPlace(selectedMapPlace)}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] border border-[#A8C9B2]/60 shadow-xs transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
