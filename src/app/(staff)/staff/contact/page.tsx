import type { Metadata } from 'next';

import { ContactMessagesView } from '../../../../components/features/contact/components';

export const metadata: Metadata = {
  title: 'Contact Messages — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffContactPage() {
  return <ContactMessagesView basePath="/staff/contact" canDelete={false} />;
}
