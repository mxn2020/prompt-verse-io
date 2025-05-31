"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { createPrompt as createPromptAction } from '@/lib/actions/prompt.actions';
import { toast } from 'sonner';
import type { CreatePromptData } from '@/lib/schemas/prompt';

export function useCreatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromptData) => createPromptAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      toast.success('Prompt created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create prompt');
      console.error('Create prompt error:', error);
    },
  });
}