import type { Medicine, MedicineSuggestion } from '@/types/medicine';

export const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'med_001',
    brandName: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    saltComposition: 'Paracetamol 500mg',
    dosage: '500mg',
    manufacturer: 'Generic',
    category: 'Analgesic / Antipyretic',
    requiresPrescription: false,
  },
  {
    id: 'med_002',
    brandName: 'Dolo 650',
    genericName: 'Paracetamol',
    saltComposition: 'Paracetamol 650mg',
    dosage: '650mg',
    manufacturer: 'Micro Labs',
    category: 'Analgesic / Antipyretic',
    requiresPrescription: false,
  },
  {
    id: 'med_003',
    brandName: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride',
    saltComposition: 'Metformin 500mg',
    dosage: '500mg',
    manufacturer: 'Generic',
    category: 'Antidiabetic',
    requiresPrescription: true,
  },
  {
    id: 'med_004',
    brandName: 'Atorvastatin 10mg',
    genericName: 'Atorvastatin Calcium',
    saltComposition: 'Atorvastatin 10mg',
    dosage: '10mg',
    manufacturer: 'Generic',
    category: 'Statin / Cardiovascular',
    requiresPrescription: true,
  },
  {
    id: 'med_005',
    brandName: 'Azithromycin 500mg',
    genericName: 'Azithromycin',
    saltComposition: 'Azithromycin 500mg',
    dosage: '500mg',
    manufacturer: 'Generic',
    category: 'Antibiotic',
    requiresPrescription: true,
  },
];

export const MOCK_RECENT_SEARCHES = [
  'Paracetamol 500mg',
  'Metformin 500mg',
  'Atorvastatin 10mg',
  'Azithromycin 500mg',
  'Pantoprazole 40mg',
];

export const MOCK_POPULAR_SEARCHES = [
  'Dolo 650',
  'Crocin 500mg',
  'Combiflam',
  'ORS Powder',
  'Vitamin D3',
];

export const getMockSuggestions = (query: string): MedicineSuggestion[] => {
  const q = query.toLowerCase();
  return MOCK_MEDICINES.filter(
    m =>
      m.brandName.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.saltComposition.toLowerCase().includes(q),
  ).map(m => ({
    id: m.id,
    brandName: m.brandName,
    genericName: m.genericName,
    matchedOn: m.brandName.toLowerCase().includes(q) ? 'brand' : 'generic',
  }));
};
