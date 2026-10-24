import type { Metadata } from 'next';

import { EditContactMessageView } from '../../../../../../components/features/contact/components';

export const metadata: Metadata = {
  title: 'Edit Contact Message — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminEditContactMessagePage({
  params,
}: {
  params: { messageId: string };
}) {
  return (
    <EditContactMessageView
      messageId={params.messageId}
      basePath="/super-admin/contact"
    />
  );
}
