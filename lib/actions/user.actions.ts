'use server';

import { UserService } from '@/lib/services/user.service';
import { AuthService } from '@/lib/services/auth.service';
import type { UpdateProfileData } from '@/lib/schemas/user';

export async function updateUserProfile(data: UpdateProfileData) {
  const user = await AuthService.getCurrentUserClient();
  if (!user) throw new Error('User not authenticated');

  return UserService.updateProfile(user.id, data);
}

export async function uploadUserAvatar(file: File) {
  const user = await AuthService.getCurrentUserClient();
  if (!user) throw new Error('User not authenticated');

  return UserService.uploadAvatar(user.id, file);
}