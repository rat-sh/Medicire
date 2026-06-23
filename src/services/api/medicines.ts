import apiClient from './client';
import type { Medicine, MedicineSuggestion } from '@/types/medicine';

/**
 * Medicine API service.
 * Required backend endpoints:
 *   GET /medicines/suggest?q=
 *   GET /medicines/:id
 *   GET /medicines/recent
 *   GET /medicines/popular
 */
export const medicinesApi = {
  getSuggestions: async (query: string): Promise<MedicineSuggestion[]> => {
    const { data } = await apiClient.get<MedicineSuggestion[]>(
      '/medicines/suggest',
      { params: { q: query } },
    );
    return data;
  },

  getById: async (medicineId: string): Promise<Medicine> => {
    const { data } = await apiClient.get<Medicine>(`/medicines/${medicineId}`);
    return data;
  },

  getRecentSearches: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/medicines/recent');
    return data;
  },

  getPopularSearches: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/medicines/popular');
    return data;
  },
};
