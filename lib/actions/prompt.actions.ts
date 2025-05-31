'use server';

import { PromptService } from '@/lib/services/prompt.service';
import { AuthService } from '@/lib/services/auth.service';
import type { CreatePromptData } from '@/lib/schemas/prompt';

export async function togglePromptStar({ 
  promptId, 
  starred 
}: { 
  promptId: string; 
  starred: boolean; 
}) {
  const user = await AuthService.getCurrentUserClient();
  if (!user) throw new Error('User not authenticated');

  return PromptService.toggleStar(promptId, starred);
}

export async function deletePrompt(promptId: string) {
  const user = await AuthService.getCurrentUserClient();
  if (!user) throw new Error('User not authenticated');

  return PromptService.deletePrompt(promptId);
}

export async function duplicatePrompt(promptData: CreatePromptData) {
  const user = await AuthService.getCurrentUserClient();
  if (!user) throw new Error('User not authenticated');

  return PromptService.createPrompt(promptData, user.id);
}

export async function createPrompt(promptData: CreatePromptData) {
  const user = await AuthService.getCurrentUserClient();
  if (!user) throw new Error('User not authenticated');

  return PromptService.createPrompt(promptData, user.id);
}

export async function updatePrompt({ 
  promptId, 
  data 
}: { 
  promptId: string; 
  data: Partial<CreatePromptData>; 
}) {
  const user = await AuthService.getCurrentUserClient();
  if (!user) throw new Error('User not authenticated');

  return PromptService.updatePrompt(promptId, data);
}