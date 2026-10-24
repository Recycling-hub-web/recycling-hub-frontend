import type { Metadata } from 'next';

import { StorageFilesView } from '../../../../components/features/storageFiles/components';

export const metadata: Metadata = {
  title: 'Storage Files — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffStorageFilesPage() {
  return <StorageFilesView basePath="/staff/storage-files" />;
}
