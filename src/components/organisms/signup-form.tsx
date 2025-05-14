"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/ui/button";
import FormContent from "@/components/molecules/form-content";
import FormTitle from "@/components/molecules/form-title";
import FormWrapper from "@/components/molecules/form-wrapper";
import InputGroup from "@/components/molecules/input-group";
import FormFooter from "@/components/molecules/form-footer";
import { Input } from "@/components/atoms/ui/input";
import { Label } from "@/components/atoms/ui/label";
import { Checkbox } from "@/components/atoms/ui/checkbox";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    acceptTerms: false,
  });
  const [error, setError] = useState("");

  // Password regex pattern
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const sendOtp = async () => {
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send OTP");
      }

      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
      console.error("OTP sending error:", err);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid OTP");
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
      console.error("OTP verification error:", err);
      return false;
    }
  };

  const registerUser = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          emailVerified: true, // Set to true after successful OTP verification
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      console.error("Registration error:", err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match!");
        setIsLoading(false);
        return;
      }

      // Validate password against regex pattern
      if (!passwordRegex.test(formData.password)) {
        setError(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
        );
        setIsLoading(false);
        return;
      }

      if (!formData.acceptTerms) {
        setError("You must accept the terms and conditions");
        setIsLoading(false);
        return;
      }

      // First step - submit form data and send OTP
      if (step === "form") {
        await sendOtp();
      }
      // Second step - verify OTP and register user
      else if (step === "otp") {
        const isOtpValid = await verifyOtp();
        if (!isOtpValid) return;

        const isRegistered = await registerUser();
        if (isRegistered) {
          router.push("/");
        }
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
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
      <FormContent>
        <FormTitle
          title={step === "form" ? "Create Account" : "Verify Email"}
        />
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
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
                  Password must be at least 8 characters and contain at least
                  one uppercase letter, one lowercase letter, one number, and
                  one special character (@$!%*?&).
                </p>
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
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
