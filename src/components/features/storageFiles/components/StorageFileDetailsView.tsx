'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuDownload,
  LuFile,
  LuFileText,
  LuFileVideo,
  LuHardDrive,
  LuImage,
  LuKey,
  LuTrash2,
  LuUser,
} from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import type { DropdownItem } from '../../../ui/buttons/ActionsDropdown';
import { ActionsDropdown } from '../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { FILE_TYPE_LABELS, formatFileSize } from '../constants';
import {
  useDeleteStorageFile,
  useDownloadStorageFile,
  useStorageFile,
} from '../hooks';

const FILE_TYPE_ICONS: Record<string, typeof LuFile> = {
  image: LuImage,
  thumbnail: LuImage,
  video: LuFileVideo,
  pdf: LuFileText,
  document: LuFileText,
  file: LuFile,
};

type StorageFileDetailsViewProps = {
  fileId: string;
  basePath: '/admin/storage-files' | '/staff/storage-files';
};

const StorageFileDetailsView = ({
  fileId,
  basePath,
}: StorageFileDetailsViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { file, loading, error, refetch } = useStorageFile(fileId);
  const { execute: deleteFile, loading: deleting } = useDeleteStorageFile();
  const { execute: downloadFile } = useDownloadStorageFile();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDownload = async () => {
    if (!file) return;
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
    if (!file) return;
    try {
      await deleteFile(file.uid);
      toast.success('File deleted', `${file.original_name} has been removed.`);
      router.push(basePath);
    } catch (err) {
      toast.error(
        'Could not delete the file',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  if (loading) return <Loading text="Loading file…" />;

  if (error || !file) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'File not found.'}{' '}
        <button
          type="button"
          onClick={refetch}
          className="font-semibold underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const Icon = FILE_TYPE_ICONS[file.file_type] ?? LuFile;

  const actionItems: DropdownItem[] = [
    {
      label: 'Download',
      icon: LuDownload,
      onClick: handleDownload,
      color: 'info',
    },
    {
      label: 'Delete',
      icon: LuTrash2,
      onClick: () => setConfirmOpen(true),
      color: 'danger',
    },
  ];

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to files
      </Link>

      <PageHeader
        icon={<Icon className="size-5" />}
        title={file.original_name}
        subtitle={FILE_TYPE_LABELS[file.file_type] ?? file.file_type}
        actions={<ActionsDropdown items={actionItems} />}
      />

      <div className="mb-5">
        <StatusBadge variant={file.is_confirmed ? 'success' : 'attention'}>
          {file.is_confirmed ? 'Upload confirmed' : 'Upload unconfirmed'}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuHardDrive className="size-4" />}
            label="Size"
            value={formatFileSize(file.file_size)}
          />
          <InfoRow
            icon={<LuKey className="size-4" />}
            label="Storage key"
            value={file.file_key}
          />
          <InfoRow
            icon={<LuUser className="size-4" />}
            label="Uploaded by"
            value={
              file.uploader?.full_name || file.uploader?.email || 'Unknown'
            }
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label="Uploaded"
            value={<AppDate value={file.created_at} format="long" />}
          />
        </div>
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete file"
        message={`This removes "${file.original_name}" from storage and deletes its record. This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { StorageFileDetailsView };
