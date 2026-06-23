import apiClient from './client';
import type { Reservation, CreateReservationPayload } from '@/types/reservation';

/**
 * Reservations API service.
 * Required backend endpoints:
 *   GET    /reservations
 *   GET    /reservations/:id
 *   POST   /reservations
 *   PATCH  /reservations/:id/cancel
 */
export const reservationsApi = {
  getAll: async (): Promise<Reservation[]> => {
    const { data } = await apiClient.get<Reservation[]>('/reservations');
    return data;
  },

  getById: async (id: string): Promise<Reservation> => {
    const { data } = await apiClient.get<Reservation>(`/reservations/${id}`);
    return data;
  },

  create: async (payload: CreateReservationPayload): Promise<Reservation> => {
    const { data } = await apiClient.post<Reservation>('/reservations', payload);
    return data;
  },

  cancel: async (id: string): Promise<void> => {
    await apiClient.patch(`/reservations/${id}/cancel`);
  },
};
