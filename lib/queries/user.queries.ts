import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { UserProfile } from '@/lib/schemas/user';

async function fetchUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/user/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
}

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: fetchUserProfile,
  });
}