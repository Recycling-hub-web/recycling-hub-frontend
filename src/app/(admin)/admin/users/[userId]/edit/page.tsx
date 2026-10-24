import type { Metadata } from 'next';

import { EditUserView } from '../../../../../../components/features/users/components';

export const metadata: Metadata = {
  title: 'Edit User — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function EditUserPage({
  params,
}: {
  params: { userId: string };
}) {
  return <EditUserView userId={params.userId} />;
}
