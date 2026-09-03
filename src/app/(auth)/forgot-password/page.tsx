import type { Metadata } from 'next';

import { ForgotPasswordView } from '../../../components/features/auth/components';
import { getDictionary } from '../../../lib/dictionary';

export const metadata: Metadata = {
  title: 'Forgot Password — Recycling Hub',
  description: 'Request a password reset link for your Recycling Hub account.',
};

export default function ForgotPasswordPage() {
  const { auth } = getDictionary('en');
  return <ForgotPasswordView t={auth.forgotPassword} />;
}
