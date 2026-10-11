import type { Metadata } from 'next';

import { EditClassificationView } from '../../../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'Edit Classification — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminEditClassificationPage({
  params,
}: {
  params: { classificationId: string };
}) {
  return (
    <EditClassificationView
      classificationId={params.classificationId}
      basePath="/super-admin/classifications"
    />
  );
}
