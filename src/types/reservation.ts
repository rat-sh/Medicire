// ─── Reservation Types ────────────────────────────────────────────────────────

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'ready'
  | 'cancelled'
  | 'completed';

export interface Reservation {
  id: string;
  userId: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  medicineId: string;
  medicineName: string;
  medicineDosage: string;
  quantity: number;
  pricePerUnit: number;
  status: ReservationStatus;
  cancellationReason?: string;
  pickupDeadline?: string; // ISO string
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationPayload {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
}
