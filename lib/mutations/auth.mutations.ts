import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys } from '@/lib/query-keys';
import { AuthService } from '@/lib/services/auth.service';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { 
  SignUpData, 
  SignInData, 
  ResetPasswordData,
  UpdatePasswordData 
} from '@/lib/schemas/auth';

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpData) => {
      const supabase = createClient();
      return AuthService.signUp(data, supabase);
    },
    onSuccess: () => {
      toast.success('Account created! Please check your email to confirm your account.');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account');
      console.error('Sign up error:', error);
    },
  });
}

export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInData) => {
      const supabase = createClient();
      return AuthService.signIn(data, supabase);
    },
    onSuccess: (result) => {
      const authUser = AuthService.transformUser(result.user);
      
      // Update auth queries
      queryClient.setQueryData(queryKeys.auth.currentUser(), authUser);
      queryClient.setQueryData(queryKeys.auth.status(), true);
      
      toast.success('Welcome back! You\'ve successfully signed in.');
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid credentials');
      console.error('Sign in error:', error);
    },
  });
}

export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const supabase = createClient();
      return AuthService.signOut(supabase);
    },
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.setQueryData(queryKeys.auth.currentUser(), null);
      queryClient.setQueryData(queryKeys.auth.status(), false);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      
      // Clear all user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      
      toast.success('You\'ve been successfully signed out.');
      router.push('/');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => {
      const supabase = createClient();
      return AuthService.resetPassword(data, supabase);
    },
    onSuccess: () => {
      toast.success('Password reset email sent! Please check your inbox.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
      console.error('Reset password error:', error);
    },
  });
}

export function useUpdatePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePasswordData) => {
      const supabase = createClient();
      return AuthService.updatePassword(data, supabase);
    },
    onSuccess: () => {
      // Invalidate auth queries in case user data changed
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      
      toast.success('Password updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update password');
      console.error('Update password error:', error);
    },
  });
}
