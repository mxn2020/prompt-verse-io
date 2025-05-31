import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { updateUserProfile, uploadUserAvatar } from '@/lib/actions/user.actions';
import { toast } from 'sonner';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadUserAvatar,
    onSuccess: (avatarUrl) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      toast.success('Avatar uploaded successfully');
      return avatarUrl;
    },
    onError: (error) => {
      toast.error('Failed to upload avatar');
      console.error('Avatar upload error:', error);
    },
  });
}