'use client';

import { useEffect, useState } from 'react';
import { LuUpload } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import {
  useDeleteStorageFile,
  useDownloadStorageFile,
  useStorageFiles,
} from '../hooks';
import type { StorageFile } from '../types';
import { StorageFileTable } from './StorageFileTable';
import { UploadFileModal } from './UploadFileModal';

const SEARCH_DEBOUNCE_MS = 350;

type StorageFilesViewProps = {
  basePath: '/admin/storage-files' | '/staff/storage-files';
};

/** One list view shared by /admin/storage-files and /staff/storage-files
 * — same data, same table. Admin and staff have identical permissions
 * here (FileRecordViewSet + IsAdminOrStaffUser), so no canDelete prop. */
const StorageFilesView = ({ basePath }: StorageFilesViewProps) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<StorageFile | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { files, count, loading, error, refetch } = useStorageFiles({
    page,
    search: search || undefined,
  });
  const { execute: deleteFile, loading: deleting } = useDeleteStorageFile();
  const { execute: downloadFile } = useDownloadStorageFile();

  const handleUploaded = () => {
    toast.success('File uploaded');
    setPage(1);
    refetch();
  };

  const handleDownload = async (file: StorageFile) => {
    try {
      await downloadFile(file.file_key);
    } catch (err) {
      toast.error(
        'Could not download this file',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteFile(pendingDelete.uid);
      toast.success(
        'File deleted',
        `${pendingDelete.original_name} has been removed.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not delete the file',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Storage Files"
        subtitle="Every file uploaded through the presigned-URL flow."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <LuUpload className="mr-1.5 size-4" />
            Upload file
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by file name…"
          className="sm:max-w-xs"
        />
      </div>

      <StorageFileTable
        files={files}
        count={count}
        page={page}
        onPageChange={setPage}
        search={search}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath={basePath}
        onDownloadRequest={handleDownload}
        onDeleteRequest={setPendingDelete}
      />

      <UploadFileModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={handleUploaded}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete file"
        message={`This removes "${pendingDelete?.original_name}" from storage and deletes its record. This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { StorageFilesView };
