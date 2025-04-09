"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/atoms/ui/button";
import FormContent from "@/app/components/molecules/form-content";
import FormTitle from "@/app/components/molecules/form-title";
import FormWrapper from "@/app/components/molecules/form-wrapper";
import InputGroup from "@/app/components/molecules/input-group";
import FormFooter from "@/app/components/molecules/form-footer";
import { Input } from "@/app/components/atoms/ui/input";
import { Label } from "@/app/components/atoms/ui/label";
import Link from "next/link";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      // Redirect to login page with success message
      router.push('/signin?reset=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Password reset error:', err);
      setIsLoading(false);
    }
  };

  // Handle invalid or missing token/email
  if (!token || !email) {
    return (
      <div className="w-full max-w-md mx-auto py-4 px-4 overflow-y-auto">
        <FormContent>
          <FormTitle title="Invalid Reset Link" />
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            <p>This password reset link is invalid or has expired.</p>
            <p className="mt-2">
              Please <Link href="/forgot-password" className="text-primary hover:underline">request a new password reset</Link>.
            </p>
          </div>
        </FormContent>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-4 px-4 overflow-y-auto">
      <div className="mb-4 text-center">
        <Link href="/signin" className="text-sm text-muted-foreground hover:underline">
          ← Back to Sign In
        </Link>
      </div>
      <FormContent>
        <FormTitle title="Reset Password" />
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <FormWrapper onSubmit={handleSubmit}>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your new password below.
          </p>
          
          <InputGroup>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </InputGroup>
        </FormWrapper>
      </FormContent>
      <FormFooter variant="login" />
    </div>
  );
}