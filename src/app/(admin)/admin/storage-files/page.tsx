import type { Metadata } from 'next';

import { StorageFilesView } from '../../../../components/features/storageFiles/components';

export const metadata: Metadata = {
  title: 'Storage Files — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminStorageFilesPage() {
  return <StorageFilesView basePath="/admin/storage-files" />;
}
