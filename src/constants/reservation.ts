// ─── Reservation Feature Constants ───────────────────────────────────────────
// Single source of truth for all reservation display logic:
// status configs, order flows, badge styles, and delivery options.

import type React from 'react';
import { Clock, CheckCircle, Package, XCircle, Truck } from 'lucide-react-native';
import { Colors } from './theme';
import type { ReservationStatus } from '@/types/reservation';

// ─── Status Display Config ────────────────────────────────────────────────────

export interface StatusDisplayConfig {
  color: string;
  bg: string;
  border: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  sub: string;
}

export const STATUS_CONFIG: Record<ReservationStatus, StatusDisplayConfig> = {
  pending: {
    color: Colors.warning,
    bg: Colors.warningLight,
    border: Colors.warningBorder,
    Icon: Clock,
    label: 'Order Placed',
    sub: 'Waiting for pharmacy to confirm your order.',
  },
  confirmed: {
    color: Colors.success,
    bg: Colors.successLight,
    border: Colors.successBorder,
    Icon: CheckCircle,
    label: 'Order Confirmed',
    sub: 'Pharmacy confirmed your order. Get ready!',
  },
  ready: {
    color: Colors.primary,
    bg: Colors.primaryLight,
    border: Colors.primary + '30',
    Icon: Package,
    label: 'Parcel Ready',
    sub: 'Your medicine is packed and waiting at the counter.',
  },
  out_for_delivery: {
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    Icon: Truck,
    label: 'Out for Delivery',
    sub: 'Your order is on the way. Expected in 30–60 min.',
  },
  cancelled: {
    color: Colors.error,
    bg: Colors.errorLight,
    border: Colors.errorBorder,
    Icon: XCircle,
    label: 'Order Cancelled',
    sub: 'This order was cancelled.',
  },
  completed: {
    color: Colors.success,
    bg: Colors.successLight,
    border: Colors.successBorder,
    Icon: CheckCircle,
    label: 'Completed',
    sub: 'Order successfully completed. Thank you!',
  },
};

// ─── Order Flow Sequences ─────────────────────────────────────────────────────

/** Steps shown for store-pickup orders */
export const PICKUP_FLOW: ReservationStatus[] = [
  'pending',
  'confirmed',
  'ready',
  'completed',
];

/** Steps shown for home-delivery orders */
export const DELIVERY_FLOW: ReservationStatus[] = [
  'pending',
  'confirmed',
  'ready',
  'out_for_delivery',
  'completed',
];

// ─── Confirm Screen Constants ─────────────────────────────────────────────────

export const PICKUP_WINDOWS = [
  { label: 'Today, 6–8 PM',          icon: '🌆' },
  { label: 'Today, 8–10 PM',         icon: '🌙' },
  { label: 'Tomorrow, 10 AM–12 PM',  icon: '☀️' },
];

/** Flat home-delivery charge in INR */
export const HOME_DELIVERY_FARE = 49;

// ─── Tracker Badge Config ─────────────────────────────────────────────────────

export const BADGE_CFG: Record<
  ReservationStatus,
  { label: string; bg: string; border: string; text: string }
> = {
  pending:          { label: 'Pending',    bg: Colors.warningLight, border: Colors.warningBorder, text: Colors.warning },
  confirmed:        { label: 'Confirmed',  bg: Colors.successLight, border: Colors.successBorder, text: Colors.success },
  ready:            { label: 'Ready',      bg: Colors.infoLight,    border: Colors.infoBorder,    text: Colors.info },
  out_for_delivery: { label: 'On the Way', bg: '#f5f3ff',           border: '#ddd6fe',            text: '#7c3aed' },
  cancelled:        { label: 'Cancelled',  bg: Colors.errorLight,   border: Colors.errorBorder,   text: Colors.error },
  completed:        { label: 'Completed',  bg: Colors.gray100,      border: Colors.gray200,       text: Colors.gray500 },
};
