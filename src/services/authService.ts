import { UserAccount, UserRole } from '../types';
import { 
  getFirebaseAuth, 
  getFirebaseDb, 
  getFirebaseRtdb,
  isFirebaseConfigured 
} from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { ref, set, get, update, onValue, off } from 'firebase/database';

const USERS_STORAGE_KEY = 'tps_users_db_v1';
const SESSION_STORAGE_KEY = 'tps_active_session_v1';
const DELETED_USERS_STORAGE_KEY = 'tps_deleted_users_v1';

export function getDeletedUserIdentifiers(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_USERS_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function markUserAsDeleted(idOrEmail: string) {
  try {
    const set = getDeletedUserIdentifiers();
    if (idOrEmail) set.add(idOrEmail.trim().toLowerCase());
    localStorage.setItem(DELETED_USERS_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.warn('markUserAsDeleted note:', err);
  }
}

// Seeded demo user accounts
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@talentpathsolutions.com',
    password: 'TalentPath2025!',
    full_name: 'Administrator',
    phone: '+91 98765 43210',
    role: 'admin',
    is_verified: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'usr-student-1',
    email: 'student@talentpathsolutions.com',
    password: 'Student2025!',
    full_name: 'Aarav Sharma',
    phone: '+91 98765 11223',
    role: 'user',
    is_verified: true,
    created_at: '2025-02-15T00:00:00Z',
  }
];

const getStoredUsers = (): UserAccount[] => {
  const deleted = getDeletedUserIdentifiers();
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const filteredInit = INITIAL_USERS.filter(u => !deleted.has(u.id.toLowerCase()) && !deleted.has(u.email.toLowerCase()));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredInit));
      return filteredInit;
    }
    const parsed: UserAccount[] = JSON.parse(raw);
    return parsed.filter(u => !deleted.has(u.id.toLowerCase()) && !deleted.has((u.email || '').toLowerCase()));
  } catch {
    return INITIAL_USERS.filter(u => !deleted.has(u.id.toLowerCase()) && !deleted.has(u.email.toLowerCase()));
  }
};

export function normalizeUser(raw: any, fallbackId?: string): UserAccount {
  const email = (raw?.email || '').trim().toLowerCase();
  const fullName = (raw?.full_name || raw?.name || raw?.displayName || (email ? email.split('@')[0] : 'User')).trim();
  const role: UserRole = (raw?.role === 'admin' || email === 'admin@talentpathsolutions.com' || email === 'sagaru.works@gmail.com') ? 'admin' : 'user';
  return {
    id: String(raw?.id || fallbackId || `usr-${Date.now()}`),
    email: email || 'user@talentpathsolutions.com',
    full_name: fullName || 'User',
    phone: String(raw?.phone || raw?.phoneNumber || '').trim(),
    role: role,
    is_verified: Boolean(raw?.is_verified ?? true),
    created_at: raw?.created_at || new Date().toISOString()
  };
}

export function mergeAndNormalizeUsers(...sources: any[][]): UserAccount[] {
  const map = new Map<string, UserAccount>();
  const deleted = getDeletedUserIdentifiers();

  // Seed default demo accounts first (unless explicitly deleted)
  for (const init of INITIAL_USERS) {
    if (deleted.has(init.id.toLowerCase()) || deleted.has(init.email.toLowerCase())) continue;
    const norm = normalizeUser(init, init.id);
    map.set(norm.email, { ...norm, password: init.password });
  }

  for (const source of sources) {
    if (!Array.isArray(source)) continue;
    for (const raw of source) {
      if (!raw) continue;
      const norm = normalizeUser(raw, raw.id);
      if (!norm.email) continue;
      if (deleted.has(norm.id.toLowerCase()) || deleted.has(norm.email.toLowerCase())) continue;

      const existing = map.get(norm.email);
      if (existing) {
        map.set(norm.email, {
          ...existing,
          ...norm,
          // Priority to latest modified password if provided
          password: raw.password || existing.password,
          // If either record designated as admin, preserve admin
          role: (existing.role === 'admin' || norm.role === 'admin') ? 'admin' : 'user',
          full_name: (norm.full_name && norm.full_name !== 'User') ? norm.full_name : existing.full_name,
          phone: norm.phone || existing.phone,
          created_at: existing.created_at || norm.created_at
        });
      } else {
        map.set(norm.email, { ...norm, password: raw.password });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    // Admins first, then newest joined accounts
    if (a.role === 'admin' && b.role !== 'admin') return -1;
    if (a.role !== 'admin' && b.role === 'admin') return 1;
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}

const setStoredUsers = (users: UserAccount[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent('tps_users_updated', { detail: users }));
  } catch (err) {
    console.error('Failed to save users database', err);
  }
};

function notifyAuthState(session: UserAccount | null) {
  window.dispatchEvent(new CustomEvent('tps_auth_state_changed', { detail: session }));
}

export function formatAuthError(error: any, context?: 'google' | 'email'): string {
  if (!error) return 'An error occurred during authentication.';
  const code = error.code || '';
  const msg = typeof error === 'string' ? error : (error.message || '');

  if (code === 'auth/configuration-not-found' || msg.includes('auth/configuration-not-found')) {
    if (context === 'google') {
      return 'Google Authentication provider is not yet configured in your Firebase Console. Please enable Google under Firebase Console > Authentication > Sign-in method.';
    }
    return 'Authentication provider is being initialized in Firebase. You can continue with Email/Password or Demo sign-in.';
  }
  if (code === 'auth/operation-not-allowed' || msg.includes('auth/operation-not-allowed')) {
    if (context === 'google') {
      return 'Google Sign-In is not enabled yet in your Firebase project. Please enable Google under Firebase Console > Authentication > Sign-in method.';
    }
    return 'This sign-in method is not enabled yet in your Firebase Console. Please enable it under Firebase Console > Authentication > Sign-in method.';
  }
  if (code === 'auth/unauthorized-domain' || msg.includes('auth/unauthorized-domain')) {
    return 'This domain is not authorized for Google Sign-In in Firebase. In Firebase Console, go to Authentication > Settings > Authorized domains and ensure your domain (localhost) is added.';
  }
  if (code === 'auth/popup-blocked' || msg.includes('auth/popup-blocked')) {
    return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site or use the Google Fast Sign-In option.';
  }
  if (code === 'auth/popup-closed-by-user' || msg.includes('auth/popup-closed-by-user')) {
    return 'Google sign-in was cancelled because the popup window was closed before completing.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'A sign-in request is already in progress. Please complete the open popup window.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
    return 'Invalid email or password. Please verify your credentials or create a free account.';
  }
  if (code === 'auth/email-already-in-use' || msg.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please Sign In.';
  }
  if (code === 'auth/weak-password' || msg.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  return msg;
}

export const authService = {
  /**
   * Get active logged-in user session
   */
  getSession(): UserAccount | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return null;
  },

  /**
   * Listen to active session changes across the app
   */
  onSessionChange(callback: (user: UserAccount | null) => void): () => void {
    const handler = (e: any) => {
      callback(e.detail);
    };
    window.addEventListener('tps_auth_state_changed', handler);
    return () => window.removeEventListener('tps_auth_state_changed', handler);
  },

  /**
   * User Sign In (supports Firebase Auth when configured, with seamless fallback)
   */
  async signIn(email: string, password: string): Promise<{ user: UserAccount | null; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // Guard: Prevent deleted user from logging in
    const deleted = getDeletedUserIdentifiers();
    if (deleted.has(cleanEmail)) {
      return { user: null, error: 'This account has been deleted or deactivated. Please contact an administrator.' };
    }

    // 1. If Firebase is configured, authenticate with Firebase Auth
    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth();
        const db = getFirebaseDb();

        if (auth) {
          const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          const fbUser = userCred.user;

          let role: UserRole = (cleanEmail === 'admin@talentpathsolutions.com' || cleanEmail === 'sagaru.works@gmail.com') ? 'admin' : 'user';
          let fullName = fbUser.displayName || 'Portal User';
          let phone = fbUser.phoneNumber || '';

          // Instant local check first (0ms)
          const stored = getStoredUsers();
          const localMatch = stored.find(u => u.email.toLowerCase() === cleanEmail || u.id === fbUser.uid);
          if (localMatch) {
            role = localMatch.role;
            fullName = localMatch.full_name || fullName;
            phone = localMatch.phone || phone;
          }

          if (db && !localMatch) {
            try {
              const userDocRef = doc(db, 'users', fbUser.uid);
              const userSnap = await Promise.race([
                getDoc(userDocRef),
                new Promise<null>((resolve) => setTimeout(() => resolve(null), 500))
              ]);
              if (userSnap && userSnap.exists()) {
                const data = userSnap.data();
                role = (data.role as UserRole) || 'user';
                fullName = data.full_name || fullName;
                phone = data.phone || phone;
              } else {
                if (cleanEmail === 'admin@talentpathsolutions.com' || cleanEmail === 'sagaru.works@gmail.com') {
                  role = 'admin';
                }
                setDoc(userDocRef, {
                  id: fbUser.uid,
                  email: cleanEmail,
                  full_name: fullName,
                  phone,
                  role,
                  created_at: new Date().toISOString()
                }).catch(fsErr => console.warn('Firestore user save note:', fsErr));
              }
            } catch (fsErr) {
              console.warn('Firestore user fetch note:', fsErr);
            }
          }

          const userAccount: UserAccount = {
            id: fbUser.uid,
            email: cleanEmail,
            full_name: fullName,
            phone,
            role,
            is_verified: fbUser.emailVerified || true,
            created_at: fbUser.metadata.creationTime || new Date().toISOString()
          };

          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userAccount));
          notifyAuthState(userAccount);
          return { user: userAccount };
        }
      } catch (fbErr: any) {
        console.warn('Firebase Sign In note:', fbErr.code, fbErr.message);
        // Fallback: check if user matches stored accounts (e.g. password was reset by administrator)
        const storedUsers = getStoredUsers();
        const localMatch = storedUsers.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
        if (!localMatch) {
          if (fbErr.code !== 'auth/configuration-not-found' && fbErr.code !== 'auth/operation-not-allowed') {
            if (cleanEmail !== 'admin@talentpathsolutions.com' && cleanEmail !== 'student@talentpathsolutions.com') {
              return { user: null, error: formatAuthError(fbErr) };
            }
          }
        }
      }
    }

    // 2. Local & Stored Account verification (fallback for instant offline/demo or unconfigured providers)
    const users = getStoredUsers();
    const matched = users.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (matched) {
      const sanitized: UserAccount = {
        id: matched.id,
        email: matched.email,
        full_name: matched.full_name,
        phone: matched.phone,
        role: matched.role,
        created_at: matched.created_at,
        is_verified: true
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sanitized));
      notifyAuthState(sanitized);
      return { user: sanitized };
    }

    return { user: null, error: 'Invalid email or password. Please verify your credentials or create an account.' };
  },

  /**
   * User Sign Up / Registration (Stores in Firebase Auth & Firestore with resilient fallback)
   */
  async signUp(
    fullName: string, 
    email: string, 
    password: string, 
    phone: string = '', 
    requestedRole: UserRole = 'user'
  ): Promise<{ user: UserAccount | null; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    // 1. If Firebase is active, try creating in Firebase Auth and Firestore
    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth();
        const db = getFirebaseDb();

        if (auth) {
          const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          const fbUser = userCred.user;

          try {
            await updateProfile(fbUser, { displayName: cleanName });
          } catch {}

          const roleToAssign: UserRole = (cleanEmail === 'admin@talentpathsolutions.com' || cleanEmail === 'sagaru.works@gmail.com' || requestedRole === 'admin') 
            ? 'admin' 
            : 'user';

          const newAccount: UserAccount = {
            id: fbUser.uid,
            email: cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            role: roleToAssign,
            is_verified: true,
            created_at: new Date().toISOString()
          };

          if (isFirebaseConfigured()) {
            try {
              const rtdb = getFirebaseRtdb();
              if (rtdb) {
                set(ref(rtdb, `users/${fbUser.uid}`), newAccount)
                  .catch(rtdbErr => console.warn('RTDB user save note:', rtdbErr));
              }
              if (db) {
                setDoc(doc(db, 'users', fbUser.uid), newAccount)
                  .catch(fsErr => console.warn('Firestore user save note:', fsErr));
              }
            } catch {}
          }

          const existingLocal = getStoredUsers();
          if (!existingLocal.some(u => u.email.toLowerCase() === cleanEmail)) {
            setStoredUsers([...existingLocal, newAccount]);
          }

          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newAccount));
          notifyAuthState(newAccount);
          return { user: newAccount };
        }
      } catch (fbErr: any) {
        console.warn('Firebase Auth note:', fbErr.code, fbErr.message);
        if (fbErr.code === 'auth/email-already-in-use') {
          return { user: null, error: 'An account with this email address already exists. Please Sign In.' };
        } else if (fbErr.code === 'auth/weak-password') {
          return { user: null, error: 'Password is too weak. Please use at least 6 characters.' };
        }
        // Fall through to resilient zero-downtime Firestore and local registration
      }
    }

    // 2. Direct Account Creation (Guarantees uninterrupted user registration even if Firebase Auth provider is pending)
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { user: null, error: 'An account with this email address already exists. Please Sign In.' };
    }

    const roleToAssign: UserRole = (cleanEmail === 'admin@talentpathsolutions.com' || cleanEmail === 'sagaru.works@gmail.com' || requestedRole === 'admin') 
      ? 'admin' 
      : 'user';

    const userId = `usr-${Date.now()}`;
    const newUser: UserAccount = {
      id: userId,
      email: cleanEmail,
      password,
      full_name: cleanName,
      phone: cleanPhone,
      role: roleToAssign,
      is_verified: true,
      created_at: new Date().toISOString()
    };

    // Save to Realtime Database & Firestore in background without blocking
    if (isFirebaseConfigured()) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          set(ref(rtdb, `users/${userId}`), {
            id: userId,
            email: cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            role: roleToAssign,
            created_at: newUser.created_at
          }).catch(rtdbErr => console.warn('RTDB user save note:', rtdbErr));
        }
        const db = getFirebaseDb();
        if (db) {
          setDoc(doc(db, 'users', userId), {
            id: userId,
            email: cleanEmail,
            full_name: cleanName,
            phone: cleanPhone,
            role: roleToAssign,
            created_at: newUser.created_at
          }).catch(fsErr => console.warn('Firestore user save note:', fsErr));
        }
      } catch (fsErr) {
        console.warn('Firebase user save note:', fsErr);
      }
    }

    setStoredUsers([...users, newUser]);

    const sanitized: UserAccount = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      phone: newUser.phone,
      role: newUser.role,
      created_at: newUser.created_at,
      is_verified: true
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sanitized));
    notifyAuthState(sanitized);

    return { user: sanitized };
  },

  /**
   * Google Sign In / Sign Up (via Firebase Auth with resilient cloud sync)
   */
  async signInWithGoogle(requestedRole: UserRole = 'user'): Promise<{ 
    user: UserAccount | null; 
    error?: string; 
    code?: string 
  }> {
    if (!isFirebaseConfigured()) {
      return { 
        user: null, 
        error: 'Firebase is not yet configured. Please enter your Firebase keys in settings to enable Google Sign-In.' 
      };
    }

    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Firebase Auth not available');

      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const cleanEmail = (fbUser.email || '').trim().toLowerCase();

      // Instant local cache check (0ms)
      const existing = getStoredUsers();
      const existingLocal = existing.find(u => u.email.toLowerCase() === cleanEmail || u.id === fbUser.uid);

      let role: UserRole = existingLocal?.role || (
        (cleanEmail === 'admin@talentpathsolutions.com' || cleanEmail === 'sagaru.works@gmail.com' || requestedRole === 'admin') 
          ? 'admin' 
          : 'user'
      );
      let fullName = (fbUser.displayName || existingLocal?.full_name || (cleanEmail ? cleanEmail.split('@')[0] : 'Google User')).trim();
      let phone = (fbUser.phoneNumber || existingLocal?.phone || '').trim();

      const userAccount: UserAccount = {
        id: fbUser.uid,
        email: cleanEmail,
        full_name: fullName,
        phone,
        role,
        is_verified: true,
        created_at: fbUser.metadata.creationTime || new Date().toISOString()
      };

      // 1. Immediately save to Local Storage (0ms)
      const matchIdx = existing.findIndex(u => u.email.toLowerCase() === cleanEmail || u.id === fbUser.uid);
      if (matchIdx !== -1) {
        existing[matchIdx] = { ...existing[matchIdx], ...userAccount };
        setStoredUsers(existing);
      } else {
        setStoredUsers([...existing, userAccount]);
      }

      // 2. Immediately activate session & notify state (0ms - zero delay)
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userAccount));
      notifyAuthState(userAccount);

      // 3. Asynchronous non-blocking cloud sync (RTDB & Firestore in background)
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          set(ref(rtdb, `users/${fbUser.uid}`), userAccount)
            .catch(err => console.warn('RTDB save Google user note:', err));
        }

        const db = getFirebaseDb();
        if (db) {
          setDoc(doc(db, 'users', fbUser.uid), userAccount)
            .catch(err => console.warn('Firestore save Google user note:', err));
        }
      } catch (cloudErr) {
        console.warn('Cloud sync error:', cloudErr);
      }

      return { user: userAccount };
    } catch (err: any) {
      console.warn('Google Sign-In Error:', err?.code, err?.message);
      const code = err?.code || '';
      return { 
        user: null, 
        error: formatAuthError(err, 'google'),
        code
      };
    }
  },

  /**
   * Direct Google Account Sign In & Registration
   * Guarantees instant login with Google profile even if OAuth popup is blocked or provider is pending in Firebase Console
   */
  async signInWithGoogleAccount(
    googleEmail: string, 
    fullName?: string, 
    requestedRole: UserRole = 'user'
  ): Promise<{ user: UserAccount | null; error?: string }> {
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { user: null, error: 'Please enter a valid Google email address.' };
    }

    const cleanName = (fullName || cleanEmail.split('@')[0]).trim();
    const roleToAssign: UserRole = (cleanEmail === 'admin@talentpathsolutions.com' || cleanEmail === 'sagaru.works@gmail.com' || requestedRole === 'admin')
      ? 'admin'
      : 'user';

    const existingUsers = getStoredUsers();
    const existing = existingUsers.find(u => u.email.toLowerCase() === cleanEmail);
    const userId = existing?.id || `usr-google-${Date.now()}`;

    const userAccount: UserAccount = {
      id: userId,
      email: cleanEmail,
      full_name: existing?.full_name || cleanName,
      phone: existing?.phone || '',
      role: existing?.role || roleToAssign,
      is_verified: true,
      created_at: existing?.created_at || new Date().toISOString()
    };

    // Save to Firebase Realtime Database
    if (isFirebaseConfigured()) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          set(ref(rtdb, `users/${userId}`), userAccount).catch(e => console.warn('RTDB save Google user note:', e));
        }
        const db = getFirebaseDb();
        if (db) {
          setDoc(doc(db, 'users', userId), userAccount).catch(e => console.warn('Firestore save Google user note:', e));
        }
      } catch (e) {
        console.warn('Cloud sync note:', e);
      }
    }

    // Save to local store
    if (existing) {
      const idx = existingUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
      existingUsers[idx] = { ...existingUsers[idx], ...userAccount };
      setStoredUsers(existingUsers);
    } else {
      setStoredUsers([...existingUsers, userAccount]);
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userAccount));
    notifyAuthState(userAccount);

    return { user: userAccount };
  },

  /**
   * Sign Out
   */
  async signOut(): Promise<void> {
    if (isFirebaseConfigured()) {
      try {
        const auth = getFirebaseAuth();
        if (auth) await fbSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout note:', e);
      }
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
    notifyAuthState(null);
  },

  /**
   * Check if current session has admin privileges
   */
  isAdmin(): boolean {
    const session = this.getSession();
    return session?.role === 'admin';
  },

  /**
   * List all users safely merged and normalized from local and cloud sources
   */
  async getAllUsers(): Promise<UserAccount[]> {
    const localUsers = getStoredUsers();
    let rtdbUsers: any[] = [];
    let firestoreUsers: any[] = [];

    if (isFirebaseConfigured()) {
      // 1. Try Firebase Realtime Database
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          const snap = await Promise.race([
            get(ref(rtdb, 'users')),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
          ]);
          if (snap && snap.exists()) {
            const val = snap.val();
            if (val && typeof val === 'object') {
              rtdbUsers = Object.entries(val).map(([k, v]: [string, any]) => ({ id: k, ...v }));
            }
          }
        }
      } catch (e) {
        console.warn('RTDB fetch users note:', e);
      }

      // 2. Try Firestore
      const db = getFirebaseDb();
      if (db) {
        try {
          const usersCol = collection(db, 'users');
          const snap = await Promise.race([
            getDocs(usersCol),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500))
          ]);
          if (snap && !snap.empty) {
            snap.forEach(d => {
              firestoreUsers.push({ id: d.id, ...d.data() });
            });
          }
        } catch (e) {
          console.warn('Firestore fetch users note:', e);
        }
      }
    }

    const merged = mergeAndNormalizeUsers(localUsers, rtdbUsers, firestoreUsers);
    setStoredUsers(merged);
    return merged.map(({ password, ...rest }) => rest as UserAccount);
  },

  /**
   * Subscribe to real-time users list updates (local + RTDB)
   */
  subscribeToUsers(callback: (users: UserAccount[]) => void): () => void {
    let isSubscribed = true;

    // Immediately push current local data to eliminate wait/glitch
    const initialList = mergeAndNormalizeUsers(getStoredUsers()).map(({ password, ...rest }) => rest as UserAccount);
    callback(initialList);

    // Fetch fresh merged list in background and update
    this.getAllUsers().then((fresh) => {
      if (isSubscribed) callback(fresh);
    }).catch(() => {});

    // Listen to local update events (e.g. role changed, new registration in this tab)
    const localHandler = (e: any) => {
      if (!isSubscribed) return;
      if (Array.isArray(e.detail)) {
        callback(mergeAndNormalizeUsers(e.detail).map(({ password, ...rest }) => rest as UserAccount));
      } else {
        callback(mergeAndNormalizeUsers(getStoredUsers()).map(({ password, ...rest }) => rest as UserAccount));
      }
    };
    window.addEventListener('tps_users_updated', localHandler);

    // Listen to Realtime Database live updates if available
    let unsubscribeRtdb: (() => void) | null = null;
    try {
      const rtdb = getFirebaseRtdb();
      if (rtdb) {
        const usersRef = ref(rtdb, 'users');
        const unsub = onValue(
          usersRef,
          (snapshot) => {
            if (!isSubscribed) return;
            try {
              const rtdbList: any[] = [];
              if (snapshot.exists()) {
                const val = snapshot.val();
                if (val && typeof val === 'object') {
                  Object.entries(val).forEach(([k, v]: [string, any]) => {
                    rtdbList.push({ id: k, ...v });
                  });
                }
              }
              const merged = mergeAndNormalizeUsers(getStoredUsers(), rtdbList);
              setStoredUsers(merged);
              callback(merged.map(({ password, ...rest }) => rest as UserAccount));
            } catch (err) {
              console.warn('RTDB users listener note:', err);
            }
          },
          (err) => {
            console.warn('RTDB users subscription note:', err);
          }
        );
        unsubscribeRtdb = () => {
          try { unsub(); } catch {}
        };
      }
    } catch (e) {
      console.warn('RTDB setup note:', e);
    }

    return () => {
      isSubscribed = false;
      window.removeEventListener('tps_users_updated', localHandler);
      if (unsubscribeRtdb) unsubscribeRtdb();
    };
  },

  /**
   * Grant or revoke admin access for a user
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === userId);
    let targetEmail = '';
    if (idx !== -1) {
      users[idx].role = newRole;
      targetEmail = users[idx].email;
      setStoredUsers(users);
    }

    if (isFirebaseConfigured()) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          update(ref(rtdb, `users/${userId}`), { role: newRole }).catch(e => console.warn('RTDB update role note:', e));
        }
        const db = getFirebaseDb();
        if (db) {
          const userDocRef = doc(db, 'users', userId);
          updateDoc(userDocRef, { role: newRole }).catch(e => console.warn('Firestore update role note:', e));
        }
      } catch (e) {
        console.warn('updateUserRole note:', e);
      }
    }

    // Update active session if currently logged in user matches
    const activeSession = this.getSession();
    if (activeSession && (activeSession.id === userId || (targetEmail && activeSession.email.toLowerCase() === targetEmail.toLowerCase()))) {
      activeSession.role = newRole;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeSession));
      notifyAuthState(activeSession);
    }

    return true;
  },

  /**
   * Reset password for any user or admin account
   */
  async resetUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const cleanPassword = newPassword.trim();
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === userId);
    let targetEmail = '';

    if (idx !== -1) {
      users[idx].password = cleanPassword;
      targetEmail = users[idx].email;
      setStoredUsers(users);
    } else {
      const initMatch = INITIAL_USERS.find(u => u.id === userId);
      if (initMatch) {
        targetEmail = initMatch.email;
        const norm = { ...initMatch, password: cleanPassword };
        users.push(norm);
        setStoredUsers(users);
      }
    }

    // Synchronize password update with Firebase Realtime Database & Firestore
    if (isFirebaseConfigured()) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          update(ref(rtdb, `users/${userId}`), { password: cleanPassword }).catch(e => console.warn('RTDB reset pass note:', e));
        }
        const db = getFirebaseDb();
        if (db) {
          const userDocRef = doc(db, 'users', userId);
          updateDoc(userDocRef, { password: cleanPassword }).catch(e => console.warn('Firestore reset pass note:', e));
        }
        if (targetEmail) {
          const auth = getFirebaseAuth();
          if (auth) {
            sendPasswordResetEmail(auth, targetEmail).catch(() => {});
          }
        }
      } catch (e) {
        console.warn('resetUserPassword cloud note:', e);
      }
    }

    // If current session is this user, update active session password
    const activeSession = this.getSession();
    if (activeSession && (activeSession.id === userId || (targetEmail && activeSession.email.toLowerCase() === targetEmail.toLowerCase()))) {
      const updatedSession = { ...activeSession, password: cleanPassword };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
    }

    window.dispatchEvent(new CustomEvent('tps_users_updated', { detail: users }));
    return { success: true };
  },

  /**
   * Permanently delete a user or admin account
   */
  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    const currentSession = this.getSession();
    const users = getStoredUsers();
    const target = users.find(u => u.id === userId) || INITIAL_USERS.find(u => u.id === userId);

    if (currentSession && (currentSession.id === userId || (target && currentSession.email.toLowerCase() === target.email.toLowerCase()))) {
      return { success: false, error: 'Security Guard: You cannot delete your own active admin session.' };
    }

    // Mark as deleted in storage blacklist to prevent resurrection
    markUserAsDeleted(userId);
    if (target?.email) {
      markUserAsDeleted(target.email);
    }

    // Remove from local stored list
    const remaining = users.filter(u => u.id !== userId && (!target?.email || u.email.toLowerCase() !== target.email.toLowerCase()));
    setStoredUsers(remaining);

    // Remove from Firebase Realtime Database and Firestore
    if (isFirebaseConfigured()) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          set(ref(rtdb, `users/${userId}`), null).catch(e => console.warn('RTDB delete user note:', e));
        }
        const db = getFirebaseDb();
        if (db) {
          const userDocRef = doc(db, 'users', userId);
          deleteDoc(userDocRef).catch(e => console.warn('Firestore delete user note:', e));
        }
      } catch (e) {
        console.warn('deleteUser cloud note:', e);
      }
    }

    // Dispatch update event
    window.dispatchEvent(new CustomEvent('tps_users_updated', { detail: remaining }));
    return { success: true };
  }
};
