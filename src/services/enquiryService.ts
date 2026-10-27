import { Enquiry, EnquiryStatus, EnquiryNote, FilterOptions } from '../types';
import { INITIAL_ENQUIRIES } from '../data/initialData';
import { trackFormSubmitSuccess } from '../lib/analytics';
import { authService } from './authService';
import { getFirebaseDb, getFirebaseRtdb, isFirebaseConfigured } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  ref, 
  set, 
  get, 
  update, 
  onValue, 
  off 
} from 'firebase/database';

const STORAGE_KEY = 'tps_enquiries_v1';

// Cross-tab real-time sync channel
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('tps_realtime_leads_sync');
  }
} catch {
  // Graceful fallback for older environments
}

export function normalizeEnquiry(raw: any, fallbackId?: string): Enquiry {
  const id = String(raw?.id || fallbackId || `enq-${Date.now()}`);
  const initial = INITIAL_ENQUIRIES.find(e => e.id === id);

  return {
    id,
    created_at: raw?.created_at || initial?.created_at || new Date().toISOString(),
    user_id: raw?.user_id || initial?.user_id || '',
    full_name: String(raw?.full_name || initial?.full_name || 'Enquiry Candidate').trim(),
    email: String(raw?.email || initial?.email || '').trim(),
    phone: String(raw?.phone || initial?.phone || '').trim(),
    service_type: (raw?.service_type || initial?.service_type || 'general') as Enquiry['service_type'],
    status: (raw?.status || initial?.status || 'new') as Enquiry['status'],
    source_page: raw?.source_page || initial?.source_page || '/',
    message: raw?.message || initial?.message || '',
    consent_given: Boolean(raw?.consent_given ?? initial?.consent_given ?? true),
    interested_program: raw?.interested_program || initial?.interested_program,
    education_level: raw?.education_level || initial?.education_level,
    learning_mode: raw?.learning_mode || initial?.learning_mode,
    city_district: raw?.city_district || initial?.city_district,
    current_status: raw?.current_status || initial?.current_status,
    area_of_interest: raw?.area_of_interest || initial?.area_of_interest,
    career_goal: raw?.career_goal || initial?.career_goal,
    preferred_contact_method: raw?.preferred_contact_method || initial?.preferred_contact_method,
    organization_name: raw?.organization_name || initial?.organization_name,
    assigned_to: raw?.assigned_to !== undefined ? raw.assigned_to : initial?.assigned_to,
    follow_up_date: raw?.follow_up_date !== undefined ? raw.follow_up_date : initial?.follow_up_date,
    notes: Array.isArray(raw?.notes) ? raw.notes : (initial?.notes || [])
  };
}

// Initialize local store if empty and repair any partial cached records
const getStoredEnquiries = (): Enquiry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENQUIRIES));
      return INITIAL_ENQUIRIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item, idx) => normalizeEnquiry(item, `ENQ-GEN-${idx}`));
    }
    return INITIAL_ENQUIRIES;
  } catch {
    return INITIAL_ENQUIRIES;
  }
};

const setStoredEnquiries = (enquiries: Enquiry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
    window.dispatchEvent(new CustomEvent('tps_enquiries_updated', { detail: enquiries }));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'enquiries_updated', timestamp: Date.now() });
    }
  } catch (err) {
    console.error('Failed to save enquiries to localStorage', err);
  }
};

export interface SubmitEnquiryInput {
  full_name: string;
  email: string;
  phone: string;
  service_type: Enquiry['service_type'];
  source_page?: string;
  message?: string;
  consent_given: boolean;
  honeypot?: string;

  // Specific fields
  interested_program?: string;
  education_level?: string;
  learning_mode?: Enquiry['learning_mode'];
  city_district?: string;
  current_status?: string;
  area_of_interest?: string;
  career_goal?: string;
  preferred_contact_method?: Enquiry['preferred_contact_method'];
  organization_name?: string;
  recruitment_requirement?: string;
  number_of_positions?: string;
}

export const enquiryService = {
  /**
   * Helper to filter an enquiry array with criteria
   */
  filterEnquiriesList(items: Enquiry[], filters?: FilterOptions): Enquiry[] {
    let filtered = items;
    if (filters?.service_type && filters.service_type !== 'all') {
      filtered = filtered.filter(e => e.service_type === filters.service_type);
    }
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(e => 
        e.full_name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.phone?.toLowerCase().includes(q) ||
        (e.organization_name && e.organization_name.toLowerCase().includes(q)) ||
        (e.city_district && e.city_district.toLowerCase().includes(q))
      );
    }
    return filtered;
  },

  /**
   * Submit an enquiry or registration.
   * REQUIRES an active logged-in user account.
   */
  async submitEnquiry(input: SubmitEnquiryInput): Promise<{ success: boolean; id: string; error?: string }> {
    // 1. Enforce account verification: User must be signed in or registered
    const session = authService.getSession();
    if (!session) {
      return { 
        success: false, 
        id: '', 
        error: 'Account required: Please create a free account or sign in first to submit your enquiry and track progress.' 
      };
    }

    // 2. Honeypot anti-spam check
    if (input.honeypot && input.honeypot.trim() !== '') {
      console.warn('Spam submission detected and dropped.');
      return { success: true, id: 'SPAM-FILTERED' };
    }

    // 3. Validate mandatory consent
    if (!input.consent_given) {
      return { success: false, id: '', error: 'Privacy policy consent is required.' };
    }

    const uniqueId = `TPS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    
    const newEnquiry: Enquiry = {
      id: uniqueId,
      created_at: new Date().toISOString(),
      user_id: session.id,
      full_name: (input.full_name || session.full_name).trim(),
      email: (input.email || session.email).trim().toLowerCase(),
      phone: (input.phone || session.phone || '').trim(),
      service_type: input.service_type,
      status: 'new',
      source_page: input.source_page || window.location.pathname,
      message: input.message?.trim(),
      consent_given: input.consent_given,
      interested_program: input.interested_program,
      education_level: input.education_level,
      learning_mode: input.learning_mode,
      city_district: input.city_district?.trim(),
      current_status: input.current_status,
      area_of_interest: input.area_of_interest,
      career_goal: input.career_goal,
      preferred_contact_method: input.preferred_contact_method,
      organization_name: input.organization_name?.trim(),
      recruitment_requirement: input.recruitment_requirement,
      number_of_positions: input.number_of_positions,
      notes: []
    };

    // 4. Save to persistent storage cache & broadcast IMMEDIATELY (0ms delay for UI)
    const current = getStoredEnquiries();
    setStoredEnquiries([newEnquiry, ...current]);
    trackFormSubmitSuccess(input.service_type, input.service_type);

    // 5. Asynchronously persist to Firebase Realtime Database & Firestore
    if (isFirebaseConfigured()) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          set(ref(rtdb, `enquiries/${uniqueId}`), newEnquiry)
            .catch(rtdbErr => console.warn('Firebase Realtime Database save note (cached locally):', rtdbErr));
        }
        const db = getFirebaseDb();
        if (db) {
          setDoc(doc(db, 'enquiries', uniqueId), newEnquiry)
            .catch(fbErr => console.warn('Firestore enquiry save error (cached locally):', fbErr));
        }
      } catch (fbErr: any) {
        console.warn('Firebase enquiry save error (falling back to cache):', fbErr);
      }
    }

    return { success: true, id: uniqueId };
  },

  /**
   * Subscribe to real-time enquiry updates for the Admin CRM.
   * Emits live updates whenever any lead is created, status changed, or note added.
   * Dual-channel: Listens locally (across all tabs), to Firebase Realtime Database, and to Firestore.
   */
  subscribeToEnquiries(filters: FilterOptions | undefined, callback: (enquiries: Enquiry[]) => void): () => void {
    // 1. Local update handler (always active, instant across tabs)
    const handleLocalUpdate = () => {
      const local = getStoredEnquiries();
      callback(this.filterEnquiriesList(local, filters));
    };

    // Immediate initial push from local storage
    handleLocalUpdate();

    window.addEventListener('tps_enquiries_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleLocalUpdate);
    }

    // 2. Listen to Firebase Realtime Database (Instant Cloud Stream)
    let rtdbCleanup: (() => void) | null = null;
    let firestoreUnsub: (() => void) | null = null;

    if (isFirebaseConfigured()) {
      const rtdb = getFirebaseRtdb();
      if (rtdb) {
        try {
          const enquiriesRef = ref(rtdb, 'enquiries');
          onValue(enquiriesRef, (snapshot) => {
            const val = snapshot.val();
            if (val && typeof val === 'object') {
              const localList = getStoredEnquiries();
              const map = new Map<string, Enquiry>();
              localList.forEach(e => map.set(e.id, normalizeEnquiry(e, e.id)));

              Object.entries(val).forEach(([k, rawVal]: [string, any]) => {
                if (!rawVal || typeof rawVal !== 'object') return;
                const docId = rawVal.id || k;
                const existing = map.get(k) || map.get(docId);
                const normalized = normalizeEnquiry({ ...existing, ...rawVal, id: docId }, docId);
                map.set(normalized.id, normalized);
              });

              const merged = Array.from(map.values()).sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              );
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              callback(this.filterEnquiriesList(merged, filters));
            }
          }, (err) => {
            console.warn('Realtime Database listener note (using resilient local stream):', err.message);
          });
          rtdbCleanup = () => off(enquiriesRef);
        } catch (e) {
          console.warn('Failed to attach Realtime Database listener:', e);
        }
      }

      // Also listen to Firestore in real-time if available
      const db = getFirebaseDb();
      if (db) {
        try {
          const colRef = collection(db, 'enquiries');
          firestoreUnsub = onSnapshot(colRef, (snapshot) => {
            const fbList: any[] = [];
            snapshot.forEach(docSnap => {
              fbList.push({ id: docSnap.id, ...docSnap.data() });
            });

            if (fbList.length > 0) {
              const localList = getStoredEnquiries();
              const map = new Map<string, Enquiry>();
              localList.forEach(e => map.set(e.id, normalizeEnquiry(e, e.id)));

              fbList.forEach(rawDoc => {
                const docId = rawDoc?.id;
                const existing = docId ? map.get(docId) : undefined;
                const normalized = normalizeEnquiry({ ...existing, ...rawDoc }, docId);
                map.set(normalized.id, normalized);
              });

              const merged = Array.from(map.values()).sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              );
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              callback(this.filterEnquiriesList(merged, filters));
            }
          }, (error) => {
            console.warn('Firestore onSnapshot subscription note:', error.message);
          });
        } catch (e) {
          console.warn('Failed to attach Firestore real-time listener:', e);
        }
      }
    }

    return () => {
      window.removeEventListener('tps_enquiries_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleLocalUpdate);
      }
      if (rtdbCleanup) {
        try { rtdbCleanup(); } catch {}
      }
      if (firestoreUnsub) {
        try { firestoreUnsub(); } catch {}
      }
    };
  },

  /**
   * Subscribe to real-time enquiries for a specific user (Student Portal)
   */
  subscribeToUserEnquiries(email?: string, userId?: string, callback?: (enquiries: Enquiry[]) => void): () => void {
    if (!callback) return () => {};

    const handleUserUpdate = () => {
      const all = getStoredEnquiries();
      const userItems = all.filter(e => 
        (userId && e.user_id === userId) || 
        (email && e.email?.toLowerCase() === email.toLowerCase())
      );
      callback(userItems);
    };

    // Immediate initial push
    handleUserUpdate();

    window.addEventListener('tps_enquiries_updated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleUserUpdate);
    }

    let rtdbCleanup: (() => void) | null = null;
    let firestoreUnsub: (() => void) | null = null;

    if (isFirebaseConfigured() && (userId || email)) {
      const rtdb = getFirebaseRtdb();
      if (rtdb) {
        try {
          const enquiriesRef = ref(rtdb, 'enquiries');
          onValue(enquiriesRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const list: Enquiry[] = Object.values(val);
              const userItems = list.filter(item => 
                (userId && item.user_id === userId) ||
                (email && item.email.toLowerCase() === email.toLowerCase())
              );
              userItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              callback(userItems);
            }
          }, (err) => {
            console.warn('RTDB user enquiries note:', err.message);
          });
          rtdbCleanup = () => off(enquiriesRef);
        } catch (e) {
          console.warn('Failed to attach RTDB user enquiries listener:', e);
        }
      }

      const db = getFirebaseDb();
      if (db) {
        try {
          const colRef = collection(db, 'enquiries');
          firestoreUnsub = onSnapshot(colRef, (snapshot) => {
            const list: Enquiry[] = [];
            snapshot.forEach(docSnap => {
              const item = docSnap.data() as Enquiry;
              if (
                (userId && item.user_id === userId) ||
                (email && item.email.toLowerCase() === email.toLowerCase())
              ) {
                list.push(item);
              }
            });
            if (list.length > 0) {
              list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              callback(list);
            }
          }, (err) => {
            console.warn('User enquiries Firestore listener note:', err.message);
          });
        } catch (e) {
          console.warn('Failed to attach user enquiries listener:', e);
        }
      }
    }

    return () => {
      window.removeEventListener('tps_enquiries_updated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleUserUpdate);
      }
      if (rtdbCleanup) {
        try { rtdbCleanup(); } catch {}
      }
      if (firestoreUnsub) {
        try { firestoreUnsub(); } catch {}
      }
    };
  },

  /**
   * Fetch enquiries with flexible filtering and sorting
   */
  async getEnquiries(filters?: FilterOptions): Promise<Enquiry[]> {
    let items = getStoredEnquiries();

    if (isFirebaseConfigured()) {
      // 1. Try Firebase Realtime Database
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          const snap = await Promise.race([
            get(ref(rtdb, 'enquiries')),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
          ]);
          if (snap && snap.exists()) {
            const val = snap.val();
            const rtdbItems: Enquiry[] = Object.values(val);
            const map = new Map<string, Enquiry>();
            items.forEach(e => map.set(e.id, e));
            rtdbItems.forEach(e => map.set(e.id, e));
            items = Array.from(map.values()).sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          }
        }
      } catch (e) {
        console.warn('Firebase Realtime Database fetch note:', e);
      }

      // 2. Try Firestore
      const db = getFirebaseDb();
      if (db) {
        try {
          const snap = await Promise.race([
            getDocs(collection(db, 'enquiries')),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
          ]);
          if (snap && !snap.empty) {
            const fbItems: Enquiry[] = [];
            snap.forEach(d => fbItems.push(d.data() as Enquiry));
            const map = new Map<string, Enquiry>();
            items.forEach(e => map.set(e.id, e));
            fbItems.forEach(e => map.set(e.id, e));
            items = Array.from(map.values()).sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
          }
        } catch (e) {
          console.warn('Firestore fetch enquiries note:', e);
        }
      }
    }

    return this.filterEnquiriesList(items, filters);
  },

  /**
   * Get enquiries submitted by a specific user (for student portal)
   */
  async getUserEnquiries(email?: string, userId?: string): Promise<Enquiry[]> {
    const all = await this.getEnquiries();
    if (!email && !userId) return [];
    
    return all.filter(e => 
      (userId && e.user_id === userId) || 
      (email && e.email?.toLowerCase() === email.toLowerCase())
    );
  },

  /**
   * Get single enquiry by ID
   */
  async getEnquiryById(id: string): Promise<Enquiry | null> {
    if (isFirebaseConfigured()) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          const snap = await Promise.race([
            get(ref(rtdb, `enquiries/${id}`)),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 1200))
          ]);
          if (snap && snap.exists()) {
            return snap.val() as Enquiry;
          }
        }
      } catch (e) {
        console.warn('RTDB get single enquiry note:', e);
      }

      const db = getFirebaseDb();
      if (db) {
        try {
          const docSnap = await getDoc(doc(db, 'enquiries', id));
          if (docSnap.exists()) {
            return docSnap.data() as Enquiry;
          }
        } catch (e) {
          console.warn('Firestore get single enquiry note:', e);
        }
      }
    }
    const list = await this.getEnquiries();
    return list.find(e => e.id === id) || null;
  },

  /**
   * Update lead status (syncs to Firebase and localStorage in real-time)
   */
  async updateStatus(id: string, status: EnquiryStatus, assignedTo?: string, followUpDate?: string): Promise<boolean> {
    const updatePayload: Partial<Enquiry> = {
      status
    };
    if (assignedTo !== undefined) updatePayload.assigned_to = assignedTo;
    if (followUpDate !== undefined) updatePayload.follow_up_date = followUpDate;

    // Update local store immediately with guaranteed complete fields
    const items = getStoredEnquiries();
    const index = items.findIndex(e => e.id === id);
    let fullUpdated: Enquiry;

    if (index !== -1) {
      fullUpdated = normalizeEnquiry({
        ...items[index],
        ...updatePayload
      }, id);
      items[index] = fullUpdated;
    } else {
      fullUpdated = normalizeEnquiry({
        id,
        ...updatePayload
      }, id);
      items.push(fullUpdated);
    }
    setStoredEnquiries(items);

    if (isFirebaseConfigured()) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          set(ref(rtdb, `enquiries/${id}`), fullUpdated)
            .catch(e => console.warn('RTDB updateStatus note:', e));
        }
        const db = getFirebaseDb();
        if (db) {
          setDoc(doc(db, 'enquiries', id), fullUpdated, { merge: true })
            .catch(e => console.warn('Firestore updateStatus note:', e));
        }
      } catch (e) {
        console.warn('updateStatus cloud sync note:', e);
      }
    }

    return true;
  },

  /**
   * Add internal note to an enquiry
   */
  async addNote(enquiryId: string, author: string, content: string): Promise<boolean> {
    const newNote: EnquiryNote = {
      id: `note-${Date.now()}`,
      enquiry_id: enquiryId,
      author,
      content: content.trim(),
      created_at: new Date().toISOString()
    };

    const items = getStoredEnquiries();
    const index = items.findIndex(e => e.id === enquiryId);
    let fullUpdated: Enquiry | null = null;

    if (index !== -1) {
      const existingNotes = items[index].notes || [];
      const updatedNotes = [...existingNotes, newNote];
      fullUpdated = normalizeEnquiry({
        ...items[index],
        notes: updatedNotes
      }, enquiryId);
      items[index] = fullUpdated;
      setStoredEnquiries(items);
    }

    if (isFirebaseConfigured() && fullUpdated) {
      try {
        const rtdb = getFirebaseRtdb();
        if (rtdb) {
          set(ref(rtdb, `enquiries/${enquiryId}`), fullUpdated)
            .catch(e => console.warn('RTDB addNote note:', e));
        }
        const db = getFirebaseDb();
        if (db) {
          setDoc(doc(db, 'enquiries', enquiryId), fullUpdated, { merge: true })
            .catch(e => console.warn('Firestore addNote note:', e));
        }
      } catch (e) {
        console.warn('addNote cloud sync note:', e);
      }
    }

    return true;
  },

  /**
   * Export lead records to CSV format
   */
  exportToCSV(enquiries: Enquiry[]): void {
    const headers = [
      'Reference ID',
      'Date',
      'Full Name',
      'Phone',
      'Email',
      'Service',
      'Status',
      'Program / Requirement',
      'City',
      'Organization',
      'Assigned To',
      'Follow Up Date',
      'Source Page'
    ];

    const rows = enquiries.map(e => [
      `"${e.id}"`,
      `"${new Date(e.created_at).toLocaleString()}"`,
      `"${e.full_name}"`,
      `"${e.phone}"`,
      `"${e.email}"`,
      `"${e.service_type}"`,
      `"${e.status}"`,
      `"${e.interested_program || e.recruitment_requirement || e.area_of_interest || ''}"`,
      `"${e.city_district || ''}"`,
      `"${e.organization_name || ''}"`,
      `"${e.assigned_to || ''}"`,
      `"${e.follow_up_date || ''}"`,
      `"${e.source_page || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TalentPath_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
