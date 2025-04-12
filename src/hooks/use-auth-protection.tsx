// src/hooks/use-auth-protection.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Hook to protect routes requiring login
export function useAuthProtection() {
  const { requireAuth, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      requireAuth();
    }
  }, [isLoading, requireAuth]);
  
  return { isLoading };
}

// Hook to protect admin-only routes
export function useAdminProtection() {
  const { requireAdmin, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      requireAdmin();
    }
  }, [isLoading, requireAdmin]);
  
  return { isLoading };
}

// Hook to protect dashboard routes
export function useDashboardProtection() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && (!session || !session.user.isAllowedDashboard)) {
      router.push("/unauthorized");
    }
  }, [isLoading, session, router]);
  
  return { isLoading };
}