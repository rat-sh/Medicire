import { create } from 'zustand';
import { storage, StorageKeys, storeObject, getObject } from '@/services/storage/mmkv';
import type { User, AuthTokens } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingSession: { user: User; tokens: AuthTokens } | null;
  setUser: (user: User, tokens: AuthTokens) => void;
  setPendingSession: (user: User, tokens: AuthTokens) => void;
  commitPendingSession: () => void;
  updateUser: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingSession: null,

  setUser: (user, tokens) => {
    storage.set(StorageKeys.ACCESS_TOKEN, tokens.accessToken);
    storage.set(StorageKeys.REFRESH_TOKEN, tokens.refreshToken);
    storeObject(StorageKeys.USER, user);
    storage.set(StorageKeys.ONBOARDING_DONE, 'true');
    set({ user, isAuthenticated: true, pendingSession: null });
  },

  setPendingSession: (user, tokens) => {
    set({ pendingSession: { user, tokens } });
  },

  commitPendingSession: () => {
    const pending = get().pendingSession;
    if (!pending) return;
    get().setUser(pending.user, pending.tokens);
  },

  updateUser: user => {
    storeObject(StorageKeys.USER, user);
    set({ user });
  },

  logout: () => {
    storage.remove(StorageKeys.ACCESS_TOKEN);
    storage.remove(StorageKeys.REFRESH_TOKEN);
    storage.remove(StorageKeys.USER);
    storage.remove(StorageKeys.ONBOARDING_DONE);
    set({ user: null, isAuthenticated: false, pendingSession: null });
  },

  hydrate: () => {
    const token = storage.getString(StorageKeys.ACCESS_TOKEN);
    const user = getObject<User>(StorageKeys.USER);
    const onboardingDone = storage.getString(StorageKeys.ONBOARDING_DONE);
    if (token && user && onboardingDone) {
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
