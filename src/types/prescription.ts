// ─── Prescription Types ───────────────────────────────────────────────────────

export type OcrStage =
  | 'reading'
  | 'identifying'
  | 'validating'
  | 'checking'
  | 'ranking'
  | 'done'
  | 'failed';

export interface ExtractedMedicine {
  id: string;
  name: string;
  dosage: string;
  quantity?: string;
  confidence: number; // 0-1
  isEdited: boolean;
}

export interface PrescriptionPharmacyResult {
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  distanceMeters: number;
  matchedMedicines: number;
  totalMedicines: number;
  totalPrice?: number;
}

export interface Prescription {
  id: string;
  userId: string;
  imageUrl: string;
  thumbnailUrl: string;
  doctorName?: string;
  uploadedAt: string;
  ocrStage: OcrStage;
  extractedMedicines: ExtractedMedicine[];
  pharmacyResults: PrescriptionPharmacyResult[];
}
