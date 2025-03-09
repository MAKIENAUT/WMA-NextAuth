// src/app/protected-content/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProtectedContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/protected-content");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // This prevents flash of content before redirect
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-medium">{session.user?.name}</span>
          </div>
        </div>
        
        <div className="bg-purple-100 border border-purple-200 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-4">Protected Content</h1>
          <p className="text-purple-700 mb-4">
            Welcome to the protected content area! This page is only accessible to authenticated users.
            If you're seeing this, it means you've successfully signed in.
          </p>
          
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h2 className="text-xl font-semibold mb-2">Your Account Information</h2>
            <ul className="space-y-2">
              <li><strong>Name:</strong> {session.user?.name}</li>
              <li><strong>Email:</strong> {session.user?.email}</li>
              <li><strong>Session Expires:</strong> {session.expires ? new Date(session.expires).toLocaleString() : 'Unknown'}</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Exclusive Content</h2>
            <p className="mb-2">This could be your application's premium features:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dashboard with analytics</li>
              <li>Personalized recommendations</li>
              <li>User settings and preferences</li>
              <li>Saved items or favorites</li>
              <li>Premium downloads or resources</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Testing Authentication</h2>
          <p className="mb-4">
            You can test the authentication flow by signing out and trying to access this page again.
            You should be redirected to the sign-in page.
          </p>
          <div className="flex gap-3">
            <Link 
              href="/auth/signout" 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </Link>
            <Link 
              href="/public-content" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Public Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}