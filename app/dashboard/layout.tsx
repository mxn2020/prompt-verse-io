import { requireAuth, getUserProfile } from '@/lib/auth/server';
import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAuth();
  const profile = await getUserProfile(user.id);

  return (
    <DashboardLayoutClient user={user} profile={profile}>
      {children}
    </DashboardLayoutClient>
  );
}