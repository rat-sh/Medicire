import React from 'react';
import { Badge, BadgeVariant } from '@/components/ui/Badge';

export interface ReservationStatusBadgeProps {
  status: string;
}

export const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({ status }) => {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    pending: { label: 'Pending', variant: 'amber' },
    confirmed: { label: 'Confirmed', variant: 'green' },
    ready: { label: 'Ready for Pickup', variant: 'blue' },
    cancelled: { label: 'Cancelled', variant: 'red' },
    completed: { label: 'Completed', variant: 'gray' },
  };

  const s = map[status] || map.pending;

  return <Badge label={s.label} variant={s.variant} />;
};
