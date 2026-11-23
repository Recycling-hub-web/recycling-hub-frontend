import type { Metadata } from 'next';

import { ForgotPasswordView } from '../../../components/features/auth/components';

export const metadata: Metadata = {
  title: 'Forgot Password — Recycling Hub',
  description: 'Request a password reset link for your Recycling Hub account.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
