import type { Metadata } from 'next';

import { StorageFilesView } from '../../../../components/features/storageFiles/components';

export const metadata: Metadata = {
  title: 'Storage Files — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminStorageFilesPage() {
  return <StorageFilesView basePath="/super-admin/storage-files" />;
}
