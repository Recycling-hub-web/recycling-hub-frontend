import type { Metadata } from 'next';

import { UnauthorizedView } from '../../../components/features/auth/components';
import { getDictionary } from '../../../lib/dictionary';

export const metadata: Metadata = {
  title: 'Access Denied — Recycling Hub',
  description: "You don't have access to this page.",
};

export default function UnauthorizedPage() {
  const { auth } = getDictionary('en');
  return <UnauthorizedView t={auth.unauthorized} />;
}
