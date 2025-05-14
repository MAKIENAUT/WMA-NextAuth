// src/lib/auth.ts
import { authOptions } from '@/lib/auth-config';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Not authorized');
  }
  return user;
}