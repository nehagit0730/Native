import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Google Sign In (Popup with Redirect fallback for iframe & domain constraints)
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Google popup error:', error?.code, error?.message);
    if (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        throw new Error('Redirecting to Google Sign-In...');
      } catch (redirectErr) {
        throw redirectErr;
      }
    }
    throw error;
  }
};

// Email / Password Registration
export const registerWithEmail = async (email: string, pass: string, name?: string): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && credential.user) {
    await updateProfile(credential.user, { displayName: name });
  }
  return credential.user;
};

// Email / Password Login
export const loginWithEmail = async (email: string, pass: string): Promise<User> => {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return credential.user;
};

// Sign Out
export const logoutFirebase = async (): Promise<void> => {
  await signOut(auth);
};

// Listen to Auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
