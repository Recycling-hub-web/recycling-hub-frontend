import type { Metadata } from 'next';

import { getDictionary } from '../../../lib/dictionary';
import { ForgotPasswordView } from './_components/ForgotPasswordView';

export const metadata: Metadata = {
  title: 'Forgot Password — Recycling Hub',
  description: 'Request a password reset link for your Recycling Hub account.',
};

export default function ForgotPasswordPage() {
  const { auth } = getDictionary('en');
  return <ForgotPasswordView t={auth.forgotPassword} />;
}
