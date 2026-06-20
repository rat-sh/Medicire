import { Config } from '@/constants/config';
import apiClient from './client';
import { MOCK_PHARMACIES } from './mock/pharmacies';
import type { PharmacySearchResult, PharmacyWithStock } from '@/types/pharmacy';

const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(() => res(), ms));

export const pharmaciesApi = {
  /**
   * Search pharmacies that have a given medicine in stock near a location.
   */
  searchByMedicine: async (
    medicineId: string,
    latitude: number,
    longitude: number,
    radiusMeters: number = 5000,
  ): Promise<PharmacySearchResult> => {
    if (Config.USE_MOCK) {
      await delay(800); // Simulate network delay
      const pharmacies = MOCK_PHARMACIES.filter(
        p => p.distanceMeters <= radiusMeters,
      );
      
      return {
        pharmacies,
        total: pharmacies.length,
        inStockCount: pharmacies.filter(p => p.stockStatus === 'in-stock').length,
      };
    }

    const { data } = await apiClient.get<PharmacySearchResult>(
      '/pharmacies/search',
      { params: { medicineId, latitude, longitude, radiusMeters } },
    );
    return data;
  },

  /**
   * Get full details for a single pharmacy.
   */
  getById: async (pharmacyId: string): Promise<PharmacyWithStock> => {
    if (Config.USE_MOCK) {
      await delay(300);
      const pharmacy = MOCK_PHARMACIES.find(p => p.id === pharmacyId);
      if (!pharmacy) throw new Error('Pharmacy not found');
      return pharmacy;
    }

    const { data } = await apiClient.get<PharmacyWithStock>(
      `/pharmacies/${pharmacyId}`,
    );
    return data;
  },

  /**
   * Get nearby pharmacies regardless of medicine.
   */
  getNearby: async (
    latitude: number,
    longitude: number,
    radiusMeters: number = 3000,
  ): Promise<PharmacyWithStock[]> => {
    if (Config.USE_MOCK) {
      await delay(500);
      return MOCK_PHARMACIES.slice(0, 4);
    }

    const { data } = await apiClient.get<PharmacyWithStock[]>(
      '/pharmacies/nearby',
      { params: { latitude, longitude, radiusMeters } },
    );
    return data;
  },
};
