import type { ReactNode } from 'react';

import { ProfileLayout } from '../../../layouts/ProfileLayout';

export default function ProfileSegmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
