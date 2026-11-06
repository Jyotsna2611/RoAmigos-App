import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  updateProfile,
  deleteUser,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getFriendlyAuthErrorMessage } from '../firebase/errors';
import { 
  createUserProfile, 
  getUserProfile, 
  checkUsernameAvailability, 
  generateAvailableUsername 
} from '../users/userService';
import { UserProfile } from '../../types';

export interface SignUpData {
  email: string;
  password: string;
  confirmPassword?: string;
  name: string;
  username: string;
  bio?: string;
  interests?: string[];
  photoURL?: string;
}

/**
 * Registers a new user with Email and Password, validates unique username,
 * and creates their Firestore UserProfile.
 */
export async function signUpWithEmail(data: SignUpData): Promise<UserProfile> {
  const cleanEmail = data.email.trim();
  const cleanUsername = data.username.trim().toLowerCase();

  // Validate username format: 3-30 chars, letters, numbers, underscores, dots
  const usernameRegex = /^[a-zA-Z0-9_.]{3,30}$/;
  if (!usernameRegex.test(cleanUsername)) {
    throw new Error('Username must be 3-30 characters long and can only contain letters, numbers, underscores, and dots.');
  }

  // Validate username uniqueness
  const isAvailable = await checkUsernameAvailability(cleanUsername);
  if (!isAvailable) {
    throw new Error(`The username @${cleanUsername} is already taken. Please choose another.`);
  }

  let createdFbUser: FirebaseUser | null = null;
  try {
    // 1. Create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
    createdFbUser = cred.user;

    // 2. Update Auth display name and photo
    await updateProfile(createdFbUser, {
      displayName: data.name.trim(),
      photoURL: data.photoURL || '',
    });

    // 3. Create Firestore User Profile and reserve unique username
    const profile = await createUserProfile({
      uid: createdFbUser.uid,
      name: data.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      photoURL: data.photoURL || '',
      bio: data.bio || '',
      interests: data.interests || [],
    });

    return profile;
  } catch (error: any) {
    // Atomic rollback: If a later Firestore operation fails, clean up the newly created Auth user
    if (createdFbUser) {
      try {
        await deleteUser(createdFbUser);
      } catch (cleanupErr) {
        console.warn('Could not cleanup auth user after registration error:', cleanupErr);
      }
    }

    if (error.message && error.message.includes('Username')) {
      throw error;
    }
    throw new Error(getFriendlyAuthErrorMessage(error));
  }
}

/**
 * Signs in an existing user with Email and Password and loads their Firestore profile.
 */
export async function signInWithEmail(email: string, password: string): Promise<{ fbUser: FirebaseUser; profile: UserProfile | null }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = cred.user;
    let profile = await getUserProfile(fbUser.uid);

    // If Firestore profile was somehow missing, auto-create it
    if (!profile) {
      const generatedUsername = await generateAvailableUsername(fbUser.email?.split('@')[0] || 'explorer');
      profile = await createUserProfile({
        uid: fbUser.uid,
        name: fbUser.displayName || 'Explorer',
        username: generatedUsername,
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || '',
      });
    }

    return { fbUser, profile };
  } catch (error: any) {
    throw new Error(getFriendlyAuthErrorMessage(error));
  }
}

/**
 * Signs in or signs up with Google OAuth via Popup.
 * If user logs in for the first time: generates a unique handle and creates Firestore profile.
 * Does not overwrite existing profile if one exists.
 */
export async function signInWithGoogle(): Promise<{ fbUser: FirebaseUser; profile: UserProfile }> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const fbUser = cred.user;

    // Check if user profile already exists in Firestore
    let profile = await getUserProfile(fbUser.uid);

    if (!profile) {
      // First time Google user: create new Firestore profile
      const seed = fbUser.displayName || fbUser.email?.split('@')[0] || 'explorer';
      const uniqueUsername = await generateAvailableUsername(seed);

      profile = await createUserProfile({
        uid: fbUser.uid,
        name: fbUser.displayName || 'RoAmigos Explorer',
        username: uniqueUsername,
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || '',
        bio: 'Explorer discovering places with RoAmigos.',
        interests: ['Hidden Gems', 'City Walks', 'Nature Escapes'],
      });
    }

    return { fbUser, profile };
  } catch (error: any) {
    throw new Error(getFriendlyAuthErrorMessage(error));
  }
}

/**
 * Sends a password reset email.
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    // Show confirmation message without revealing whether account exists to prevent email enumeration
    console.warn('Password reset error:', error);
  }
}

/**
 * Signs out the current user.
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(getFriendlyAuthErrorMessage(error));
  }
}

// Canonical exported aliases specified in guidelines
export const signUp = signUpWithEmail;
export const signIn = signInWithEmail;
export { signOutUser as signOut };

