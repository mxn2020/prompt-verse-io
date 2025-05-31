'use server';

import { PromptService } from '@/lib/services/prompt.service';
import { AuthService } from '@/lib/services/auth.service';
import { createClient as createServerClient } from '@/lib/supabase/server';
import type { CreatePromptData } from '@/lib/schemas/prompt';

export async function togglePromptStar({ 
  promptId, 
  starred 
}: { 
  promptId: string; 
  starred: boolean; 
}) {
  const supabase = await createServerClient();
  const user = await AuthService.getCurrentUser(supabase);
  if (!user) throw new Error('User not authenticated');

  return PromptService.toggleStar(promptId, starred, supabase);
}

export async function deletePrompt(promptId: string) {
  const supabase = await createServerClient();
  const user = await AuthService.getCurrentUser(supabase);
  if (!user) throw new Error('User not authenticated');

  return PromptService.deletePrompt(promptId, supabase);
}

export async function duplicatePrompt(promptData: CreatePromptData) {
  const supabase = await createServerClient();
  const user = await AuthService.getCurrentUser(supabase);
  if (!user) throw new Error('User not authenticated');

  return PromptService.createPrompt(promptData, user.id, supabase);
}

export async function createPrompt(promptData: CreatePromptData) {
  const supabase = await createServerClient();
  const user = await AuthService.getCurrentUser(supabase);
  if (!user) throw new Error('User not authenticated');

  return PromptService.createPrompt(promptData, user.id, supabase);
}

export async function updatePrompt({ 
  promptId, 
  data 
}: { 
  promptId: string; 
  data: Partial<CreatePromptData>; 
}) {
  const supabase = await createServerClient();
  const user = await AuthService.getCurrentUser(supabase);
  if (!user) throw new Error('User not authenticated');

  return PromptService.updatePrompt(promptId, data, supabase);
}