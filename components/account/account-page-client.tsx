"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/lib/queries/user.queries';
import { useUpdateProfile, useUploadAvatar } from '@/lib/mutations/user.mutations';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/schemas/user';

interface AccountPageClientProps {
  user: User;
  initialProfile: UserProfile;
}

export function AccountPageClient({ user, initialProfile }: AccountPageClientProps) {
  const { data: profile = initialProfile } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  
  const [name, setName] = useState(profile.name || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleUpdateProfile = () => {
    updateProfile.mutate({ name });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      uploadAvatar.mutate(file);
    }
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.name || 'User'} />
                <AvatarFallback className="text-lg">
                  {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <Button 
              onClick={handleUpdateProfile}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}