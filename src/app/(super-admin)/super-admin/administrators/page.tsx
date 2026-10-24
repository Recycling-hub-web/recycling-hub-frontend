import type { Metadata } from 'next';

import { SuperAdminAdministratorsView } from '../../../../components/features/users/components';

export const metadata: Metadata = {
  title: 'Administrators — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminAdministratorsPage() {
  return <SuperAdminAdministratorsView />;
}
