// src/components/wrappers/server-protected-route.tsx

import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ServerProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireDashboardAccess?: boolean;
}

export default async function ServerProtectedRoute({
  children,
  requireAdmin = false,
  requireDashboardAccess = false,
}: ServerProtectedRouteProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  if (requireAdmin && user.role !== "admin") {
    redirect("/unauthorized");
  }

  if (requireDashboardAccess && !user.isAllowedDashboard) {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}