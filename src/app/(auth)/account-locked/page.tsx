import type { Metadata } from 'next';

import { AccountLockedView } from '../../../components/features/auth/components';
import { getDictionary } from '../../../lib/dictionary';

export const metadata: Metadata = {
  title: 'Account Locked — Recycling Hub',
  description: 'This account is temporarily locked.',
};

export default function AccountLockedPage() {
  const { auth } = getDictionary('en');
  return <AccountLockedView t={auth.accountLocked} />;
}
