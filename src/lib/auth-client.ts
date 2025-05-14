// src/lib/auth-client.ts
"use client";

import { signIn, signOut } from "next-auth/react";

export async function loginWithGoogle(callbackUrl = "/") {
  return signIn("google", { callbackUrl });
}

export async function loginWithCredentials(email: string, password: string, callbackUrl = "/") {
  return signIn("credentials", {
    email: email.trim().toLowerCase(),
    password,
    redirect: false,
    callbackUrl,
  });
}

export async function logout() {
  return signOut({ callbackUrl: "/" });
}