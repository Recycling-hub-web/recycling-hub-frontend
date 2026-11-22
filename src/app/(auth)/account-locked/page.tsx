import type { Metadata } from 'next';

import { AccountLockedView } from '../../../components/features/auth/components';

export const metadata: Metadata = {
  title: 'Account Locked — Recycling Hub',
  description: 'This account is temporarily locked.',
};

export default function AccountLockedPage() {
  return <AccountLockedView />;
}
