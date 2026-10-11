import type { Metadata } from 'next';

import { ClassificationDetailsView } from '../../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'Classification — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminClassificationPage({
  params,
}: {
  params: { classificationId: string };
}) {
  return (
    <ClassificationDetailsView
      classificationId={params.classificationId}
      basePath="/super-admin/classifications"
    />
  );
}
