// src/components/AuthStatus.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>
          Signed in as{" "}
          <span className="font-bold">{session.user?.email}</span>
        </p>
        <Link
          href="/auth/signout"
          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
          Sign out
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
    >
      Sign in
    </Link>
  );
}