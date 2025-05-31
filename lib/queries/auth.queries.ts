import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { AuthService } from '@/lib/services/auth.service';
import { createClient } from '@/lib/supabase/client';
import type { AuthUser } from '@/lib/schemas/auth';

// Client-side auth queries
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: async (): Promise<AuthUser | null> => {
      const supabase = createClient();
      const user = await AuthService.getCurrentUser(supabase);
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
      const supabase = createClient();
      if (!userId) {
        const user = await AuthService.getCurrentUser(supabase);
        if (!user) throw new Error('User not authenticated');
        return AuthService.getUserProfile(user.id, supabase);
      }
      return AuthService.getUserProfile(userId, supabase);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: () => {
      const supabase = createClient();
      return AuthService.isUserLoggedIn(supabase);
    },
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
