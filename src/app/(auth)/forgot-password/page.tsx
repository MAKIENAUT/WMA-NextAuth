
import ForgotPasswordForm from "@/app/components/organisms/forgot_password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | WMA",
  description: "",
};

export default function LoginPage() {
  return <ForgotPasswordForm />;
}
