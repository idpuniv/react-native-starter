// 💡 En v4, on importe createMMKV et non plus la classe MMKV
import { createMMKV } from 'react-native-mmkv';
import config from '@/app/config';

// Initialisation conforme à la V4
const mmkv = createMMKV({ id: config.STORAGE_PREFIX });

const storage = {
  set<T>(key: string, value: T): void {
    if (!key) return;
    mmkv.set(key, JSON.stringify(value));
  },

  get<T>(key: string): T | null {
    if (!key) return null;
    const raw = mmkv.getString(key);
    if (raw === undefined) return null;
    try { 
      return JSON.parse(raw) as T; 
    } catch { 
      return null; 
    }
  },

  delete(key: string): void {
    if (!key) return;
    // 💡 .delete() est devenu .remove() en v4
    mmkv.remove(key);
  },

  clear(): void { 
    mmkv.clearAll(); 
  },

  contains(key: string): boolean {
    if (!key) return false;
    return mmkv.contains(key);
  },

  // API AsyncStorage-compatible (Signatures asynchrones requises pour TanStack Query)
  getItem: async (key: string): Promise<string | null> => {
    if (!key) return null;
    return mmkv.getString(key) ?? null;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (!key) return;
    mmkv.set(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    if (!key) return;
    mmkv.remove(key);
  },
};

export const STORAGE_KEYS = {
  THEME_MODE:       'theme.mode',
  QUERY_CACHE:      'tanstack.query.cache',
} as const;

export default storage;