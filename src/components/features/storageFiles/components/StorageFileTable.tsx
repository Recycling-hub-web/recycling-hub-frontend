'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LuDownload,
  LuEye,
  LuFile,
  LuFileText,
  LuFileVideo,
  LuImage,
  LuTrash2,
} from 'react-icons/lu';

import { AppDate } from '../../../ui/date/AppDate';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import { FILE_TYPE_LABELS, formatFileSize } from '../constants';
import type { StorageFile } from '../types';

const PAGE_SIZE = 12;

const FILE_TYPE_ICONS: Record<string, typeof LuFile> = {
  image: LuImage,
  thumbnail: LuImage,
  video: LuFileVideo,
  pdf: LuFileText,
  document: LuFileText,
  file: LuFile,
};

type StorageFileTableProps = {
  files: StorageFile[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** /admin/storage-files or /staff/storage-files — one component
   * serves both role areas, same as every other table this session. */
  basePath: string;
  onDownloadRequest: (file: StorageFile) => void;
  onDeleteRequest: (file: StorageFile) => void;
};

/** Pure presentational — every value it renders is a prop. Admin and
 * staff have identical permissions here (FileRecordViewSet +
 * IsAdminOrStaffUser), so no canDelete gate. No Edit action — nothing on
 * a FileRecord is user-editable after upload. */
const StorageFileTable = ({
  files,
  count,
  page,
  onPageChange,
  search,
  loading,
  error,
  onRetry,
  basePath,
  onDownloadRequest,
  onDeleteRequest,
}: StorageFileTableProps) => {
  const router = useRouter();
  const columnCount = 6;

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error)
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={onRetry}
        />
      );
    if (files.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No files found"
          subtitle={search ? `No matches for "${search}".` : undefined}
        />
      );
    }
    return files.map((f) => {
      const Icon = FILE_TYPE_ICONS[f.file_type] ?? LuFile;
      return (
        <tr
          key={f.uid}
          onClick={() => router.push(`${basePath}/${f.uid}`)}
          className="cursor-pointer transition-colors hover:bg-slate-50"
        >
          <td className="max-w-[260px] px-6 py-4 font-medium text-slate-900">
            <Link
              href={`${basePath}/${f.uid}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 truncate hover:text-brand-600 hover:underline"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon className="size-4" />
              </span>
              <span className="truncate">{f.original_name}</span>
            </Link>
          </td>
          <td className="px-6 py-4 text-slate-500">
            {FILE_TYPE_LABELS[f.file_type] ?? f.file_type}
          </td>
          <td className="px-6 py-4 text-slate-500">
            {formatFileSize(f.file_size)}
          </td>
          <td className="max-w-[160px] truncate px-6 py-4 text-slate-500">
            {f.uploader?.full_name || f.uploader?.email || '—'}
          </td>
          <td className="px-6 py-4 text-slate-500">
            <AppDate value={f.created_at} format="short" />
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`${basePath}/${f.uid}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`View file ${f.original_name}`}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <LuEye className="size-4" />
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadRequest(f);
                }}
                aria-label={`Download file ${f.original_name}`}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <LuDownload className="size-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRequest(f);
                }}
                aria-label={`Delete file ${f.original_name}`}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <LuTrash2 className="size-4" />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <TableWrapper
      footer={
        <TablePagination
          currentPage={page}
          onPageChange={onPageChange}
          itemsPerPage={PAGE_SIZE}
          itemCount={files.length}
          totalCount={count}
          itemLabel="files"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Type
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Size
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Uploaded by
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Uploaded
            </th>
            <th className="px-6 py-3 text-right font-semibold text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
      </table>
    </TableWrapper>
  );
};

export { PAGE_SIZE, StorageFileTable };
