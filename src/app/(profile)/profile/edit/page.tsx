import type { Metadata } from 'next';

import { EditProfileView } from '../../../../components/features/profile/components';

export const metadata: Metadata = {
  title: 'Edit Profile — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function EditProfilePage() {
  return <EditProfileView />;
}
