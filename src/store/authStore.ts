import { create } from 'zustand';
import { storage, StorageKeys, storeObject, getObject } from '@/services/storage/mmkv';
import type { User, AuthTokens } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Actions
  setUser: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user, tokens) => {
    storage.set(StorageKeys.ACCESS_TOKEN, tokens.accessToken);
    storage.set(StorageKeys.REFRESH_TOKEN, tokens.refreshToken);
    storeObject(StorageKeys.USER, user);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    storage.remove(StorageKeys.ACCESS_TOKEN);
    storage.remove(StorageKeys.REFRESH_TOKEN);
    storage.remove(StorageKeys.USER);
    set({ user: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = storage.getString(StorageKeys.ACCESS_TOKEN);
    const user = getObject<User>(StorageKeys.USER);
    if (token && user) {
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
