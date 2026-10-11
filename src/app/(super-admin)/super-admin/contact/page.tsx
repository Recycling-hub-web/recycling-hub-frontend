import type { Metadata } from 'next';

import { ContactMessagesView } from '../../../../components/features/contact/components';

export const metadata: Metadata = {
  title: 'Contact Messages — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminContactPage() {
  return <ContactMessagesView basePath="/super-admin/contact" canDelete />;
}
