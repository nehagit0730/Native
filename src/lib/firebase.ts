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
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Property } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'connection_check'));
    console.log('[Firestore] Database connection successful.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Client is offline or network restricted.');
    } else {
      console.log('[Firestore] Database connection initialized.');
    }
  }
}
testFirestoreConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Firestore Property Persistence Helpers
export async function savePropertyToFirestore(property: Property): Promise<boolean> {
  const path = `properties/${property.id}`;
  try {
    await setDoc(doc(db, 'properties', property.id), property, { merge: true });
    console.log(`[Firestore] Property ${property.id} saved successfully.`);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    return false;
  }
}

export async function fetchPropertiesFromFirestore(): Promise<Property[]> {
  const path = 'properties';
  try {
    const snapshot = await getDocs(collection(db, 'properties'));
    const props: Property[] = [];
    snapshot.forEach(docSnap => {
      props.push(docSnap.data() as Property);
    });
    console.log(`[Firestore] Fetched ${props.length} properties from Firestore.`);
    return props;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function deletePropertyFromFirestore(id: string): Promise<boolean> {
  const path = `properties/${id}`;
  try {
    await deleteDoc(doc(db, 'properties', id));
    console.log(`[Firestore] Property ${id} deleted.`);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    return false;
  }
}

export async function updatePropertyInFirestore(id: string, updates: Partial<Property>): Promise<boolean> {
  const path = `properties/${id}`;
  try {
    await updateDoc(doc(db, 'properties', id), updates as any);
    console.log(`[Firestore] Property ${id} updated.`);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    return false;
  }
}

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
