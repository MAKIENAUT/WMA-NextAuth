// app/auth/signin/page.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/app/components/organisms/login-form";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  return (
    <>
      {resetSuccess && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          <h3 className="font-medium">Password Reset Successful!</h3>
          <p className="text-sm mt-1">
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
        </div>
      )}
      <LoginForm />
    </>
  );
}