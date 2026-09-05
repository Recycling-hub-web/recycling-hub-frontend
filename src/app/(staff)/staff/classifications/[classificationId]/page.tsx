import type { Metadata } from 'next';

import { ClassificationDetailsView } from '../../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'Classification — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffClassificationPage({
  params,
}: {
  params: { classificationId: string };
}) {
  return (
    <ClassificationDetailsView
      classificationId={params.classificationId}
      basePath="/staff/classifications"
    />
  );
}
