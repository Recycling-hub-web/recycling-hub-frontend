import type { Metadata } from 'next';

import { ContactMessageDetailsView } from '../../../../../components/features/contact/components';

export const metadata: Metadata = {
  title: 'Contact Message — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffContactMessagePage({
  params,
}: {
  params: { messageId: string };
}) {
  return (
    <ContactMessageDetailsView
      messageId={params.messageId}
      basePath="/staff/contact"
      canDelete={false}
    />
  );
}
