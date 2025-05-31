import { getCurrentUserServer } from './server';
import { redirect } from 'next/navigation';

export async function redirectIfAuthenticated(redirectTo: string = '/dashboard') {
  const user = await getCurrentUserServer();
  if (user) {
    redirect(redirectTo);
  }
}

export async function redirectIfNotAuthenticated(redirectTo: string = '/login') {
  const user = await getCurrentUserServer();
  if (!user) {
    redirect(redirectTo);
  }
}