import { AuthService } from '@/lib/services/auth.service';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient();
  return AuthService.getCurrentUser(supabase);
}

export async function getUserProfile(userId: string) {
  const supabase = createClient();
  return AuthService.getUserProfile(userId, supabase);
}