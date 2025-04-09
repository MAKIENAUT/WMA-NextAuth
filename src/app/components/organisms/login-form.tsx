"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/app/components/atoms/ui/button";
import FormContent from "@/app/components/molecules/form-content";
import FormTitle from "@/app/components/molecules/form-title";
import FormWrapper from "@/app/components/molecules/form-wrapper";
import InputGroup from "@/app/components/molecules/input-group";
import FormFooter from "@/app/components/molecules/form-footer";
import { Input } from "@/app/components/atoms/ui/input";
import { Label } from "@/app/components/atoms/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  // In the handleCredentialsSignIn function in login-form.tsx
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Extract the actual error message from the error string
        const errorMessage = result.error.replace("Error: ", "");
        setError(errorMessage || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 px-4 overflow-y-auto">
      <div className="mb-4 text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
      <FormContent>
        <FormTitle title="Sign In" />
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <FormWrapper onSubmit={handleCredentialsSignIn}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <div className="text-right mb-4">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <InputGroup>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </InputGroup>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                OR
              </span>
            </div>
          </div>

          <InputGroup>
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading}
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              {isLoading ? "Loading..." : "Sign in with Google"}
            </Button>
          </InputGroup>
        </FormWrapper>
      </FormContent>
      <FormFooter variant="login" />
    </div>
  );
}
