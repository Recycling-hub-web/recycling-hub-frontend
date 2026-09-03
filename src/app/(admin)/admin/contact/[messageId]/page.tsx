import type { Metadata } from 'next';

import { ContactMessageDetailsView } from '../../../../../components/features/contact/components';

export const metadata: Metadata = {
  title: 'Contact Message — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminContactMessagePage({
  params,
}: {
  params: { messageId: string };
}) {
  return (
    <ContactMessageDetailsView
      messageId={params.messageId}
      basePath="/admin/contact"
      canDelete
    />
  );
}
