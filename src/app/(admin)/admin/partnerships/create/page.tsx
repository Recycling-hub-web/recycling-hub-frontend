import type { Metadata } from 'next';

import { CreatePartnerView } from '../../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'New Partner — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function CreatePartnerPage() {
  return <CreatePartnerView basePath="/admin/partnerships" />;
}
