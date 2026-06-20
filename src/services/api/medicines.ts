import { Config } from '@/constants/config';
import apiClient from './client';
import { getMockSuggestions, MOCK_MEDICINES, MOCK_RECENT_SEARCHES, MOCK_POPULAR_SEARCHES } from './mock/medicines';
import type { Medicine, MedicineSuggestion } from '@/types/medicine';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

export const medicinesApi = {
  getSuggestions: async (query: string): Promise<MedicineSuggestion[]> => {
    if (Config.USE_MOCK) {
      await delay(200);
      return getMockSuggestions(query);
    }
    const { data } = await apiClient.get<MedicineSuggestion[]>(
      '/medicines/suggest',
      { params: { q: query } },
    );
    return data;
  },

  getById: async (medicineId: string): Promise<Medicine> => {
    if (Config.USE_MOCK) {
      await delay(200);
      const med = MOCK_MEDICINES.find(m => m.id === medicineId);
      if (!med) throw new Error('Medicine not found');
      return med;
    }
    const { data } = await apiClient.get<Medicine>(`/medicines/${medicineId}`);
    return data;
  },

  getRecentSearches: async (): Promise<string[]> => {
    if (Config.USE_MOCK) return MOCK_RECENT_SEARCHES;
    const { data } = await apiClient.get<string[]>('/medicines/recent');
    return data;
  },

  getPopularSearches: async (): Promise<string[]> => {
    if (Config.USE_MOCK) return MOCK_POPULAR_SEARCHES;
    const { data } = await apiClient.get<string[]>('/medicines/popular');
    return data;
  },
};
