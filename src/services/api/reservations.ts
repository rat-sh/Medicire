import { Config } from '@/constants/config';
import apiClient from './client';
import { MOCK_RESERVATIONS } from './mock/reservations';
import type { Reservation, CreateReservationPayload } from '@/types/reservation';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const reservationsApi = {
  getAll: async (): Promise<Reservation[]> => {
    if (Config.USE_MOCK) {
      await delay(500);
      return MOCK_RESERVATIONS;
    }
    const { data } = await apiClient.get<Reservation[]>('/reservations');
    return data;
  },

  getById: async (id: string): Promise<Reservation> => {
    if (Config.USE_MOCK) {
      await delay(200);
      const rsv = MOCK_RESERVATIONS.find(r => r.id === id);
      if (!rsv) throw new Error('Reservation not found');
      return rsv;
    }
    const { data } = await apiClient.get<Reservation>(`/reservations/${id}`);
    return data;
  },

  create: async (payload: CreateReservationPayload): Promise<Reservation> => {
    if (Config.USE_MOCK) {
      await delay(1000);
      const newRsv: Reservation = {
        id: `rsv_${Date.now()}`,
        userId: 'usr_001',
        pharmacyId: payload.pharmacyId,
        pharmacyName: 'Apollo Pharmacy',
        pharmacyAddress: 'Salt Lake, Kolkata',
        medicineId: payload.medicineId,
        medicineName: 'Paracetamol 500mg',
        medicineDosage: '500mg',
        quantity: payload.quantity,
        pricePerUnit: 48,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newRsv;
    }
    const { data } = await apiClient.post<Reservation>('/reservations', payload);
    return data;
  },

  cancel: async (id: string): Promise<void> => {
    if (Config.USE_MOCK) {
      await delay(500);
      return;
    }
    await apiClient.patch(`/reservations/${id}/cancel`);
  },
};
