import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Prompt } from '@/lib/schemas/prompt';

async function fetchPrompts(): Promise<Prompt[]> {
  const response = await fetch('/api/prompts');
  if (!response.ok) {
    throw new Error('Failed to fetch prompts');
  }
  return response.json();
}

async function fetchPrompt(id: string): Promise<Prompt> {
  const response = await fetch(`/api/prompts/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch prompt');
  }
  return response.json();
}

export function usePrompts() {
  return useQuery({
    queryKey: queryKeys.prompts.list(),
    queryFn: fetchPrompts,
  });
}

export function usePrompt(id: string) {
  return useQuery({
    queryKey: queryKeys.prompts.detail(id),
    queryFn: () => fetchPrompt(id),
    enabled: !!id,
  });
}