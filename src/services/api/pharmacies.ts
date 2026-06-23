import apiClient from './client';
import type { PharmacySearchResult, PharmacyWithStock } from '@/types/pharmacy';

/**
 * Pharmacy API service.
 * Required backend endpoints:
 *   GET /pharmacies/search?medicineId&latitude&longitude&radiusMeters
 *   GET /pharmacies/:id
 *   GET /pharmacies/nearby?latitude&longitude&radiusMeters
 */
export const pharmaciesApi = {
  searchByMedicine: async (
    medicineId: string,
    latitude: number,
    longitude: number,
    radiusMeters: number = 5000,
  ): Promise<PharmacySearchResult> => {
    const { data } = await apiClient.get<PharmacySearchResult>(
      '/pharmacies/search',
      { params: { medicineId, latitude, longitude, radiusMeters } },
    );
    return data;
  },

  getById: async (pharmacyId: string): Promise<PharmacyWithStock> => {
    const { data } = await apiClient.get<PharmacyWithStock>(
      `/pharmacies/${pharmacyId}`,
    );
    return data;
  },

  getNearby: async (
    latitude: number,
    longitude: number,
    radiusMeters: number = 3000,
  ): Promise<PharmacyWithStock[]> => {
    const { data } = await apiClient.get<PharmacyWithStock[]>(
      '/pharmacies/nearby',
      { params: { latitude, longitude, radiusMeters } },
    );
    return data;
  },
};
