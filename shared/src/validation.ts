import { z } from 'zod';

export const calculationRequestSchema = z.object({
  category: z.enum(['energy', 'transport', 'food', 'waste']),
  subCategory: z.string().min(1, 'Subcategory is required'),
  value: z.number().nonnegative('Value must be a positive number'),
});

export const footprintEntrySchema = z.object({
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  category: z.enum(['energy', 'transport', 'food', 'waste']),
  inputValue: z.number().positive('Value must be greater than zero'),
  inputUnit: z.string().min(1, 'Unit is required'),
  subCategory: z.string().min(1, 'Subcategory type is required'),
  // Optionals / extra details
  notes: z.string().max(200, 'Notes cannot exceed 200 characters').optional(),
});

export const offsetPurchaseSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  offsetAmountCo2eKg: z.number().positive('Offset carbon amount must be positive'),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1, 'Display name cannot be empty').max(50, 'Display name too long').nullable().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').nullable().optional(),
});

export const userGoalSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  targetValue: z.number().positive('Goal target value must be positive'),
  targetMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Target month must be in YYYY-MM format'),
});
