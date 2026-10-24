import type { Metadata } from 'next';

import { StorageFileDetailsView } from '../../../../../components/features/storageFiles/components';

export const metadata: Metadata = {
  title: 'File — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminStorageFilePage({
  params,
}: {
  params: { fileId: string };
}) {
  return (
    <StorageFileDetailsView
      fileId={params.fileId}
      basePath="/admin/storage-files"
    />
  );
}
