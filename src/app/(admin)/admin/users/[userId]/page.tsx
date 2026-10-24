import type { Metadata } from 'next';

import { UserDetailsView } from '../../../../../components/features/users/components';

export const metadata: Metadata = {
  title: 'User Details — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function UserDetailsPage({
  params,
}: {
  params: { userId: string };
}) {
  return <UserDetailsView userId={params.userId} />;
}
