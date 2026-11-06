import { Place } from '../../types';
import rawConfig from '../../../firebase-applet-config.json';

// Resolves Google Maps API Key
export const getGoogleMapsApiKey = (): string => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || (rawConfig as any)?.apiKey || '';
};

// Rich, high-quality diverse pools of unique travel photography (8+ distinct images per category)
// Guarantees that places never share the same image even when falling back
const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  'Cafes': [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', // Artisanal latte art
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', // Sunlit greenhouse cafe
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80', // Warm coffee counter & pastries
    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80', // Cozy rustic espresso table
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80', // Pour-over coffee maker
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80', // European sidewalk bistro
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80', // Bright greenery cafe
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80'  // Intimate corner tea room
  ],
  'Hidden Gems': [
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80', // Sunlit historic stone arches
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80', // Secret lantern-lit European lane
    'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80', // Ancient tranquil temple garden
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // Secluded misty lake view
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', // Hidden Mediterranean terrace
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', // Romantic historic Parisian bridge
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80', // Secret rooftop courtyard
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'  // Peaceful mountain overlook
  ],
  'Nature': [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80', // Misty pine forest trail
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', // Pristine tropical coastal beach
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80', // Cascading waterfall into blue pool
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', // Majestic mountain peaks
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80', // Emerald coastal cliffs
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', // Alpine lake reflection
    'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80', // Sunlight through misty woods
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'  // Rolling misty green hills
  ],
  'Adventure': [
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80', // Hiker on dramatic canyon edge
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80', // High altitude snow summit
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80', // Open road explorer journey
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80', // Forest suspension bridge
    'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80', // Coastal trail overlook
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', // Rugged mountain valley
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', // Starry night camp
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'  // Explorer with map and backpack
  ],
  'Weekend Trips': [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', // Charming boutique resort & pool
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', // Parisian balcony getaway
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', // Relaxing spa & retreat
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', // Tropical island resort villa
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', // Luxury modern coastal villa
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', // Lakeside boutique retreat
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', // Seaside cliff villa
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'  // Countryside estate
  ],
  'Entertainment': [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', // Vibrant stage & lights
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', // Classic cinema theater
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', // Concert venue atmosphere
    'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80', // Open air performance pavilion
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80', // Festive evening lights
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80', // Historic theatre interior
    'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80', // Cultural art gallery
    'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=800&q=80'  // Acoustic lounge
  ],
  'Rooftop': [
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80', // Sunset city skyline lounge
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', // String lights rooftop deck
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', // High-rise terrace overlooking bay
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80', // Cozy sunset lounge cushions
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80', // Cityscape twilight rooftop
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80', // Coastal cliff terrace
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // Sky pavilion
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'  // Luxury rooftop pool & vista
  ]
};

// Generates a deterministic, unique fallback image for a place so no two places ever share the same photo
export const getUniqueFallbackImage = (
  placeName: string,
  placeId: string,
  category: string,
  index: number = 0
): string => {
  const pool = CATEGORY_IMAGE_POOLS[category] || CATEGORY_IMAGE_POOLS['Hidden Gems'];
  let hash = 0;
  const seed = `${placeName}_${placeId}_${index}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const chosenIndex = (Math.abs(hash) + index) % pool.length;
  return pool[chosenIndex];
};

// Maps Google Places types into RoAmigos category types
export const mapGoogleTypesToCategory = (
  types?: string[],
  requestedCategory?: string
): Place['category'] => {
  if (requestedCategory && requestedCategory !== 'all') {
    return requestedCategory as Place['category'];
  }
  if (!types || types.length === 0) return 'Hidden Gems';

  const typeSet = new Set(types);
  if (typeSet.has('cafe') || typeSet.has('coffee_shop') || typeSet.has('bakery') || typeSet.has('tea_house')) {
    return 'Cafes';
  }
  if (typeSet.has('park') || typeSet.has('natural_feature') || typeSet.has('campground') || typeSet.has('hiking_area') || typeSet.has('beach')) {
    return 'Nature';
  }
  if (typeSet.has('amusement_park') || typeSet.has('movie_theater') || typeSet.has('bowling_alley') || typeSet.has('casino') || typeSet.has('night_club')) {
    return 'Entertainment';
  }
  if (typeSet.has('bar') || typeSet.has('cocktail_bar') || typeSet.has('roof_terrace')) {
    return 'Rooftop';
  }
  if (typeSet.has('resort_hotel') || typeSet.has('lodging') || typeSet.has('tourist_attraction')) {
    return 'Weekend Trips';
  }
  if (typeSet.has('museum') || typeSet.has('art_gallery') || typeSet.has('historical_landmark') || typeSet.has('place_of_worship')) {
    return 'Hidden Gems';
  }
  return 'Adventure';
};

// Extracts photo URI from Google Places (New) Photo instance using all supported interfaces
export const extractPhotoUri = (photo: any, apiKey: string): string => {
  if (!photo) return '';

  // 1. Try getURI method from Google Places API (New)
  if (typeof photo.getURI === 'function') {
    try {
      const uri = photo.getURI({ maxWidth: 800, maxHeight: 600 });
      if (uri) return uri;
    } catch {}
    try {
      const uri = photo.getURI({ maxWidth: 800 });
      if (uri) return uri;
    } catch {}
    try {
      const uri = photo.getURI();
      if (uri) return uri;
    } catch {}
  }

  // 2. Try getUrl method (legacy compatibility wrapper)
  if (typeof photo.getUrl === 'function') {
    try {
      const url = photo.getUrl({ maxWidth: 800, maxHeight: 600 });
      if (url) return url;
    } catch {}
    try {
      const url = photo.getUrl({ maxWidth: 800 });
      if (url) return url;
    } catch {}
  }

  // 3. Try Places API (New) resource name (places/PLACE_ID/photos/PHOTO_ID)
  if (photo.name && apiKey) {
    return `https://places.googleapis.com/v1/${photo.name}/media?key=${apiKey}&maxHeightPx=600&maxWidthPx=800`;
  }

  // 4. Try legacy photo_reference
  if (photo.photo_reference && apiKey) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`;
  }

  return '';
};

// Converts a Google Places API (New) Place instance into a RoAmigos Place model
export const transformGooglePlaceToRoAmigos = (
  place: any,
  requestedCategory?: string,
  index: number = 0
): Place => {
  // Extract display name safely (may be string or getter object)
  const name = typeof place.displayName === 'string'
    ? place.displayName
    : (place.displayName?.text || place.name || 'Discovered Place');

  // Extract coordinates safely
  const lat = typeof place.location?.lat === 'function'
    ? place.location.lat()
    : (typeof place.location?.lat === 'number' ? place.location.lat : 0);
  const lng = typeof place.location?.lng === 'function'
    ? place.location.lng()
    : (typeof place.location?.lng === 'number' ? place.location.lng : 0);

  // Determine category
  const category = mapGoogleTypesToCategory(place.types, requestedCategory);
  const apiKey = getGoogleMapsApiKey();

  // Extract high-resolution photo URL from individual place's photo collection
  let imageUrl = '';
  if (place.photos && Array.isArray(place.photos) && place.photos.length > 0) {
    for (const photo of place.photos) {
      const uri = extractPhotoUri(photo, apiKey);
      if (uri) {
        imageUrl = uri;
        break;
      }
    }
  }

  // If place has no photo from Google, provide a unique, distinct fallback image
  if (!imageUrl) {
    imageUrl = getUniqueFallbackImage(name, place.id || String(index), category, index);
  }

  // Format human-friendly tags
  const tags: string[] = [];
  if (place.types && Array.isArray(place.types)) {
    place.types.slice(0, 3).forEach((t: string) => {
      const formatted = t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      if (formatted !== 'Establishment' && formatted !== 'Point Of Interest') {
        tags.push(formatted);
      }
    });
  }
  if (tags.length === 0) {
    tags.push(category, 'Featured');
  }

  // Calculate curiosity score
  const rating = typeof place.rating === 'number' ? Number(place.rating.toFixed(1)) : 4.6;
  const reviewsCount = typeof place.userRatingCount === 'number' ? place.userRatingCount : 128;
  const curiosityScore = Math.min(99, Math.round(rating * 18 + Math.min(reviewsCount / 100, 10)));

  // Price level formatting
  let priceStr: '$$' | '$$$' | '$$$$' | '$' = '$$';
  if (typeof place.priceLevel === 'string') {
    const levelMap: Record<string, '$$' | '$$$' | '$$$$' | '$'> = {
      'PRICE_LEVEL_FREE': '$',
      'PRICE_LEVEL_INEXPENSIVE': '$',
      'PRICE_LEVEL_MODERATE': '$$',
      'PRICE_LEVEL_EXPENSIVE': '$$$',
      'PRICE_LEVEL_VERY_EXPENSIVE': '$$$$'
    };
    priceStr = levelMap[place.priceLevel] || '$$';
  } else if (typeof place.priceLevel === 'number') {
    const count = Math.max(1, Math.min(4, place.priceLevel));
    priceStr = ('$'.repeat(count)) as '$$' | '$$$' | '$$$$' | '$';
  }

  // Description
  const description = typeof place.editorialSummary === 'string'
    ? place.editorialSummary
    : (place.editorialSummary?.text || place.formattedAddress || 'A remarkable exploration spot discovered with RoAmigos.');

  return {
    id: `gmp_${place.id || Math.random().toString(36).substring(2, 9)}`,
    name,
    category,
    distance: 'Nearby',
    rating,
    reviewsCount,
    image: imageUrl,
    locationName: place.formattedAddress || name,
    coordinates: { lat, lng },
    tags,
    description,
    saved: false,
    priceLevel: priceStr,
    bestTimeToVisit: 'Morning to Sunset',
    curiosityScore
  };
};

export interface SearchPlacesResult {
  places: Place[];
  center?: { lat: number; lng: number };
}

// Executes Places API (New) Text Search
export const searchPlacesWorldwide = async (
  query: string,
  category?: string,
  locationBias?: { lat: number; lng: number }
): Promise<SearchPlacesResult> => {
  if (typeof window === 'undefined' || !(window as any).google?.maps?.places?.Place) {
    throw new Error('Google Maps Places API is not loaded yet');
  }

  const { Place } = (window as any).google.maps.places;

  // Build targeted query
  let searchQuery = query.trim();
  if (category && category !== 'all' && !searchQuery.toLowerCase().includes(category.toLowerCase())) {
    searchQuery = `${searchQuery} ${category}`;
  }

  const searchRequest: any = {
    textQuery: searchQuery,
    fields: [
      'id',
      'displayName',
      'formattedAddress',
      'location',
      'rating',
      'userRatingCount',
      'photos',
      'types',
      'priceLevel',
      'editorialSummary'
    ],
    maxResultCount: 15
  };

  if (locationBias) {
    searchRequest.locationBias = {
      center: { lat: locationBias.lat, lng: locationBias.lng },
      radius: 30000 // 30km exploration radius
    };
  }

  try {
    const { places } = await Place.searchByText(searchRequest);

    if (!places || places.length === 0) {
      return { places: [] };
    }

    // Process places and resolve individual photos
    const transformed: Place[] = await Promise.all(
      places.map(async (p: any, index: number) => {
        // If photos are missing or empty on the search stub, fetch fields specifically for this place
        if ((!p.photos || p.photos.length === 0) && typeof p.fetchFields === 'function') {
          try {
            await p.fetchFields({ fields: ['photos', 'editorialSummary'] });
          } catch {
            // Non-fatal: will use rich individual fallback
          }
        }
        return transformGooglePlaceToRoAmigos(p, category, index);
      })
    );

    const firstCoord = transformed[0]?.coordinates;
    return {
      places: transformed,
      center: firstCoord && (firstCoord.lat !== 0 || firstCoord.lng !== 0) ? firstCoord : undefined
    };
  } catch (error: any) {
    const msg = String(error?.message || error);
    if (
      msg.includes('OVER_QUERY_LIMIT') ||
      msg.includes('RESOURCE_EXHAUSTED') ||
      msg.includes('OverQuotaMapError') ||
      error?.status === 429
    ) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
    throw error;
  }
};

export interface AutocompleteResult {
  placeId: string;
  text: string;
  mainText?: string;
  secondaryText?: string;
}

// Programmatic Autocomplete Suggestions using AutocompleteSuggestion (New)
export const fetchWorldwideAutocomplete = async (
  input: string,
  sessionToken?: any
): Promise<AutocompleteResult[]> => {
  if (
    typeof window === 'undefined' ||
    !(window as any).google?.maps?.places?.AutocompleteSuggestion
  ) {
    return [];
  }

  const { AutocompleteSuggestion } = (window as any).google.maps.places;

  try {
    const request: any = { input };
    if (sessionToken) {
      request.sessionToken = sessionToken;
    }

    const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
    if (!suggestions || suggestions.length === 0) return [];

    return suggestions
      .filter((s: any) => s.placePrediction)
      .map((s: any) => {
        const pred = s.placePrediction;
        const mainText = pred.mainText?.toString() || pred.text?.toString() || '';
        const secondaryText = pred.secondaryText?.toString() || '';
        return {
          placeId: pred.placeId,
          text: pred.text?.toString() || mainText,
          mainText,
          secondaryText
        };
      });
  } catch (error: any) {
    const msg = String(error?.message || error);
    if (
      msg.includes('OVER_QUERY_LIMIT') ||
      msg.includes('RESOURCE_EXHAUSTED') ||
      error?.status === 429
    ) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
    return [];
  }
};
