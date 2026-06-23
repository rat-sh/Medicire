// UI configuration — allowed profile field values (not business/mock data).

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' as const },
  { label: 'Female', value: 'female' as const },
  { label: 'Other', value: 'other' as const },
];

/** Chronic condition chips — synced with backend enum when available. */
export const CHRONIC_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Thyroid',
  'Heart Disease',
  'Arthritis',
] as const;

export type ChronicCondition = (typeof CHRONIC_CONDITIONS)[number];
