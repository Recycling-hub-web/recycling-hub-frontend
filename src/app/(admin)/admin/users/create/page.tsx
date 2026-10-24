import type { Metadata } from 'next';

import { CreateUserView } from '../../../../../components/features/users/components';

export const metadata: Metadata = {
  title: 'Create User — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function CreateUserPage() {
  return <CreateUserView />;
}
