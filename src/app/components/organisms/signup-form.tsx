// src/app/components/organisms/signup-form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/atoms/ui/button";
import FormContent from "@/app/components/molecules/form-content";
import FormTitle from "@/app/components/molecules/form-title";
import FormWrapper from "@/app/components/molecules/form-wrapper";
import InputGroup from "@/app/components/molecules/input-group";
import FormFooter from "@/app/components/molecules/form-footer";
import { Input } from "@/app/components/atoms/ui/input";
import { Label } from "@/app/components/atoms/ui/label";
import { Checkbox } from "@/app/components/atoms/ui/checkbox";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      if (!formData.acceptTerms) {
        alert("You must accept the terms and conditions");
        return;
      }

      // First step - submit form data to your API
      if (step === "form") {
        // Here you would typically call your API to send OTP
        console.log("Form data submitted:", formData);
        setStep("otp");
      }
      // Second step - verify OTP
      else if (step === "otp") {
        // Verify OTP with your backend
        console.log("OTP submitted:", formData.otp);
        // On success:
        router.push("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 px-4 overflow-y-auto max-h-screen">
      <div className="mb-4 text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back to Home
        </Link>
      </div>
      <FormContent>
        <FormTitle
          title={step === "form" ? "Create Account" : "Verify Email"}
        />
        <FormWrapper onSubmit={handleSubmit}>
          {step === "form" ? (
            <>
              <InputGroup>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

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

              <InputGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      acceptTerms: e.target.checked,
                    }))
                  }
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  I accept the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms and Conditions
                  </Link>
                </Label>
              </div>
            </>
          ) : (
            <InputGroup>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange}
                placeholder="6-digit code"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                We've sent a verification code to {formData.email}
              </p>
            </InputGroup>
          )}

          <InputGroup>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading
                ? "Loading..."
                : step === "form"
                  ? "Continue"
                  : "Verify & Sign Up"}
            </Button>
          </InputGroup>

          {step === "otp" && (
            <InputGroup>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("form")}
                className="w-full"
              >
                Back
              </Button>
            </InputGroup>
          )}
        </FormWrapper>
      </FormContent>
      <FormFooter variant="signup" />
    </div>
  );
}