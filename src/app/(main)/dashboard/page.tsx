// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Protected Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {session?.user?.name}!</h2>
        <p className="text-gray-700">This page is only accessible to authenticated users.</p>
        <div className="mt-4">
          <h3 className="text-xl font-medium mb-2">Your Profile Information:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Email: {session?.user?.email}</li>
            {session?.user?.image && (
              <li>
                <div className="mt-2">
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full"
                  />
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}