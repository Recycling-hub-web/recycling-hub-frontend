import type { Metadata } from 'next';

import { UnauthorizedView } from '../../../components/features/auth/components';

export const metadata: Metadata = {
  title: 'Access Denied — Recycling Hub',
  description: "You don't have access to this page.",
};

export default function UnauthorizedPage() {
  return <UnauthorizedView />;
}
