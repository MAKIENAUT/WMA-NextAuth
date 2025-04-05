
import LoginForm from "@/app/components/organisms/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | WMA",
  description: "",
};

export default function LoginPage() {
  return <LoginForm />;
}
