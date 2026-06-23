import { useQuery } from '@tanstack/react-query';
import { pharmaciesApi } from '@/services/api/pharmacies';
import { useLocationStore } from '@/store/locationStore';

export const useNearbyPharmacies = (radiusMeters = 3000) => {
  const { latitude, longitude } = useLocationStore();

  return useQuery({
    queryKey: ['pharmacies', 'nearby', latitude, longitude, radiusMeters],
    queryFn: () => {
      if (latitude == null || longitude == null) {
        return Promise.resolve([]);
      }
      return pharmaciesApi.getNearby(latitude, longitude, radiusMeters);
    },
    enabled: latitude != null && longitude != null,
    staleTime: 60 * 1000,
  });
};
