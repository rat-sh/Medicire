import { useQuery } from '@tanstack/react-query';
import { medicinesApi } from '@/services/api/medicines';
import { useAuthStore } from '@/store/authStore';

export const useRecentSearches = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return useQuery({
    queryKey: ['medicines', 'recent'],
    queryFn: () => medicinesApi.getRecentSearches(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
};
