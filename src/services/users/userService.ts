import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { UserProfile } from '../../types';

const USERS_COLLECTION = 'users';
const USERNAMES_COLLECTION = 'usernames';

/**
 * Checks if a given username is available or already claimed by another user.
 * Supports checking before account creation (unauthenticated) as well as during profile updates.
 *
 * Rules:
 * - If `usernames/{username}` exists -> return false ("taken")
 * - If `usernames/{username}` does NOT exist -> return true ("available")
 * - Does not invert snap.exists()
 * - Normalizes usernames consistently (lowercase and trim whitespace)
 * - Missing document in Firestore read is NOT treated as an error.
 */
export async function checkUsernameAvailability(username: string, currentUid?: string): Promise<boolean> {
  // Normalize username consistently
  const cleanUsername = (username || '').trim().toLowerCase();
  
  // Valid usernames must be 3-30 characters matching alphanumeric, underscore, dot
  const usernameRegex = /^[a-zA-Z0-9_.]{3,30}$/;
  if (!cleanUsername || !usernameRegex.test(cleanUsername)) {
    return false;
  }

  try {
    const docRef = doc(db, USERNAMES_COLLECTION, cleanUsername);
    const snap = await getDoc(docRef);

    // If the username document does NOT exist in Firestore -> it is AVAILABLE!
    if (!snap.exists()) {
      return true;
    }

    // Document exists -> check if it belongs to the current user (e.g. during profile edit)
    const data = snap.data();
    if (currentUid && data?.uid === currentUid) {
      return true; // Available to this same user
    }

    // Document exists and belongs to someone else -> TAKEN
    return false;
  } catch (error: any) {
    console.warn('Notice while checking username registry:', error?.message || error);
    // If error code is 'not-found', document does not exist, so it is available
    if (error?.code === 'not-found') {
      return true;
    }
    // Re-throw so caller knows check failed due to error rather than falsely treating it as taken
    throw error;
  }
}

/**
 * Generates an available unique username based on an input seed.
 */
export async function generateAvailableUsername(seed: string): Promise<string> {
  const base = seed
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 18) || 'explorer';

  let candidate = base;
  let isAvailable = await checkUsernameAvailability(candidate);
  let counter = 1;

  while (!isAvailable && counter < 50) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    candidate = `${base.slice(0, 14)}_${randomSuffix}`;
    isAvailable = await checkUsernameAvailability(candidate);
    counter++;
  }

  return candidate;
}

/**
 * Fetches a user's Firestore profile document by UID.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${uid}`;
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data();
    return {
      id: uid,
      uid,
      name: data.name || 'Explorer',
      username: data.username || 'explorer',
      email: data.email || '',
      photoURL: data.photoURL || '',
      avatar: data.photoURL || '',
      bio: data.bio || '',
      location: data.location || 'Undisclosed Coordinates',
      joinedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Joined Recently',
      online: true,
      onlineStatus: data.onlineStatus || 'Active now',
      lastSeen: data.lastSeen || 'Active now',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      interests: Array.isArray(data.interests) ? data.interests : ['Exploration'],
      stats: {
        friendsCount: data.friendsCount ?? 0,
        groupsCount: data.groupsCount ?? 0,
        savedPlacesCount: data.savedPlacesCount ?? 0,
        tripsCount: data.tripsCount ?? 0,
      }
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Creates a brand new user profile and claims their unique username.
 */
export async function createUserProfile(
  profileData: {
    uid: string;
    name: string;
    username: string;
    email: string;
    photoURL?: string;
    bio?: string;
    interests?: string[];
    location?: string;
  }
): Promise<UserProfile> {
  const uid = profileData.uid;
  const path = `${USERS_COLLECTION}/${uid}`;
  const now = new Date().toISOString();
  const cleanUsername = profileData.username.trim().toLowerCase();

  const userDocData = {
    uid,
    name: profileData.name.trim(),
    username: cleanUsername,
    email: profileData.email.trim(),
    photoURL: profileData.photoURL || '',
    bio: profileData.bio || 'Curious wanderer discovering hidden spots and planning trips.',
    interests: profileData.interests || ['Hidden Gems', 'Secret Cafes', 'Night Views'],
    location: profileData.location || 'San Francisco, CA',
    onlineStatus: 'Active now',
    lastSeen: 'Active now',
    createdAt: now,
    updatedAt: now,
    friendsCount: 0,
    groupsCount: 0,
    savedPlacesCount: 0,
    tripsCount: 0,
  };

  try {
    // 1. Reserve unique username in registry first
    await setDoc(doc(db, USERNAMES_COLLECTION, cleanUsername), {
      uid,
      username: cleanUsername,
      createdAt: now,
    });

    // 2. Create User Document in Firestore
    try {
      await setDoc(doc(db, USERS_COLLECTION, uid), userDocData);
    } catch (userDocErr) {
      // Rollback username reservation if user profile creation fails
      try {
        await deleteDoc(doc(db, USERNAMES_COLLECTION, cleanUsername));
      } catch (cleanupErr) {
        console.warn('Rollback of username reservation failed:', cleanupErr);
      }
      throw userDocErr;
    }

    return {
      id: uid,
      avatar: userDocData.photoURL,
      joinedDate: 'Joined recently',
      online: true,
      stats: {
        friendsCount: 0,
        groupsCount: 0,
        savedPlacesCount: 0,
        tripsCount: 0,
      },
      ...userDocData
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Updates an existing user profile document and re-assigns the username registry if changed.
 */
export async function updateUserProfile(
  uid: string, 
  updates: Partial<UserProfile>,
  previousUsername?: string
): Promise<void> {
  const path = `${USERS_COLLECTION}/${uid}`;
  const now = new Date().toISOString();

  const docUpdates: Record<string, any> = {
    ...updates,
    updatedAt: now,
  };

  // If avatar changed, sync photoURL
  if (updates.avatar && !updates.photoURL) {
    docUpdates.photoURL = updates.avatar;
  }
  if (updates.photoURL && !updates.avatar) {
    docUpdates.avatar = updates.photoURL;
  }

  // Prevent modifying immutable fields
  delete docUpdates.uid;
  delete docUpdates.id;
  delete docUpdates.createdAt;

  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), docUpdates);

    // If username changed, update registry
    if (updates.username && previousUsername && updates.username.toLowerCase() !== previousUsername.toLowerCase()) {
      const newHandle = updates.username.toLowerCase();
      const oldHandle = previousUsername.toLowerCase();

      try {
        await setDoc(doc(db, USERNAMES_COLLECTION, newHandle), {
          uid,
          username: newHandle,
          createdAt: now,
        });
        await deleteDoc(doc(db, USERNAMES_COLLECTION, oldHandle));
      } catch (e) {
        console.warn('Failed to update username registry:', e);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Uploads a profile picture to Firebase Storage.
 * Provides resilient fallback to Data URL if Storage fails or is unavailable.
 */
export async function uploadProfilePicture(uid: string, file: File): Promise<string> {
  // Validate file size (< 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be less than 5MB.');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files (JPEG, PNG, WEBP, GIF) are supported.');
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `avatars/${uid}/${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, file, {
      contentType: file.type,
    });

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (storageError) {
    console.warn('Storage upload error, applying fallback Data URL reader:', storageError);
    // Convert to compressed Base64 Data URL so the user's avatar preview & save always works
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to parse uploaded image.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }
}
