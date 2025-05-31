import { AuthService } from '@/lib/services/auth.service';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export async function getCurrentUserServer(): Promise<User | null> {
  return AuthService.getCurrentUserServer();
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUserServer();
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