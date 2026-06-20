import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string;
  hasPermission: boolean;
  isLoading: boolean;
  // Actions
  setLocation: (lat: number, lng: number, city?: string) => void;
  setPermission: (granted: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  city: 'Salt Lake, Kolkata', // Default for mock
  hasPermission: false,
  isLoading: false,

  setLocation: (latitude, longitude, city) =>
    set({ latitude, longitude, city: city ?? 'Salt Lake, Kolkata' }),

  setPermission: (hasPermission) => set({ hasPermission }),

  setLoading: (isLoading) => set({ isLoading }),
}));
