export type NavTab = 
  | 'home' 
  | 'discover' 
  | 'chats' 
  | 'friends' 
  | 'groups' 
  | 'profile' 
  | 'notifications' 
  | 'settings'
  | 'login';

export interface Place {
  id: string;
  name: string;
  category: 'Hidden Gems' | 'Adventure' | 'Cafes' | 'Nature' | 'Weekend Trips' | 'Entertainment' | 'Rooftop';
  distance: string;
  rating: number;
  reviewsCount: number;
  image: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tags: string[];
  description: string;
  saved: boolean;
  savedByFriends?: {
    id: string;
    name: string;
    avatar: string;
  }[];
  priceLevel?: '$$' | '$$$' | '$$$$' | '$';
  bestTimeToVisit?: string;
  curiosityScore?: number;
}

export interface User {
  id: string;
  uid: string;
  name: string;
  username: string;
  email: string;
  photoURL: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: string;
  online: boolean;
  onlineStatus: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  interests: string[];
  stats: {
    friendsCount: number;
    groupsCount: number;
    savedPlacesCount: number;
    tripsCount: number;
  };
}

export type UserProfile = User;

export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  online: boolean;
  lastActive: string;
  location: string;
  mutualFriends: number;
  status: 'friend' | 'pending_incoming' | 'pending_outgoing' | 'suggested';
  sharedInterests: string[];
  recentPlace?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'Leader' | 'Explorer' | 'Contributor';
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage?: string;
  category: string;
  memberCount: number;
  activity: string;
  lastActive: string;
  isMember: boolean;
  pinnedDestination?: string;
  members: GroupMember[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  attachment?: {
    type: 'image' | 'location';
    url?: string;
    title?: string;
    subtitle?: string;
  };
}

export interface Conversation {
  id: string;
  friendId: string;
  friendName: string;
  friendUsername: string;
  friendAvatar: string;
  isOnline: boolean;
  lastActive: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export type NotificationType = 
  | 'friend_request' 
  | 'new_message' 
  | 'group_invitation' 
  | 'place_shared' 
  | 'trip_update';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actor: {
    name: string;
    avatar: string;
    username?: string;
  };
  targetDetails?: {
    placeName?: string;
    groupName?: string;
    tripName?: string;
  };
  actions?: {
    acceptLabel?: string;
    declineLabel?: string;
    viewLabel?: string;
  };
}

export interface TripPlace {
  id: string;
  name: string;
  city?: string;
  country?: string;
  notes?: string;
  isFavorite?: boolean;
  day?: number;
}

export interface TripParticipant {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
}

export interface TripPhoto {
  id: string;
  url: string;
  storagePath?: string;
  caption?: string;
  placeId?: string;
  isFavorite?: boolean;
  uploadedAt: string;
  day?: number;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  coverPhotoUrl: string;
  photoCount: number;
  placeCount: number;
  friendCount: number;
  visibility: 'private' | 'friends';
  places: TripPlace[];
  participants: TripParticipant[];
  photos: TripPhoto[];
  createdAt: string;
  updatedAt: string;
}

export type TripInput = Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'photoCount' | 'placeCount' | 'friendCount'>;

