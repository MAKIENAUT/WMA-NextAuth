// src/providers/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthProvider as CustomAuthProvider } from "@/context/AuthContext";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CustomAuthProvider>{children}</CustomAuthProvider>
    </SessionProvider>
  );
}

// Keep named export for backward compatibility
export { AuthProvider };