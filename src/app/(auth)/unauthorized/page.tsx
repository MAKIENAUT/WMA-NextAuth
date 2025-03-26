// src/app/unauthorized/page.tsx
"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/app/components/atoms/ui/button";
import FormContent from "@/app/components/molecules/form-content";
import FormTitle from "@/app/components/molecules/form-title";
import InputGroup from "@/app/components/molecules/input-group";
import FormFooter from "@/app/components/molecules/form-footer";
import FormWrapper from '@/app/components/molecules/form-wrapper';

export default function Unauthorized() {
  const { data: session } = useSession();

  return (
    <>
      <FormContent>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <FormTitle title="Access Denied" />
          <p className="text-gray-600 mt-2">
            {session?.user?.email ? (
              <>Your email <span className="font-medium">{session.user.email}</span> is not authorized to access the dashboard.</>
            ) : (
              <>You do not have permission to access this page.</>
            )}
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Dashboard access is restricted to specific email addresses. If you believe this is a mistake, please contact an administrator.
              </p>
            </div>
          </div>
        </div>

        <FormWrapper>
          <InputGroup>
            <Button
              asChild
              variant="default"
              className="w-full"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </InputGroup>
          <InputGroup>
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/signout">Sign Out</Link>
            </Button>
          </InputGroup>
        </FormWrapper>
      </FormContent>
      <FormFooter variant="login" />
    </>
  );
}