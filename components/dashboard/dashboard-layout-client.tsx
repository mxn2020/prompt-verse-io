"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header/dashboard-header";
import { useUserProfile } from "@/lib/queries/user.queries";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/lib/schemas/user";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: User;
  profile: UserProfile;
}

export function DashboardLayoutClient({ 
  children, 
  user, 
  profile: initialProfile 
}: DashboardLayoutClientProps) {
  // Use the server-provided profile as initial data, but allow client-side updates
  const { data: profile = initialProfile } = useUserProfile();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardSidebar user={user} profile={profile} />
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}