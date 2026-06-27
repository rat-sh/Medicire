/**
 * constants.ts
 * Shared constants for the Home screen.
 */
import { Colors } from '@/constants/theme';
import { Routes } from '@/constants/routes';
import { MapPin, Package, Upload } from 'lucide-react-native';

export const QUICK_ACTIONS = [
  { icon: MapPin, label: 'Nearby', bg: Colors.primaryLight, color: Colors.primary, tab: Routes.SEARCH_TAB },
  { icon: Package, label: 'My Orders', bg: Colors.infoLight, color: Colors.info, tab: Routes.RESERVATIONS_TAB },
  { icon: Upload, label: 'Prescription', bg: '#f5f3ff', color: '#7c3aed', tab: Routes.VAULT_TAB },
] as const;
