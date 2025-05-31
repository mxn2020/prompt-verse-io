import { redirect } from 'next/navigation';
import { SignUpPageClient } from '@/components/auth/signup-page-client';
import { getCurrentUserServer } from '@/lib/auth';

export const dynamic = 'force-dynamic'

export default async function SignUpPage() {
  // Check if user is already logged in
  const user = await getCurrentUserServer();
  
  if (user) {
    redirect('/dashboard');
  }

  return <SignUpPageClient />;
}