import { z } from 'zod';

export const promptSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string(),
  prompt_type: z.enum(['standard', 'structured', 'modularized', 'advanced']),
  visibility: z.enum(['private', 'team', 'public']),
  tags: z.array(z.string()),
  starred: z.boolean(),
  usage_count: z.number(),
  owner_id: z.string().uuid(),
  workspace_id: z.string().uuid().nullable(),
  model_settings: z.any(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createPromptSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  content: z.string().min(1),
  prompt_type: z.enum(['standard', 'structured', 'modularized', 'advanced']).default('standard'),
  visibility: z.enum(['private', 'team', 'public']).default('private'),
  tags: z.array(z.string()).default([]),
  model_settings: z.any().optional(),
});

export type Prompt = z.infer<typeof promptSchema>;
export type CreatePromptData = z.infer<typeof createPromptSchema>;