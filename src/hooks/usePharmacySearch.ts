import { useQuery } from '@tanstack/react-query';
import { pharmaciesApi } from '@/services/api/pharmacies';
import { useLocationStore } from '@/store/locationStore';

export const usePharmacySearch = (medicineId: string, radiusMeters = 5000) => {
  const { latitude, longitude } = useLocationStore();

  return useQuery({
    queryKey: ['pharmacies', 'search', medicineId, latitude, longitude, radiusMeters],
    queryFn: () => {
      if (latitude == null || longitude == null) {
        return Promise.resolve({ pharmacies: [], total: 0, inStockCount: 0 });
      }
      return pharmaciesApi.searchByMedicine(medicineId, latitude, longitude, radiusMeters);
    },
    enabled: Boolean(medicineId) && latitude != null && longitude != null,
    staleTime: 30 * 1000,
  });
};
