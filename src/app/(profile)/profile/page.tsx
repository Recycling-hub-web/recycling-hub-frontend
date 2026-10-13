import type { Metadata } from 'next';

import { ProfileView } from '../../../components/features/profile/components';

export const metadata: Metadata = {
  title: 'My Profile — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileView />;
}
