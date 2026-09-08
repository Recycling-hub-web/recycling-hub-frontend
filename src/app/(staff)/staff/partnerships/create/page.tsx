import type { Metadata } from 'next';

import { CreatePartnerView } from '../../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'New Partner — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function CreatePartnerPage() {
  return <CreatePartnerView basePath="/staff/partnerships" />;
}
