import type { Metadata } from 'next';

import { BanksView } from '../../../../components/features/banks/components/BanksView';

export const metadata: Metadata = {
  title: 'Banks — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function BanksPage() {
  return <BanksView />;
}
