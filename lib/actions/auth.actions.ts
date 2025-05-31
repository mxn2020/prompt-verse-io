'use server';

import { AuthService } from '@/lib/services/auth.service';
import { redirect } from 'next/navigation';
import type { 
  SignUpData, 
  SignInData, 
  ResetPasswordData,
  UpdatePasswordData 
} from '@/lib/schemas/auth';
import type { User } from '@supabase/supabase-js';

export async function signUpAction(data: SignUpData) {
  return AuthService.signUp(data);
}

export async function signInAction(data: SignInData) {
  return AuthService.signIn(data);
}

export async function signOutAction() {
  return AuthService.signOut();
}

export async function resetPasswordAction(data: ResetPasswordData) {
  return AuthService.resetPassword(data);
}

export async function updatePasswordAction(data: UpdatePasswordData) {
  return AuthService.updatePassword(data);
}

export async function getCurrentUser(): Promise<User | null> {
  return AuthService.getCurrentUserServer();
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function getUserProfile(userId: string) {
  return AuthService.getUserProfile(userId, true);
}

export async function isUserLoggedIn(): Promise<boolean> {
  return AuthService.isUserLoggedIn(true);
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
