import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '@/services/api/reservations';
import { supabase, isSupabaseConfigured } from '@/services/api/supabaseClient';

export const useReservations = () => {
  const queryClient = useQueryClient();

  // Keep the original fetch logic (either via existing API or Supabase)
  const query = useQuery({
    queryKey: ['reservations'],
    queryFn: () => reservationsApi.getAll(),
    staleTime: 15 * 1000,
  });

  // Setup Supabase Realtime subscription for UI updates
  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    const channel = supabase
      .channel('public:reservations')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'reservations' },
        (payload) => {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('[DEV] Real-time reservation update:', payload.eventType);
          }
          // Invalidate the cache to trigger a re-fetch and update the UI instantly
          queryClient.invalidateQueries({ queryKey: ['reservations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};
