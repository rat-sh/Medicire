/**
 * slides.ts
 * Onboarding slide data — pure constants, zero UI.
 * Each slide describes one real user pain-point that Medicire solves.
 */

export interface Slide {
  id: string;
  /** LinearGradient colours for the illustration circle */
  gradientColors: [string, string, string];
  /** Emoji shown inside the illustration circle */
  icon: string;
  /** Short uppercase tag label */
  tag: string;
  /** Accent colour used for the tag border, button, and dot */
  tagColor: string;
  /** Large heading */
  title: string;
  /** Descriptive body text */
  subtitle: string;
  /** Quoted pain-point shown in the callout box */
  painPoint: string;
}

export const SLIDES: Slide[] = [
  {
    id: '1',
    gradientColors: ['#0b8f81', '#0d9e8f', '#065f56'],
    icon: '🧾',
    tag: 'SCAN',
    tagColor: '#0b8f81',
    title: 'Decode with AI',
    subtitle:
      'Upload your prescription and let our AI instantly identify the medicines you need.',
    painPoint: '"I can\'t read the doctor\'s handwriting."',
  },
  {
    id: '2',
    gradientColors: ['#2563eb', '#3b82f6', '#1d4ed8'],
    icon: '📍',
    tag: 'FIND',
    tagColor: '#2563eb',
    title: 'Find It Nearby',
    subtitle:
      'Find pharmacies near you that actually have your medicines in stock right now.',
    painPoint: '"I have to visit 5 pharmacies to find this medicine."',
  },
  {
    id: '3',
    gradientColors: ['#7c3aed', '#8b5cf6', '#6d28d9'],
    icon: '🛵',
    tag: 'ORDER',
    tagColor: '#7c3aed',
    title: 'Skip The Line',
    subtitle:
      'Reserve medicines for quick pickup or get them delivered straight to your door.',
    painPoint: '"I\'m sick — I can\'t stand in a long pharmacy queue."',
  },
];
