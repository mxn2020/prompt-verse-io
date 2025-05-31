import { z } from 'zod';

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  role: z.string().default('user'),
  plan_tier: z.string().default('free'),
  team_id: z.string().uuid().nullable(),
  preferences: z.record(z.any()).default({}),
  created_at: z.string(),
  updated_at: z.string(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional(),
  preferences: z.record(z.any()).optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema> & { preferences: Preferences };
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type Preferences = Record<string, any>;