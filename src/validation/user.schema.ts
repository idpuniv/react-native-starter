import { z } from 'zod';

export const userSchema = z.object({
  id:        z.string().uuid(),
  email:     z.string().email(),
  name:      z.string().min(1),
  createdAt: z.string().datetime(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères').optional(),
  email: z.string().email('Email invalide').optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
