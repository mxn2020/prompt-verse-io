// app/account/page.tsx
import { AccountPageClient } from '@/components/account/account-page-client';
import { requireAuth, getUserProfile } from '@/lib/auth';

export default async function AccountPage() {
  const user = await requireAuth();

  if (!user) {
    // If user is not authenticated, redirect to login
    return null; // This will be handled by the requireAuth function
  }

  const profile = await getUserProfile(user.id);

  return <AccountPageClient
    user={user}
    initialProfile={profile}
  />;
}
