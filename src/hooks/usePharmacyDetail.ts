import { useQuery } from '@tanstack/react-query';
import { pharmaciesApi } from '@/services/api/pharmacies';

export const usePharmacyDetail = (pharmacyId: string) =>
  useQuery({
    queryKey: ['pharmacies', 'detail', pharmacyId],
    queryFn: () => pharmaciesApi.getById(pharmacyId),
    enabled: Boolean(pharmacyId),
  });
