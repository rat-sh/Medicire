import type { User } from '@/types/user';

export const MOCK_USER: User = {
  id: 'usr_001',
  name: 'Arjun Sharma',
  phone: '9876543210',
  age: 32,
  gender: 'male',
  conditions: ['Diabetes', 'Hypertension'],
  savedAddresses: [
    {
      id: 'addr_001',
      label: 'home',
      line1: '12A, Block BE',
      line2: 'Salt Lake City',
      city: 'Kolkata',
      pincode: '700064',
      latitude: 22.5726,
      longitude: 88.4298,
    },
    {
      id: 'addr_002',
      label: 'work',
      line1: 'Technopolis, EM Bypass',
      city: 'Kolkata',
      pincode: '700107',
      latitude: 22.5623,
      longitude: 88.4456,
    },
  ],
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};
