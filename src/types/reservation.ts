// ─── Reservation Types ────────────────────────────────────────────────────────

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'ready'
  | 'out_for_delivery'
  | 'cancelled'
  | 'completed';

export type DeliveryMode = 'pickup' | 'delivery';

export interface TrackingStep {
  key: ReservationStatus;
  label: string;
  timestamp?: string; // ISO string if reached
}

export interface Reservation {
  id: string;
  userId: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone?: string;
  pharmacyLat?: number;
  pharmacyLng?: number;
  medicineId: string;
  medicineName: string;
  medicineDosage: string;
  quantity: number;
  pricePerUnit: number;
  deliveryMode: DeliveryMode;
  deliveryFare?: number; // ₹ flat fare for home delivery
  deliveryAddress?: string;
  status: ReservationStatus;
  cancellationReason?: string;
  pickupDeadline?: string; // ISO string
  trackingSteps?: TrackingStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationPayload {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
  deliveryMode: DeliveryMode;
  deliveryAddress?: string;
}
