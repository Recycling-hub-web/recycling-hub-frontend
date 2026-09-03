import type { Metadata } from 'next';

import { ContactMessagesView } from '../../../../components/features/contact/components';

export const metadata: Metadata = {
  title: 'Contact Messages — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminContactPage() {
  return <ContactMessagesView basePath="/admin/contact" canDelete />;
}
