'use server'

import { AuthService } from '@/lib/services/auth.service';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export async function getCurrentUserServer(): Promise<User | null> {
  const supabase = await createServerClient();
  return AuthService.getCurrentUser(supabase);
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUserServer();
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