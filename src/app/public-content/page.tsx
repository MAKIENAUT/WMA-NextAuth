// src/app/public-content/page.tsx
import Link from "next/link";
import AuthStatus from "@/components/AuthStatus";

export default function PublicContent() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
          <AuthStatus />
        </div>
        
        <div className="bg-green-100 border border-green-200 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-4">Public Content</h1>
          <p className="text-green-700 mb-4">
            This page is accessible to all visitors, whether they are logged in or not.
            You can use this pattern for landing pages, about pages, or any content you want
            everyone to see.
          </p>
          <div className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Example Public Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Company information</li>
              <li>Public documentation</li>
              <li>Product descriptions</li>
              <li>Pricing details</li>
              <li>Contact information</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Want to see protected content?</h2>
          <p className="mb-4">
            Check out our <Link href="/protected-content" className="text-blue-600 hover:underline font-medium">protected content</Link> page to see
            how authentication works. You'll need to sign in to view it.
          </p>
        </div>
      </div>
    </div>
  );
}