import { Place, User, Friend, Group, Conversation, AppNotification } from '../types';

// Verified local generated asset paths
const observatoryImg = '/src/assets/images/curiocircle_observatory_1790849336259.jpg';
const bambooCafeImg = '/src/assets/images/curiocircle_bamboo_cafe_1790849354806.jpg';
const coastalCoveImg = '/src/assets/images/curiocircle_coastal_cove_1790849369807.jpg';
const rooftopLoungeImg = '/src/assets/images/curiocircle_rooftop_lounge_1790849379934.jpg';
const explorerAvatarImg = '/src/assets/images/curiocircle_explorer_avatar_1790849397239.jpg';

export const currentUser: User = {
  id: 'usr_me',
  uid: 'usr_me',
  name: 'Kaelen Vance',
  username: 'kaelen.roams',
  email: 'kaelen.explorer@roamigos.app',
  photoURL: explorerAvatarImg,
  avatar: explorerAvatarImg,
  bio: 'Chasing architectural marvels, hidden twilight tearooms, and night viewpoints with fellow travel companions.',
  location: 'San Francisco, CA & Kyoto',
  joinedDate: 'Joined March 2025',
  online: true,
  onlineStatus: 'Active now',
  lastSeen: 'Active now',
  createdAt: '2025-03-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  interests: ['Cliffside Views', 'Night Photography', 'Artisan Cafes', 'Hidden Tunnels', 'Stargazing', 'Boutique Stays'],
  stats: {
    friendsCount: 42,
    groupsCount: 6,
    savedPlacesCount: 28,
    tripsCount: 5,
  }
};

export const samplePlaces: Place[] = [
  {
    id: 'place_1',
    name: 'Aetheria Observatory & Terrace',
    category: 'Hidden Gems',
    distance: '2.4 km away',
    rating: 4.95,
    reviewsCount: 142,
    image: observatoryImg,
    locationName: 'Twin Peaks Overlook, SF',
    coordinates: { lat: 37.7544, lng: -122.4477 },
    tags: ['Panoramic', 'Stargazing', 'Architectural'],
    description: 'A secluded cantilevered glass dome lounge set above the fog line with celestial maps, warm fire pits, and seasonal botanical infusions.',
    saved: true,
    priceLevel: '$$$',
    bestTimeToVisit: 'Blue Hour & Twilight (8:00 PM)',
    curiosityScore: 98,
    savedByFriends: [
      { id: 'f_1', name: 'Aria Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { id: 'f_2', name: 'Mateo Rossi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'place_2',
    name: 'Komorebi Twilight Bamboo Teahouse',
    category: 'Cafes',
    distance: '4.8 km away',
    rating: 4.88,
    reviewsCount: 96,
    image: bambooCafeImg,
    locationName: 'Hidden Grove Path, Presidio',
    coordinates: { lat: 37.7989, lng: -122.4662 },
    tags: ['Secret Garden', 'Ceremonial Matcha', 'Lantern Lit'],
    description: 'Nestled between whispering bamboo stalks, this twilight sanctuary serves hand-whisked ceremonial matcha beside stone koi ponds.',
    saved: false,
    priceLevel: '$$',
    bestTimeToVisit: 'Dusk (6:30 PM)',
    curiosityScore: 94,
    savedByFriends: [
      { id: 'f_3', name: 'Sora Tanaka', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'place_3',
    name: 'Neptune’s Grotto Coastal Sanctuary',
    category: 'Adventure',
    distance: '18.2 km away',
    rating: 4.92,
    reviewsCount: 210,
    image: coastalCoveImg,
    locationName: 'Marin Headlands Coast',
    coordinates: { lat: 37.8272, lng: -122.5298 },
    tags: ['Sea Cavern', 'Candlelit', 'Ocean Echoes'],
    description: 'Naturally sculpted sea cavern accessible only during low-tide windows. Soft ambient lantern illumination reflecting across turquoise tide pools.',
    saved: true,
    priceLevel: '$$$',
    bestTimeToVisit: 'Low Tide Window',
    curiosityScore: 99,
    savedByFriends: [
      { id: 'f_1', name: 'Aria Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { id: 'f_4', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      { id: 'f_5', name: 'Devon Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'place_4',
    name: 'Helix Botanical Sky Conservatory',
    category: 'Rooftop',
    distance: '1.1 km away',
    rating: 4.84,
    reviewsCount: 320,
    image: rooftopLoungeImg,
    locationName: 'SoMa Arts District',
    coordinates: { lat: 37.7858, lng: -122.4008 },
    tags: ['Skyline Views', 'Art Installations', 'Craft Cocktails'],
    description: 'An elevated steel-and-glass greenhouse with kinetic lighting structures and rare tropical flora overlooking the evening skyline.',
    saved: false,
    priceLevel: '$$$',
    bestTimeToVisit: 'Nightfall (9:00 PM)',
    curiosityScore: 91,
    savedByFriends: [
      { id: 'f_2', name: 'Mateo Rossi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'place_5',
    name: 'Whispering Redwoods Secret Basin',
    category: 'Nature',
    distance: '31.5 km away',
    rating: 4.97,
    reviewsCount: 88,
    image: coastalCoveImg,
    locationName: 'Muir Woods Canyon Outskirts',
    coordinates: { lat: 37.8970, lng: -122.5811 },
    tags: ['Old Growth', 'Fern Canyon', 'Silence Sanctuary'],
    description: 'An off-map basin flanked by 800-year-old coastal redwoods and carpeted with emerald ferns. Perfect for mindful escapes.',
    saved: true,
    priceLevel: '$',
    bestTimeToVisit: 'Early Morning Fog (7:00 AM)',
    curiosityScore: 96,
    savedByFriends: [
      { id: 'f_3', name: 'Sora Tanaka', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' }
    ]
  },
  {
    id: 'place_6',
    name: 'The Alchemist Underground Vaults',
    category: 'Entertainment',
    distance: '3.6 km away',
    rating: 4.79,
    reviewsCount: 175,
    image: observatoryImg,
    locationName: 'Historic North Beach',
    coordinates: { lat: 37.7993, lng: -122.4080 },
    tags: ['Speakeasy', 'Curiosity Cabinets', 'Vinyl Audio'],
    description: 'Behind a bookcase in an antique clockmaker shop lies this subterranean salon featuring historic curiosity cabinets and analog Hi-Fi sound.',
    saved: false,
    priceLevel: '$$$',
    bestTimeToVisit: 'Thursday Late Evenings',
    curiosityScore: 93,
    savedByFriends: [
      { id: 'f_5', name: 'Devon Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
    ]
  }
];

export const sampleFriends: Friend[] = [
  {
    id: 'f_1',
    name: 'Aria Chen',
    username: 'ariachen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    online: true,
    lastActive: 'Active now',
    location: 'Mission District',
    mutualFriends: 14,
    status: 'friend',
    sharedInterests: ['Night Photography', 'Rooftops', 'Secret Cafes'],
    recentPlace: 'Aetheria Observatory'
  },
  {
    id: 'f_2',
    name: 'Mateo Rossi',
    username: 'mateo_voyages',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    online: true,
    lastActive: 'Active now',
    location: 'Pacific Heights',
    mutualFriends: 8,
    status: 'friend',
    sharedInterests: ['Cliff Hikes', 'Sea Caves', 'Vinyl Lounges'],
    recentPlace: 'Helix Sky Conservatory'
  },
  {
    id: 'f_3',
    name: 'Sora Tanaka',
    username: 'soratanaka',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    online: false,
    lastActive: '28m ago',
    location: 'Kyoto / San Francisco',
    mutualFriends: 19,
    status: 'friend',
    sharedInterests: ['Bamboo Groves', 'Matcha Tea', 'Ceramic Studios'],
    recentPlace: 'Komorebi Teahouse'
  },
  {
    id: 'f_4',
    name: 'Elena Rostova',
    username: 'elena_lens',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    online: false,
    lastActive: '2h ago',
    location: 'Sausalito',
    mutualFriends: 5,
    status: 'friend',
    sharedInterests: ['Coastal Trails', 'Stargazing', 'Architecture'],
    recentPlace: 'Neptune’s Grotto'
  },
  {
    id: 'f_5',
    name: 'Devon Kim',
    username: 'devon.walks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    online: true,
    lastActive: 'Active now',
    location: 'Marina District',
    mutualFriends: 11,
    status: 'pending_incoming',
    sharedInterests: ['Urban Exploration', 'Speakeasies', 'Weekend Trips']
  },
  {
    id: 'f_6',
    name: 'Marcus Bell',
    username: 'marcus_ambient',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    online: false,
    lastActive: '1d ago',
    location: 'Oakland Hills',
    mutualFriends: 7,
    status: 'pending_incoming',
    sharedInterests: ['Mountain Biking', 'Dark Sky Parks']
  },
  {
    id: 'f_7',
    name: 'Zara Thorne',
    username: 'zarathorne',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    online: false,
    lastActive: '3d ago',
    location: 'Presidio Terrace',
    mutualFriends: 6,
    status: 'suggested',
    sharedInterests: ['Hidden Gem Cafes', 'Artisan Bakeries', 'Art Crawls']
  },
  {
    id: 'f_8',
    name: 'Liam Sterling',
    username: 'liam_expeditions',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    online: true,
    lastActive: 'Active now',
    location: 'Berkeley Marina',
    mutualFriends: 4,
    status: 'suggested',
    sharedInterests: ['Kayaking', 'Coastal Exploration', 'Night Photography']
  }
];

export const sampleGroups: Group[] = [
  {
    id: 'grp_1',
    name: 'Weekend Explorers',
    description: 'Curating off-the-beaten-path Saturday twilight treks and secret viewpoint picnics around the bay.',
    avatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80',
    coverImage: observatoryImg,
    category: 'Weekend Escapes',
    memberCount: 24,
    activity: '3 places scouted this week',
    lastActive: '15m ago',
    isMember: true,
    pinnedDestination: 'Aetheria Observatory Night Gathering',
    members: [
      { id: 'f_1', name: 'Aria Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', role: 'Leader' },
      { id: 'f_2', name: 'Mateo Rossi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', role: 'Explorer' },
      { id: 'f_3', name: 'Sora Tanaka', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', role: 'Explorer' },
      { id: 'usr_me', name: 'Kaelen Vance', avatar: explorerAvatarImg, role: 'Contributor' }
    ]
  },
  {
    id: 'grp_2',
    name: 'Goa Coastal Odyssey',
    description: 'Planning our 8-day expedition through South Goa secluded coves, ancient spice sanctuaries, and beachside jazz lounges.',
    avatar: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=200&q=80',
    coverImage: coastalCoveImg,
    category: 'Trip Planning',
    memberCount: 8,
    activity: 'Flight details & stay poll active',
    lastActive: '1h ago',
    isMember: true,
    pinnedDestination: 'Butterfly Beach Sea Caves & Palolem',
    members: [
      { id: 'f_2', name: 'Mateo Rossi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', role: 'Leader' },
      { id: 'f_4', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', role: 'Explorer' },
      { id: 'usr_me', name: 'Kaelen Vance', avatar: explorerAvatarImg, role: 'Explorer' }
    ]
  },
  {
    id: 'grp_3',
    name: 'College Friends Circle',
    description: 'Casual Friday reunions, rooftop hangout spots, underground food halls, and throwback memories.',
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=200&q=80',
    coverImage: rooftopLoungeImg,
    category: 'Social Circle',
    memberCount: 16,
    activity: 'New poll: Saturday dinner venue',
    lastActive: '3h ago',
    isMember: true,
    pinnedDestination: 'Helix Sky Conservatory',
    members: [
      { id: 'f_1', name: 'Aria Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', role: 'Contributor' },
      { id: 'usr_me', name: 'Kaelen Vance', avatar: explorerAvatarImg, role: 'Explorer' }
    ]
  },
  {
    id: 'grp_4',
    name: 'Adventure Squad',
    description: 'High-adrenaline expeditions: midnight sea kayaking, bouldering hidden ridges, and dark sky meteor watches.',
    avatar: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=200&q=80',
    coverImage: coastalCoveImg,
    category: 'Action & Adventure',
    memberCount: 31,
    activity: 'Route scouted for Neptune’s Grotto',
    lastActive: '5h ago',
    isMember: false,
    pinnedDestination: 'Marin Low Tide Sea Caverns',
    members: [
      { id: 'f_2', name: 'Mateo Rossi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', role: 'Leader' },
      { id: 'f_4', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', role: 'Explorer' }
    ]
  },
  {
    id: 'grp_5',
    name: 'Twilight Cafe Curators',
    description: 'Discovering atmospheric coffee spots, late-night tea sanctuaries, and quiet reading nooks.',
    avatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80',
    coverImage: bambooCafeImg,
    category: 'Cafes & Ambiance',
    memberCount: 19,
    activity: 'Review posted on Komorebi Bamboo',
    lastActive: 'Yesterday',
    isMember: false,
    pinnedDestination: 'Komorebi Teahouse',
    members: [
      { id: 'f_3', name: 'Sora Tanaka', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', role: 'Leader' }
    ]
  }
];

export const sampleConversations: Conversation[] = [
  {
    id: 'conv_1',
    friendId: 'f_1',
    friendName: 'Aria Chen',
    friendUsername: 'ariachen',
    friendAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isOnline: true,
    lastActive: 'Active now',
    lastMessage: 'The terrace at Aetheria is unbelievable at sunset! Are you free this Friday?',
    lastMessageTime: '7:42 PM',
    unreadCount: 2,
    messages: [
      {
        id: 'm_1',
        senderId: 'f_1',
        senderName: 'Aria Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'Hey Kaelen! Have you checked out the new observatory spot pinned on RoAmigos?',
        timestamp: '7:30 PM',
        isMine: false
      },
      {
        id: 'm_2',
        senderId: 'usr_me',
        senderName: 'Kaelen Vance',
        senderAvatar: explorerAvatarImg,
        text: 'Just saved it! The dome architecture looks otherworldly. Mateo said the fog rolls right underneath it.',
        timestamp: '7:35 PM',
        isMine: true
      },
      {
        id: 'm_3',
        senderId: 'f_1',
        senderName: 'Aria Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'The terrace at Aetheria is unbelievable at sunset! Are you free this Friday?',
        timestamp: '7:42 PM',
        isMine: false,
        attachment: {
          type: 'location',
          title: 'Aetheria Observatory & Terrace',
          subtitle: 'Twin Peaks Overlook · 2.4 km away'
        }
      }
    ]
  },
  {
    id: 'conv_2',
    friendId: 'f_2',
    friendName: 'Mateo Rossi',
    friendUsername: 'mateo_voyages',
    friendAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isOnline: true,
    lastActive: 'Active now',
    lastMessage: 'Low tide hits at 6:15 PM on Sunday. Ideal for Neptune’s Grotto!',
    lastMessageTime: '5:10 PM',
    unreadCount: 0,
    messages: [
      {
        id: 'm_4',
        senderId: 'usr_me',
        senderName: 'Kaelen Vance',
        senderAvatar: explorerAvatarImg,
        text: 'Mateo, did you check the tide charts for Marin Headlands?',
        timestamp: '5:02 PM',
        isMine: true
      },
      {
        id: 'm_5',
        senderId: 'f_2',
        senderName: 'Mateo Rossi',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'Low tide hits at 6:15 PM on Sunday. Ideal for Neptune’s Grotto! Bring waterproof footwear.',
        timestamp: '5:10 PM',
        isMine: false
      }
    ]
  },
  {
    id: 'conv_3',
    friendId: 'f_3',
    friendName: 'Sora Tanaka',
    friendUsername: 'soratanaka',
    friendAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    isOnline: false,
    lastActive: '28m ago',
    lastMessage: 'Found this tranquil tea garden hidden by the Presidio bamboo path.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm_6',
        senderId: 'f_3',
        senderName: 'Sora Tanaka',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        text: 'Found this tranquil tea garden hidden by the Presidio bamboo path. Lanterns turn on right at dusk.',
        timestamp: 'Yesterday',
        isMine: false
      }
    ]
  }
];

export const sampleNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'friend_request',
    title: 'New Friend Request',
    message: 'Devon Kim sent you a connection request to share exploration spots.',
    time: '12m ago',
    read: false,
    actor: {
      name: 'Devon Kim',
      username: 'devon.walks',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    actions: {
      acceptLabel: 'Accept',
      declineLabel: 'Decline'
    }
  },
  {
    id: 'notif_2',
    type: 'place_shared',
    title: 'Place Shared with You',
    message: 'Aria Chen shared "Aetheria Observatory & Terrace" and added it to Weekend Explorers wishlist.',
    time: '45m ago',
    read: false,
    actor: {
      name: 'Aria Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    targetDetails: {
      placeName: 'Aetheria Observatory & Terrace'
    },
    actions: {
      viewLabel: 'View Place'
    }
  },
  {
    id: 'notif_3',
    type: 'group_invitation',
    title: 'Group Invitation',
    message: 'Mateo Rossi invited you to join "Goa Coastal Odyssey" trip circle.',
    time: '2h ago',
    read: false,
    actor: {
      name: 'Mateo Rossi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    targetDetails: {
      groupName: 'Goa Coastal Odyssey'
    },
    actions: {
      acceptLabel: 'Join Circle',
      declineLabel: 'Maybe Later'
    }
  },
  {
    id: 'notif_4',
    type: 'trip_update',
    title: 'Trip Itinerary Update',
    message: '3 friends voted to add Palolem Secret Caves to the Goa itinerary.',
    time: '5h ago',
    read: true,
    actor: {
      name: 'Goa Circle',
      avatar: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=150&q=80'
    },
    targetDetails: {
      tripName: 'Goa Coastal Odyssey'
    },
    actions: {
      viewLabel: 'See Votes'
    }
  },
  {
    id: 'notif_5',
    type: 'new_message',
    title: 'New Message',
    message: 'Aria Chen sent you a location pin in direct chat.',
    time: 'Yesterday',
    read: true,
    actor: {
      name: 'Aria Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    actions: {
      viewLabel: 'Open Chat'
    }
  }
];

export const sampleCategories = [
  { id: 'all', name: 'All Curiosities', icon: 'Sparkles', count: 48 },
  { id: 'Hidden Gems', name: 'Hidden Gems', icon: 'Compass', count: 18 },
  { id: 'Adventure', name: 'Adventure', icon: 'Mountain', count: 12 },
  { id: 'Cafes', name: 'Cafes', icon: 'Coffee', count: 14 },
  { id: 'Nature', name: 'Nature', icon: 'Trees', count: 9 },
  { id: 'Weekend Trips', name: 'Weekend Trips', icon: 'MapPin', count: 7 },
  { id: 'Entertainment', name: 'Entertainment', icon: 'Disc', count: 11 }
];
