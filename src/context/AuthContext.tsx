import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, testFirestoreConnection } from '../services/firebase/config';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signOutUser, 
  resetPassword, 
  SignUpData 
} from '../services/auth/authService';
import { 
  getUserProfile, 
  createUserProfile, 
  updateUserProfile, 
  generateAvailableUsername 
} from '../services/users/userService';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (data: SignUpData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  // Sync profile from Firestore
  const fetchAndSetProfile = async (fbUser: FirebaseUser) => {
    try {
      const profile = await getUserProfile(fbUser.uid);
      if (profile) {
        setUser(profile);
      }
    } catch (err: any) {
      console.warn('Notice loading user profile from Firestore:', err?.message || err);
    }
  };

  useEffect(() => {
    // Test connection on boot as mandated
    testFirestoreConnection().catch((err) => {
      console.warn('Firestore connection check notice:', err);
    });

    // Listen to Firebase Auth state transitions
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        await fetchAndSetProfile(fbUser);
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmailHandler = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const { profile } = await signInWithEmail(email, password);
      if (profile) setUser(profile);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
      throw err;
    }
  };

  const registerWithEmailHandler = async (data: SignUpData) => {
    setAuthError(null);
    try {
      const profile = await signUpWithEmail(data);
      setUser(profile);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const loginWithGoogleHandler = async () => {
    setAuthError(null);
    try {
      const { profile } = await signInWithGoogle();
      if (profile) setUser(profile);
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed.');
      throw err;
    }
  };

  const logoutHandler = async () => {
    setAuthError(null);
    try {
      await signOutUser();
      setUser(null);
      setFirebaseUser(null);
    } catch (err: any) {
      setAuthError(err.message || 'Logout failed.');
      throw err;
    }
  };

  const sendPasswordResetHandler = async (email: string) => {
    setAuthError(null);
    try {
      await resetPassword(email);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send password reset email.');
      throw err;
    }
  };

  const updateProfileDataHandler = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No authenticated user found.');
    try {
      const previousUsername = user.username;
      await updateUserProfile(user.uid, updates, previousUsername);
      setUser((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (err: any) {
      throw err;
    }
  };

  const refreshProfileHandler = async () => {
    if (firebaseUser) {
      await fetchAndSetProfile(firebaseUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        authError,
        clearAuthError,
        loginWithEmail: loginWithEmailHandler,
        registerWithEmail: registerWithEmailHandler,
        loginWithGoogle: loginWithGoogleHandler,
        logout: logoutHandler,
        sendPasswordReset: sendPasswordResetHandler,
        updateProfileData: updateProfileDataHandler,
        refreshProfile: refreshProfileHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
