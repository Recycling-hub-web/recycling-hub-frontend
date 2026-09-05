import type { Metadata } from 'next';

import { StorageFileDetailsView } from '../../../../../components/features/storageFiles/components';

export const metadata: Metadata = {
  title: 'File — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffStorageFilePage({
  params,
}: {
  params: { fileId: string };
}) {
  return (
    <StorageFileDetailsView
      fileId={params.fileId}
      basePath="/staff/storage-files"
    />
  );
}
