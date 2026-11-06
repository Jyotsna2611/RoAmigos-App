import { useState, useEffect, useRef, useCallback } from 'react';
import { Place } from '../types';
import { 
  searchPlacesWorldwide, 
  fetchWorldwideAutocomplete, 
  AutocompleteResult 
} from '../services/places/placesService';

interface UsePlacesSearchProps {
  initialLocationName: string;
  initialCategory?: string;
  initialPlaces?: Place[];
}

export function usePlacesSearch({
  initialLocationName,
  initialCategory = 'all',
  initialPlaces = []
}: UsePlacesSearchProps) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194
  });

  const sessionTokenRef = useRef<any>(null);
  const debounceTimerRef = useRef<any>(null);
  const currentQueryRef = useRef<string>('');

  // Initializes or renews the session token for billing optimization
  const refreshSessionToken = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).google?.maps?.places?.AutocompleteSessionToken) {
      sessionTokenRef.current = new (window as any).google.maps.places.AutocompleteSessionToken();
    }
  }, []);

  // Main search function
  const executeSearch = useCallback(async (
    query: string,
    category: string = 'all',
    biasCoordinates?: { lat: number; lng: number }
  ) => {
    if (!query.trim()) {
      return;
    }

    currentQueryRef.current = query;
    setLoading(true);
    setError(null);

    try {
      // Check if Google Places API is available
      if (typeof window !== 'undefined' && (window as any).google?.maps?.places?.Place) {
        const result = await searchPlacesWorldwide(query, category, biasCoordinates || mapCenter);
        if (currentQueryRef.current === query) {
          setPlaces(result.places);
          if (result.center) {
            setMapCenter(result.center);
          }
        }
      } else {
        // Fallback filter on initial places if Google Maps script is loading or offline
        const filtered = initialPlaces.filter((p) => {
          const matchQ = p.name.toLowerCase().includes(query.toLowerCase()) ||
                         p.locationName.toLowerCase().includes(query.toLowerCase());
          const matchC = category === 'all' || p.category === category;
          return matchQ && matchC;
        });
        setPlaces(filtered);
      }
    } catch (err: any) {
      console.warn('Places search failed, using graceful handling:', err);
      setError(err?.message || 'Failed to search places');
    } finally {
      setLoading(false);
      refreshSessionToken();
    }
  }, [initialPlaces, mapCenter, refreshSessionToken]);

  // Autocomplete fetch with debounce
  const fetchSuggestions = useCallback((input: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!input.trim() || input.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        if (!sessionTokenRef.current) {
          refreshSessionToken();
        }
        const results = await fetchWorldwideAutocomplete(input, sessionTokenRef.current);
        setSuggestions(results);
      } catch (err) {
        console.warn('Autocomplete fetch error:', err);
        setSuggestions([]);
      }
    }, 250);
  }, [refreshSessionToken]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  // Initialize session token on mount
  useEffect(() => {
    refreshSessionToken();
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [refreshSessionToken]);

  return {
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
  };
}
