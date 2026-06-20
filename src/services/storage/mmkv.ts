import { createMMKV } from 'react-native-mmkv';

// Single shared MMKV instance for the entire app (react-native-mmkv v3+ API)
export const storage = createMMKV({ id: 'medicire-storage' });

// ─── Typed Storage Helpers ─────────────────────────────────────────────────────

export const StorageKeys = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  ONBOARDING_DONE: 'onboardingDone',
  RECENT_SEARCHES: 'recentSearches',
  LAST_LOCATION: 'lastLocation',
} as const;

/**
 * Store a JSON-serializable object.
 */
export const storeObject = <T>(key: string, value: T): void => {
  storage.set(key, JSON.stringify(value));
};

/**
 * Retrieve a stored JSON object.
 */
export const getObject = <T>(key: string): T | null => {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};
