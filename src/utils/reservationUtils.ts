// ─── Reservation Business Logic Utilities ────────────────────────────────────
// Pure functions for reservation order-flow calculations.

import type { ReservationStatus } from '@/types/reservation';

/**
 * Determine the display state of a step in the order timeline.
 *
 * @param stepKey      - The status key of this step node
 * @param currentStatus - The reservation's current status
 * @param flow         - Ordered array of statuses for this delivery mode
 * @returns 'done' | 'active' | 'upcoming'
 */
export function getStepState(
  stepKey: ReservationStatus,
  currentStatus: ReservationStatus,
  flow: ReservationStatus[],
): 'done' | 'active' | 'upcoming' {
  const stepIdx    = flow.indexOf(stepKey);
  const currentIdx = flow.indexOf(currentStatus);
  if (stepIdx < currentIdx)  return 'done';
  if (stepIdx === currentIdx) return 'active';
  return 'upcoming';
}
