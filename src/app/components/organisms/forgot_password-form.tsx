"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/atoms/ui/button";
import FormContent from "@/app/components/molecules/form-content";
import FormTitle from "@/app/components/molecules/form-title";
import FormWrapper from "@/app/components/molecules/form-wrapper";
import InputGroup from "@/app/components/molecules/input-group";
import FormFooter from "@/app/components/molecules/form-footer";
import { Input } from "@/app/components/atoms/ui/input";
import { Label } from "@/app/components/atoms/ui/label";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      console.error("Password reset request error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 px-4 overflow-y-auto">
      <div className="mb-4 text-center">
        <Link
          href="/signin"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Sign In
        </Link>
      </div>
      <FormContent>
        <FormTitle title="Forgot Password" />

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            <h3 className="font-medium">Recovery Options Sent!</h3>
            <p className="text-sm mt-1">
              If an account exists with the email {email}, we've sent you:
            </p>
            <ul className="text-sm mt-2 list-disc pl-5">
              <li>A password reset link</li>
              <li>A temporary password</li>
            </ul>
            <p className="text-sm mt-3">
              Please check your email and follow the instructions to regain
              access to your account.
            </p>
          </div>
        ) : (
          <FormWrapper onSubmit={handleSubmit}>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your email address below and we'll send you options to reset
              your password.
            </p>

            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </InputGroup>

            <InputGroup>
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send Recovery Options"}
              </Button>
            </InputGroup>
          </FormWrapper>
        )}
      </FormContent>
      <FormFooter variant="login" />
    </div>
  );
}
