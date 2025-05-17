"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/ui/button";
import FormContent from "@/components/molecules/form-content";
import FormTitle from "@/components/molecules/form-title";
import FormWrapper from "@/components/molecules/form-wrapper";
import InputGroup from "@/components/molecules/input-group";
import FormFooter from "@/components/molecules/form-footer";
import { Input } from "@/components/atoms/ui/input";
import { Label } from "@/components/atoms/ui/label";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/reset-password?token=${token}&email=${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (response.ok && data.valid) {
          setTokenValid(true);
          setAttemptsLeft(data.attemptsLeft);
        } else {
          setError(data.error || "Invalid reset link");
        }
      } catch (err) {
        setError("Failed to validate reset token");
        console.error(err);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
      );
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      router.push("/signin?reset=success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      console.error("Password reset error:", err);
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="w-full max-w-md mx-auto py-4 px-4 overflow-y-auto">
        <FormContent>
          <FormTitle title="Validating Reset Link" />
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </FormContent>
      </div>
    );
  }

  if (!tokenValid || !token || !email) {
    return (
      <div className="w-full max-w-md mx-auto py-4 px-4 overflow-y-auto">
        <FormContent>
          <FormTitle title="Invalid Reset Link" />
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            <p>
              {error || "This password reset link is invalid or has expired."}
            </p>
            <p className="mt-2">
              Please{" "}
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                request a new password reset
              </Link>
              .
            </p>
          </div>
        </FormContent>
      </div>
    );
  }

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
        <FormTitle title="Reset Password" />

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <FormWrapper onSubmit={handleSubmit}>
          <p className="text-sm text-muted-foreground mb-2">
            Enter your new password below.
          </p>

          {attemptsLeft < 3 && (
            <div className="mb-4 p-2 bg-amber-50 text-amber-700 rounded-md text-sm">
              <p>
                You have {attemptsLeft}{" "}
                {attemptsLeft === 1 ? "attempt" : "attempts"} remaining.
              </p>
            </div>
          )}

          <InputGroup>
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters and contain at least one
              uppercase letter, one lowercase letter, one number, and one
              special character (@$!%*?&).
            </p>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto p-4">Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}