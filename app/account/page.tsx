import { requireAuth, getUserProfile } from '@/lib/auth/server';
import { AccountPageClient } from '@/components/account/account-page-client';

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  return <AccountPageClient user={user} initialProfile={profile} />;
}