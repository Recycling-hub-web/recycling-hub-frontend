import type { Metadata } from 'next';

import { getDictionary } from '../../../lib/dictionary';
import { UnauthorizedView } from './UnauthorizedView';

export const metadata: Metadata = {
  title: 'Access Denied — Recycling Hub',
  description: "You don't have access to this page.",
};

export default function UnauthorizedPage() {
  const { auth } = getDictionary('en');
  return <UnauthorizedView t={auth.unauthorized} />;
}
