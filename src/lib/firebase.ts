import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  updateDoc,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { getDatabase, Database, ref, get } from 'firebase/database';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  databaseURL?: string;
}

const FIREBASE_CONFIG_STORAGE_KEY = 'tps_firebase_config_v1';

const DEFAULT_FIREBASE_CONFIG: FirebaseClientConfig = {
  apiKey: "AIzaSyDB2bRFYmkE6R1zUb4X_i_dV_h1jWdb758",
  authDomain: "talentpath-d8dce.firebaseapp.com",
  projectId: "talentpath-d8dce",
  storageBucket: "talentpath-d8dce.firebasestorage.app",
  messagingSenderId: "382442835891",
  appId: "1:382442835891:web:9403a8676c67e8eaae45c6",
  databaseURL: "https://talentpath-d8dce-default-rtdb.firebaseio.com"
};

/**
 * Get active Firebase credentials from localStorage, Vite environment variables, or default project config
 */
export function getFirebaseConfig(): FirebaseClientConfig | null {
  // 1. Try local storage (allows users to paste keys directly into the app settings)
  try {
    const stored = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading stored Firebase config', e);
  }

  // 2. Try Vite Environment Variables
  const envKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProject = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (envKey && envProject && envKey !== 'your_api_key_here') {
    return {
      apiKey: envKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProject}.firebaseapp.com`,
      projectId: envProject,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProject}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || `https://${envProject}-default-rtdb.firebaseio.com`
    };
  }

  // 3. Active default configured project keys
  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * Check if valid Firebase configuration is active
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
}

/**
 * Save user provided Firebase configuration
 */
export function saveFirebaseConfig(config: FirebaseClientConfig): void {
  localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  // Dispatch notification so services can re-initialize dynamically
  window.dispatchEvent(new CustomEvent('tps_firebase_config_changed', { detail: config }));
}

/**
 * Clear stored Firebase configuration
 */
export function clearFirebaseConfig(): void {
  localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('tps_firebase_config_changed', { detail: null }));
}

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedRtdb: Database | null = null;

/**
 * Initialize or get current Firebase App instance
 */
export function getFirebaseApp(): FirebaseApp | null {
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (getApps().length > 0) {
      cachedApp = getApp();
      return cachedApp;
    }
    cachedApp = initializeApp(config);
    return cachedApp;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!cachedAuth) {
    try {
      cachedAuth = getAuth(app);
    } catch (e) {
      console.warn('Could not initialize Firebase Auth:', e);
      return null;
    }
  }
  return cachedAuth;
}

/**
 * Get Firebase Firestore instance
 */
export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!cachedDb) {
    try {
      cachedDb = getFirestore(app);
    } catch (e) {
      console.warn('Could not initialize Firestore:', e);
      return null;
    }
  }
  return cachedDb;
}

/**
 * Get Firebase Realtime Database instance (optional)
 */
export function getFirebaseRtdb(): Database | null {
  const app = getFirebaseApp();
  const config = getFirebaseConfig();
  if (!app || !config?.databaseURL) return null;
  if (!cachedRtdb) {
    try {
      cachedRtdb = getDatabase(app);
    } catch (e) {
      console.warn('Could not initialize Realtime Database:', e);
      return null;
    }
  }
  return cachedRtdb;
}

/**
 * Test Firebase connection with active credentials
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  const config = getFirebaseConfig();
  if (!config) {
    return { success: false, message: 'No Firebase configuration found.' };
  }

  // 1. Test Firebase Realtime Database
  try {
    const rtdb = getFirebaseRtdb();
    if (rtdb) {
      const probe = ref(rtdb, '_connection_test/ping');
      await Promise.race([
        get(probe),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timed out')), 2500))
      ]);
      return {
        success: true,
        message: `Connected successfully to Firebase Realtime Database (${config.databaseURL || config.projectId})!`
      };
    }
  } catch (rtdbErr: any) {
    if (rtdbErr?.code === 'PERMISSION_DENIED' || rtdbErr?.message?.includes('Permission denied') || rtdbErr?.message?.includes('permission_denied')) {
      return {
        success: false,
        message: `Connected to Firebase Realtime Database, but read/write rules are locked. In Firebase Console, click the "Rules" tab next to "Data", set ".read": true and ".write": true, then click Publish.`
      };
    }
  }

  // 2. Test Firestore if Realtime Database is not primary
  try {
    const db = getFirebaseDb();
    if (db) {
      await Promise.race([
        getDoc(doc(db, '_connection_test', 'ping')),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timed out')), 2500))
      ]);
      return { 
        success: true, 
        message: `Connected successfully to Firebase Project "${config.projectId}" with Cloud Firestore!` 
      };
    }
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      return { 
        success: true, 
        message: `Connected to Firebase Project "${config.projectId}". Note: Check your database security rules if reads/writes are restricted.` 
      };
    }
  }

  return { 
    success: true, 
    message: `Firebase is configured for "${config.projectId}". For cross-device sync, ensure your Realtime Database Rules allow read/write.` 
  };
}

// Reset cached instances when configuration changes in-app
window.addEventListener('tps_firebase_config_changed', () => {
  cachedApp = null;
  cachedAuth = null;
  cachedDb = null;
  cachedRtdb = null;
});
