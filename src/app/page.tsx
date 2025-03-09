// src/app/page.tsx
import Link from "next/link";
import AuthStatus from "@/components/AuthStatus";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">NextAuth Demo App</h1>
          <AuthStatus />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Public Content Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
            <div className="p-5">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Public Content</h2>
              <p className="text-gray-700 mb-4">
                Content that's available to everyone, whether signed in or not.
              </p>
              <Link
                href="/public-content"
                className="bg-green-600 text-white inline-flex items-center px-4 py-2 rounded hover:bg-green-700"
              >
                View Public Content
              </Link>
            </div>
          </div>

          {/* Protected Content Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
            <div className="p-5">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Protected Content</h2>
              <p className="text-gray-700 mb-4">
                Content that requires authentication to view. You'll need to sign in first.
              </p>
              <Link
                href="/protected-content"
                className="bg-purple-600 text-white inline-flex items-center px-4 py-2 rounded hover:bg-purple-700"
              >
                View Protected Content
              </Link>
            </div>
          </div>

          {/* Dashboard Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
            <div className="p-5">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">User Dashboard</h2>
              <p className="text-gray-700 mb-4">
                A protected dashboard showing your user profile and account details.
              </p>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white inline-flex items-center px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Authentication Testing Guide</h2>
          <p className="mb-4">
            This application demonstrates NextAuth.js authentication with Google OAuth. Here's how to test it:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Try accessing the Protected Content while signed out - you'll be redirected to sign in</li>
            <li>Sign in with Google to access protected pages</li>
            <li>Notice how public content is accessible regardless of authentication status</li>
            <li>Sign out to test the authentication flow again</li>
          </ol>
        </div>
      </div>
    </main>
  );
}