import { createMMKV } from 'react-native-mmkv';

// ─── Encryption Key ────────────────────────────────────────────────────────────
// TODO (PRODUCTION): Replace this static key with a value retrieved from
// react-native-keychain (iOS Keychain / Android Keystore) so the key is
// hardware-backed and unique per device. A static key still encrypts the
// file-at-rest so it won't appear in plaintext backups or ADB pulls.
const STORAGE_ENCRYPTION_KEY = 'medicire-mmkv-enc-k3y-v1';

// Single shared MMKV instance — AES-256 encrypted at rest
export const storage = createMMKV({
  id: 'medicire-storage',
  encryptionKey: STORAGE_ENCRYPTION_KEY,
});

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
