// src/components/templates/protected-page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import LoadingSpinner from "@/components/atoms/loading-spinner";

interface ProtectedPageProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireDashboardAccess?: boolean;
}

export default function ProtectedPage({
  children,
  requireAdmin = false,
  requireDashboardAccess = false,
}: ProtectedPageProps) {
  const { session, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (requireAdmin && session?.user?.role !== "admin") {
      router.push("/unauthorized");
      return;
    }

    if (requireDashboardAccess && !session?.user?.isAllowedDashboard) {
      router.push("/unauthorized");
      return;
    }
  }, [status, session, router, requireAdmin, requireDashboardAccess]);

  if (status === "loading") {
    // return <LoadingSpinner />;
    return <p>Loading...</p>;
  }

  // Only render children if all conditions are met
  if (
    status === "authenticated" &&
    (!requireAdmin || session?.user?.role === "admin") &&
    (!requireDashboardAccess || session?.user?.isAllowedDashboard)
  ) {
    return <>{children}</>;
  }

  return null;
}
