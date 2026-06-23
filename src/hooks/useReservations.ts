import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '@/services/api/reservations';

export const useReservations = () =>
  useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsApi.getAll(),
    staleTime: 15 * 1000,
  });
