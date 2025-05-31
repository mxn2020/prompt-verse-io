import { redirect } from 'next/navigation';
import { LoginPageClient } from '@/components/auth/login-page-client';
import { getCurrentUserServer } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  // Check if user is already logged in
  const user = await getCurrentUserServer();
  
  if (user) {
    redirect('/dashboard');
  }

  return <LoginPageClient />;
}