import { z } from 'zod';

// ─── Auth Validators ──────────────────────────────────────────────────────────

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be 10 digits')
  .max(10, 'Phone number must be 10 digits')
  .regex(/^\d{10}$/, 'Enter a valid 10-digit phone number');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password is too long');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d{6}$/, 'OTP must be numeric');

export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  password: passwordSchema,
  agreeToTerms: z.boolean().refine(val => val, 'You must agree to the terms'),
});

// ─── Profile Validators ───────────────────────────────────────────────────────

export const profileSetupSchema = z.object({
  age: z
    .string()
    .optional()
    .refine(val => !val || (Number(val) >= 1 && Number(val) <= 120), 'Invalid age'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  conditions: z.array(z.string()).optional(),
});

// ─── Reservation Validators ───────────────────────────────────────────────────

export const reservationSchema = z.object({
  medicineId: z.string().min(1),
  pharmacyId: z.string().min(1),
  quantity: z.number().min(1, 'Minimum quantity is 1').max(99, 'Maximum quantity is 99'),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;
export type ReservationFormData = z.infer<typeof reservationSchema>;
