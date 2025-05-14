// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (provider: string, options?: any) => Promise<any>;
  signOut: () => Promise<any>;
  requireAuth: () => boolean;
  requireAdmin: () => boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  const requireAuth = () => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return false;
    }
    return true;
  };

  const requireAdmin = () => {
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/unauthorized");
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        status,
        signIn,
        signOut,
        requireAuth,
        requireAdmin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}