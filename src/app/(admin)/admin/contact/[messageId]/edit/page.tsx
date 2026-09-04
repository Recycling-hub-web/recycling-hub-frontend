import type { Metadata } from 'next';

import { EditContactMessageView } from '../../../../../../components/features/contact/components';

export const metadata: Metadata = {
  title: 'Edit Contact Message — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminEditContactMessagePage({
  params,
}: {
  params: { messageId: string };
}) {
  return (
    <EditContactMessageView
      messageId={params.messageId}
      basePath="/admin/contact"
    />
  );
}
