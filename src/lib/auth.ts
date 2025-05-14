// src/lib/auth.ts
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/signin');
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  return user;
}

export async function isDashboardAllowed() {
  const user = await getCurrentUser();
  return !!user?.isAllowedDashboard;
}