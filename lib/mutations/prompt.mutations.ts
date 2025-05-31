import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { 
  togglePromptStar, 
  deletePrompt as deletePromptAction, 
  duplicatePrompt as duplicatePromptAction,
  createPrompt,
  updatePrompt
} from '@/lib/actions/prompt.actions';
import { toast } from 'sonner';
import type { CreatePromptData } from '@/lib/schemas/prompt';

export function useTogglePromptStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePromptStar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
    },
    onError: (error) => {
      toast.error('Failed to update prompt');
      console.error('Toggle star error:', error);
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePromptAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      toast.success('Prompt deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete prompt');
      console.error('Delete prompt error:', error);
    },
  });
}

export function useDuplicatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicatePromptAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      toast.success('Prompt duplicated successfully');
    },
    onError: (error) => {
      toast.error('Failed to duplicate prompt');
      console.error('Duplicate prompt error:', error);
    },
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPrompt,
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

export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrompt,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.prompts.detail(variables.promptId) 
      });
      toast.success('Prompt updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update prompt');
      console.error('Update prompt error:', error);
    },
  });
}