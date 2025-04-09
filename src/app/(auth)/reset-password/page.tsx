// app/auth/reset-password/page.tsx
import ResetPasswordForm from '@/app/components/organisms/reset_password-form';
import React from 'react';

export const metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your account',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}