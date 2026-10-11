import type { Metadata } from 'next';

import { ContactMessageDetailsView } from '../../../../../components/features/contact/components';

export const metadata: Metadata = {
  title: 'Contact Message — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminContactMessagePage({
  params,
}: {
  params: { messageId: string };
}) {
  return (
    <ContactMessageDetailsView
      messageId={params.messageId}
      basePath="/super-admin/contact"
      canDelete
    />
  );
}
