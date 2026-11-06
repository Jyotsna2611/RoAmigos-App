import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Trip, TripInput } from '../../types';
import { deleteTripPhotosBatch } from './tripStorageService';

/**
 * Collection helper for user trips subcollection: `users/{userId}/trips`
 */
function getTripsCollectionRef(userId: string) {
  return collection(db, 'users', userId, 'trips');
}

function getTripDocRef(userId: string, tripId: string) {
  return doc(db, 'users', userId, 'trips', tripId);
}

/**
 * Recursively cleans an object to ensure no undefined values reach Firestore SDK.
 */
function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean as T;
}

/**
 * Fetch all trips for a given user.
 */
export async function getUserTrips(userId: string): Promise<Trip[]> {
  const path = `users/${userId}/trips`;
  try {
    const q = query(getTripsCollectionRef(userId));
    const snapshot = await getDocs(q);
    const trips = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Trip[];

    // Sort by createdAt desc in client memory safely
    trips.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    return trips;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Subscribe to real-time updates for a user's trips.
 */
export function subscribeUserTrips(
  userId: string,
  onUpdate: (trips: Trip[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = `users/${userId}/trips`;
  const q = query(getTripsCollectionRef(userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const trips = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Trip[];

      // Sort by createdAt desc safely
      trips.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      onUpdate(trips);
    },
    (error) => {
      console.error('Trips subscription error:', error);
      if (onError) {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (e: any) {
          onError(e);
        }
      }
    }
  );
}

/**
 * Get a single trip by ID.
 */
export async function getTripById(userId: string, tripId: string): Promise<Trip | null> {
  const path = `users/${userId}/trips/${tripId}`;
  try {
    const snap = await getDoc(getTripDocRef(userId, tripId));
    if (!snap.exists()) {
      return null;
    }
    return {
      id: snap.id,
      ...snap.data()
    } as Trip;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Create a new trip for a user.
 */
export async function createTrip(userId: string, input: TripInput): Promise<Trip> {
  const tripId = `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `users/${userId}/trips/${tripId}`;
  const now = new Date().toISOString();

  const rawTrip: Trip = {
    ...input,
    id: tripId,
    userId,
    photoCount: input.photos?.length || 0,
    placeCount: input.places?.length || 0,
    friendCount: input.participants?.length || 0,
    createdAt: now,
    updatedAt: now
  };

  const newTrip = sanitizeForFirestore(rawTrip);

  try {
    await setDoc(getTripDocRef(userId, tripId), newTrip);

    // Optionally increment user's tripsCount stat
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() || {};
        const nextCount = (userData.tripsCount || userData.stats?.tripsCount || 0) + 1;
        await updateDoc(userRef, {
          tripsCount: nextCount,
          'stats.tripsCount': nextCount
        });
      }
    } catch (e) {
      console.warn('Could not update user tripsCount stat:', e);
    }

    return newTrip;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update an existing trip.
 */
export async function updateTrip(
  userId: string,
  tripId: string,
  updates: Partial<TripInput>
): Promise<void> {
  const path = `users/${userId}/trips/${tripId}`;
  const now = new Date().toISOString();

  const docUpdates: Record<string, any> = {
    ...updates,
    updatedAt: now
  };

  if (updates.photos !== undefined) {
    docUpdates.photoCount = updates.photos.length;
  }
  if (updates.places !== undefined) {
    docUpdates.placeCount = updates.places.length;
  }
  if (updates.participants !== undefined) {
    docUpdates.friendCount = updates.participants.length;
  }

  const cleanUpdates = sanitizeForFirestore(docUpdates);

  try {
    await updateDoc(getTripDocRef(userId, tripId), cleanUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Permanently delete a trip and clean up associated Storage photos.
 */
export async function deleteTrip(
  userId: string,
  tripId: string,
  photoStoragePaths: string[] = []
): Promise<void> {
  const path = `users/${userId}/trips/${tripId}`;

  try {
    // 1. Delete document from Firestore
    await deleteDoc(getTripDocRef(userId, tripId));

    // 2. Decrement user's tripsCount stat
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() || {};
        const currentCount = userData.tripsCount || userData.stats?.tripsCount || 0;
        const nextCount = Math.max(0, currentCount - 1);
        await updateDoc(userRef, {
          tripsCount: nextCount,
          'stats.tripsCount': nextCount
        });
      }
    } catch (e) {
      console.warn('Could not decrement user tripsCount stat:', e);
    }

    // 3. Clean up photos in Storage
    if (photoStoragePaths.length > 0) {
      deleteTripPhotosBatch(photoStoragePaths).catch((err) => {
        console.warn('Background cleanup of trip storage files failed:', err);
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
