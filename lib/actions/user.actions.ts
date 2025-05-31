'use server';

import { UserService } from '@/lib/services/user.service';
import { AuthService } from '@/lib/services/auth.service';
import { createClient as createServerClient } from '@/lib/supabase/server';
import type { UpdateProfileData } from '@/lib/schemas/user';

export async function updateUserProfile(data: UpdateProfileData) {
  const supabase = await createServerClient();
  const user = await AuthService.getCurrentUser(supabase);
  if (!user) throw new Error('User not authenticated');

  return UserService.updateProfile(user.id, data, supabase);
}

export async function uploadUserAvatar(file: File) {
  const supabase = await createServerClient();
  const user = await AuthService.getCurrentUser(supabase);
  if (!user) throw new Error('User not authenticated');

  return UserService.uploadAvatar(user.id, file, supabase);
}