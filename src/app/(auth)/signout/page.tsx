// src/app/signout/page.tsx
"use client";

import React from 'react';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/atoms/ui/button";
import FormContent from "@/app/components/molecules/form-content";
import FormTitle from "@/app/components/molecules/form-title";
import FormWrapper from "@/app/components/molecules/form-wrapper";
import InputGroup from "@/app/components/molecules/input-group";
import FormFooter from "@/app/components/molecules/form-footer";

export default function SignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormContent>
        <FormTitle title="Sign Out?" />
        <FormWrapper
          onSubmit={(e) => {
            e.preventDefault();
            handleSignOut();
          }}
        >
          <InputGroup>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Loading..." : "Sign Out"}
            </Button>
          </InputGroup>
          <InputGroup>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full"
            >
              Cancel
            </Button>
          </InputGroup>
        </FormWrapper>
      </FormContent>
      <FormFooter variant="login" />
    </>
  );
}