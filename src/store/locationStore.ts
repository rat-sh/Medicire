import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string;
  hasPermission: boolean;
  isLoading: boolean;
  setLocation: (lat: number, lng: number, city?: string) => void;
  setPermission: (granted: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  city: '',
  hasPermission: false,
  isLoading: false,

  setLocation: (latitude, longitude, city) =>
    set({ latitude, longitude, city: city ?? '' }),

  setPermission: (hasPermission) => set({ hasPermission }),

  setLoading: (isLoading) => set({ isLoading }),

  clearLocation: () =>
    set({ latitude: null, longitude: null, city: '', hasPermission: false }),
}));
