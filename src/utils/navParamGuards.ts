/**
 * navParamGuards.ts
 * Runtime validation of navigation params.
 *
 * Navigation params are user-controlled via deep links and URL schemes.
 * They must be treated as untrusted input — same as HTTP query params.
 * These guards ensure params are well-formed before any screen uses them.
 */

/** Allowed pharmacy ID format: lowercase letters, digits, underscores, hyphens, max 64 chars */
const PHARMACY_ID_RE = /^[a-z0-9_-]{1,64}$/i;

/** Allowed medicine ID format: same pattern */
const MEDICINE_ID_RE = /^[a-z0-9_-]{1,64}$/i;

/** Allowed reservation ID format: same pattern */
const RESERVATION_ID_RE = /^[a-z0-9_-]{1,64}$/i;

/**
 * Validate a pharmacyId navigation param.
 * Returns the sanitised string if valid, null otherwise.
 */
export function guardPharmacyId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  return PHARMACY_ID_RE.test(id) ? id : null;
}

/**
 * Validate a medicineId navigation param.
 * Returns the sanitised string if valid, null otherwise.
 */
export function guardMedicineId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  return MEDICINE_ID_RE.test(id) ? id : null;
}

/**
 * Validate a reservationId navigation param.
 * Returns the sanitised string if valid, null otherwise.
 */
export function guardReservationId(id: unknown): string | null {
  if (typeof id !== 'string') return null;
  return RESERVATION_ID_RE.test(id) ? id : null;
}

/**
 * Validate a ReservationStatus param coming from navigation.
 * Only explicitly known statuses are accepted.
 */
const VALID_STATUSES = new Set([
  'pending', 'confirmed', 'ready', 'out_for_delivery', 'cancelled', 'completed',
]);

export function guardReservationStatus(status: unknown): string | null {
  if (typeof status !== 'string') return null;
  return VALID_STATUSES.has(status) ? status : null;
}
