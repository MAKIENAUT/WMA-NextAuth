// src/app/signup/page.tsx
import { Metadata } from "next";
import SignUpForm from "@/components/organisms/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | WMA",
  description: "Create your account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}