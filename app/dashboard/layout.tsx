import { requireAuth, getUserProfile } from '@/lib/auth/server';
import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireAuth();

  if (!user) {
    // If user is not authenticated, redirect to login
    return null; // This will be handled by the requireAuth function
  }
  const profile = await getUserProfile(user.id);

  return (
    <DashboardLayoutClient user={user} profile={profile}>
      {children}
    </DashboardLayoutClient>
  );
}