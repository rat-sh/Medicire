import { useQuery } from '@tanstack/react-query';
import { medicinesApi } from '@/services/api/medicines';
import { useAuthStore } from '@/store/authStore';

export const usePopularSearches = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return useQuery({
    queryKey: ['medicines', 'popular'],
    queryFn: () => medicinesApi.getPopularSearches(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};
