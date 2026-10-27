import { Program } from '../types';
import { INITIAL_PROGRAMS } from '../data/initialData';

const STORAGE_KEY = 'tps_programs_v1';

const getStoredPrograms = (): Program[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROGRAMS));
      return INITIAL_PROGRAMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROGRAMS;
  }
};

const setStoredPrograms = (programs: Program[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  } catch (err) {
    console.error('Failed to save programs to localStorage', err);
  }
};

export const programService = {
  async getPrograms(category?: string): Promise<Program[]> {
    let items = getStoredPrograms();
    if (category && category !== 'all') {
      items = items.filter(p => p.category === category);
    }
    return items;
  },

  async getPublishedPrograms(category?: string): Promise<Program[]> {
    const all = await this.getPrograms(category);
    return all.filter(p => p.is_published);
  },

  async getProgramBySlug(slug: string): Promise<Program | null> {
    const all = await this.getPrograms();
    return all.find(p => p.slug === slug) || null;
  },

  async saveProgram(program: Omit<Program, 'id' | 'created_at'> & { id?: string }): Promise<Program> {
    const isNew = !program.id;
    const programId = program.id || `prog-${Date.now()}`;
    const fullProgram: Program = {
      ...program,
      id: programId,
      created_at: isNew ? new Date().toISOString() : (program as any).created_at || new Date().toISOString(),
    };

    const current = getStoredPrograms();
    if (isNew) {
      setStoredPrograms([fullProgram, ...current]);
    } else {
      const idx = current.findIndex(p => p.id === programId);
      if (idx !== -1) {
        current[idx] = fullProgram;
        setStoredPrograms(current);
      }
    }

    return fullProgram;
  },

  async togglePublish(id: string): Promise<boolean> {
    const current = getStoredPrograms();
    const idx = current.findIndex(p => p.id === id);
    if (idx === -1) return false;

    current[idx].is_published = !current[idx].is_published;
    setStoredPrograms(current);
    return true;
  },

  async deleteProgram(id: string): Promise<boolean> {
    const current = getStoredPrograms();
    const filtered = current.filter(p => p.id !== id);
    setStoredPrograms(filtered);
    return true;
  }
};
