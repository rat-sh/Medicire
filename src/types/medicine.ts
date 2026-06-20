// ─── Medicine Types ───────────────────────────────────────────────────────────

export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  saltComposition: string;
  dosage: string;
  manufacturer: string;
  category: string;
  requiresPrescription: boolean;
}

export interface MedicineSuggestion {
  id: string;
  brandName: string;
  genericName: string;
  matchedOn: 'brand' | 'generic' | 'salt';
}
