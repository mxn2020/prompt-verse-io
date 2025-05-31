'use server';

import { AuthService } from '@/lib/services/auth.service';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { 
  SignUpData, 
  SignInData, 
  ResetPasswordData,
  UpdatePasswordData 
} from '@/lib/schemas/auth';
import type { User } from '@supabase/supabase-js';

export async function signUpAction(data: SignUpData) {
  const supabase = await createServerClient();
  return AuthService.signUp(data, supabase);
}

export async function signInAction(data: SignInData) {
  const supabase = await createServerClient();
  return AuthService.signIn(data, supabase);
}

export async function signOutAction() {
  const supabase = await createServerClient();
  return AuthService.signOut(supabase);
}

export async function resetPasswordAction(data: ResetPasswordData) {
  const supabase = await createServerClient();
  return AuthService.resetPassword(data, supabase);
}

export async function updatePasswordAction(data: UpdatePasswordData) {
  const supabase = await createServerClient();
  return AuthService.updatePassword(data, supabase);
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerClient();
  return AuthService.getCurrentUser(supabase);
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerClient();
  return AuthService.getUserProfile(userId, supabase);
}

export async function isUserLoggedIn(): Promise<boolean> {
  const supabase = await createServerClient();
  return AuthService.isUserLoggedIn(supabase);
}

// Redirect helpers
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const user = await getCurrentUser();
  if (user) {
    redirect(redirectTo);
  }
}

export async function redirectIfNotAuthenticated(redirectTo: string = '/login') {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
}
