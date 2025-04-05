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

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <FormContent>
        <FormTitle title="Sign In" />
        <FormWrapper
          onSubmit={(e) => {
            e.preventDefault();
            handleGoogleSignIn();
          }}
        >
          <InputGroup>
            <Button
              type="submit"
              variant="secondary"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Loading..." : "Sign in with Google"}
            </Button>
          </InputGroup>
        </FormWrapper>
      </FormContent>
      <FormFooter variant="login" />
    </>
  );
}
