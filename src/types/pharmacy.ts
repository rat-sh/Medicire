// ─── Pharmacy Types ───────────────────────────────────────────────────────────

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface PharmacyLocation {
  latitude: number;
  longitude: number;
}

export interface OperatingHours {
  open: string;  // "09:00"
  close: string; // "22:00"
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  location: PharmacyLocation;
  phone: string;
  rating: number;
  isOpen: boolean;
  closingTime?: string; // "10:30 PM"
  operatingHours: {
    [day: string]: OperatingHours;
  };
  distanceMeters: number;
}

export interface PharmacyWithStock extends Pharmacy {
  stockStatus: StockStatus;
  price?: number; // In rupees
  stockCount?: number;
}

export interface PharmacySearchResult {
  pharmacies: PharmacyWithStock[];
  total: number;
  inStockCount: number;
}
