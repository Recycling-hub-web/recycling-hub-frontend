import type { Metadata } from 'next';

import { EditPartnerView } from '../../../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'Edit Partner — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function EditPartnerPage({
  params,
}: {
  params: { partnerId: string };
}) {
  return (
    <EditPartnerView
      partnerId={params.partnerId}
      basePath="/admin/partnerships"
    />
  );
}
