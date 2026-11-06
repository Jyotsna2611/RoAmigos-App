# Worldwide Places Search Integration Plan

## User Review & Critical Decisions

Based on your selections during the planning phase, this integration is designed around three foundational choices:
1. **Zero-Billing Key Setup**: Use the hosted Google Maps Platform Starter / Demo Key via AI Studio. This provides direct access to Google Places and Maps APIs without requiring a Google Cloud billing account or credit card.
2. **Interactive Map & Card Sync**: Replace the static radar mockup with a live interactive Google Map with custom styled markers synchronized with real place discovery cards in the Mint Explorer theme.
3. **Rich Search Experience**: Enable worldwide text search, live location autocomplete suggestions with session tokens, and thematic category filters (Cafes, Hidden Gems, Nature, Adventure, Culture, Dining).

---

## 1. Overview & Core Concept

Currently, the Discover page in RoAmigos filters an in-memory 6-item San Francisco mock array. When searching for cities across the globe (e.g., "Visakhapatnam", "Kyoto", "Rome"), it displays "No places found".

This plan transitions RoAmigos to real-world global place discovery powered by the modern **Google Places API (New)** and **Google Maps JavaScript API** via `@vis.gl/react-google-maps`. Users can search for any city, landmark, or venue worldwide, filter by category, see live pins on an interactive pastel-themed map, view real photos, ratings, addresses, and save discoveries directly to their RoAmigos account.

---

## 2. User Experience & Visual Design

The new Discover interface will strictly adhere to the **Mint Explorer** pastel design language:
- **Palette**: Deep forest green (`#285943`), Sage green (`#A8C9B2`), Soft mint (`#DDF1E4`), Main canvas (`#F5FAF5`), Cards (`#FFFFFF`).
- **Dual Layout**:
  - **Left / Top**: Search bar with real-time autocomplete dropdown, current location indicator, category pill filters, and scrolling grid of place cards with real place photos, rating badges, price level indicators, and "Save to RoAmigos" actions.
  - **Right / Interactive Panel**: Full-height interactive Google Map rendered with custom pastel map styling matching Mint Explorer, featuring custom mint & forest-green pins (`AdvancedMarkerElement`) and active place info windows.
- **State Handling**:
  - **Loading**: Soft shimmering pastel skeleton cards and smooth map panning.
  - **Zero Results**: Helpful, friendly empty state with suggested worldwide search destinations (e.g., "Visakhapatnam, India", "Kyoto, Japan", "Reykjavík, Iceland") and quick reset filters.
  - **Quota Defense & Offline Notice**: Graceful inline banner alerting the user if rate limits are reached, preserving existing saved places.

---

## 3. Key Product Decisions & Trade-Offs

1. **Modern Places API (New) vs. Legacy Places Service**:
   - Google permanently deprecated legacy `google.maps.places.PlacesService` and `Autocomplete` on March 1, 2025.
   - We will use `Place.searchByText`, `Place.searchNearby`, and `AutocompleteSuggestion.fetchAutocompleteSuggestions` with `AutocompleteSessionToken` for billing-optimized session bundling.
2. **Billing & Key Management**:
   - **Is billing necessary?** No. AI Studio provides hosted Google Maps Platform demo/starter keys that function immediately without billing accounts or credit cards.
   - For users wishing to use their own Google Cloud project in production, the architecture seamlessly supports `VITE_GOOGLE_MAPS_API_KEY` from `.env.local` with standard Google Cloud free monthly tier ($200 credit).
3. **Data Continuity with Existing Features**:
   - Discovered places match the RoAmigos `Place` schema (`id`, `name`, `category`, `rating`, `image`, `coordinates`, `locationName`, `saved`).
   - Saved places will continue to sync seamlessly into the user's "My Trips & Memories" collection and personal bookmarks.

---

## 4. Technical Architecture & Data Strategy

```
+---------------------------------------------------------------------------------+
|                               RoAmigos Client                                    |
|                                                                                 |
|  +---------------------------+       +---------------------------------------+  |
|  |     DiscoverPage.tsx      | <---> |           usePlacesSearch             |  |
|  |  - Autocomplete Input     |       |   - Debounced search queries          |  |
|  |  - Category Filter Pills  |       |   - SessionToken lifecycle            |  |
|  |  - Place Cards Grid       |       |   - Loading & Error states            |  |
|  |  - Interactive Map View   |       +---------------------------------------+  |
|  +---------------------------+                           |                      |
|                |                                         |                      |
|                v                                         v                      |
|  +---------------------------+       +---------------------------------------+  |
|  | @vis.gl/react-google-maps |       |         placesService.ts              |  |
|  |  - APIProvider            |       |  - Place.searchByText()               |  |
|  |  - Map (Mint pastel style)|       |  - AutocompleteSuggestion             |  |
|  |  - AdvancedMarkerElement  |       |  - Place photo URI resolver           |  |
|  +---------------------------+       +---------------------------------------+  |
+----------------------------------------------------------|----------------------+
                                                           |
                                                           v
                                            +------------------------------+
                                            |  Google Maps Platform        |
                                            |  - Places API (New)          |
                                            |  - Maps JavaScript API       |
                                            +------------------------------+
```

### Files to Modify and Create

1. **`package.json`**:
   - Install `@vis.gl/react-google-maps` (official React wrapper for Google Maps JS API).
2. **`.env.example` & Environment**:
   - Declare `VITE_GOOGLE_MAPS_API_KEY`.
3. **`src/services/places/placesService.ts` (New File)**:
   - Encapsulates Google Maps JavaScript API loader.
   - Implements `searchPlaces(query: string, category?: string, locationBias?: {lat, lng})`.
   - Implements `getAutocompleteSuggestions(input: string, sessionToken: AutocompleteSessionToken)`.
   - Normalizes Places API (New) responses into RoAmigos `Place` models with high-res photos and geolocation.
4. **`src/hooks/usePlacesSearch.ts` (New File)**:
   - React hook handling debounce (300ms), active session tokens, search history, error handling, and selected place state.
5. **`src/pages/DiscoverPage.tsx` (Update)**:
   - Connects the search bar and location selector to real worldwide queries.
   - Renders the interactive map with custom Mint Explorer style json (`#EDF5EE` terrain, `#A8C9B2` water, muted nature tones).
   - Replaces mock radar with live synchronized markers and interactive selection cards.
6. **`src/App.tsx` (Update)**:
   - Wraps the application with `<APIProvider apiKey={...} libraries={['places', 'marker']}>` when a key is provided, ensuring seamless map availability across navigation.

---

## 5. Implementation Roadmap (Post-Approval)

- **Step 1: Setup & Dependencies**
  - Install `@vis.gl/react-google-maps` and verify environment variables.
- **Step 2: Core Places Service & Hook**
  - Build `placesService.ts` utilizing `google.maps.places.Place.searchByText` and `AutocompleteSuggestion`.
  - Build `usePlacesSearch.ts` hook for smooth, debounced query execution.
- **Step 3: Discover Page & Interactive Map Integration**
  - Update `DiscoverPage.tsx` with split view (cards list + interactive pastel Google Map).
  - Add pastel map styles and custom SVG pin markers.
  - Connect category chips (Cafes, Hidden Gems, Adventure, Nature, Weekend Trips) to live Places API queries.
- **Step 4: Verification & Validation**
  - Search test for "visakhapatnam" to verify real worldwide place results, high-resolution imagery, and exact GPS coordinates.
  - Verify zero-regression on Firebase Auth, My Trips & Memories, and Mint Explorer styling.
