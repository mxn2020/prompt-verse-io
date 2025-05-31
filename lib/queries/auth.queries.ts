import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { AuthService } from '@/lib/services/auth.service';
import type { AuthUser } from '@/lib/schemas/auth';

// Client-side auth queries
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: async (): Promise<AuthUser | null> => {
      const user = await AuthService.getCurrentUserClient();
      return AuthService.transformUser(user);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: queryKeys.auth.profile(userId),
    queryFn: async () => {
      if (!userId) {
        const user = await AuthService.getCurrentUserClient();
        if (!user) throw new Error('User not authenticated');
        return AuthService.getUserProfile(user.id, false);
      }
      return AuthService.getUserProfile(userId, false);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: () => AuthService.isUserLoggedIn(false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Helper hook to get auth-related query client functions
export function useAuthQueries() {
  const queryClient = useQueryClient();

  const invalidateAuth = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
  };

  const setCurrentUser = (user: AuthUser | null) => {
    queryClient.setQueryData(queryKeys.auth.currentUser(), user);
  };

  const getCurrentUserFromCache = (): AuthUser | null => {
    return queryClient.getQueryData(queryKeys.auth.currentUser()) || null;
  };

  return {
    invalidateAuth,
    setCurrentUser,
    getCurrentUserFromCache,
  };
}
