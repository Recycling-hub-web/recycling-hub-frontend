import { ApiError, apiFetch } from '../../../../lib/api';
import type { PresignedUpload, StorageFile } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListStorageFilesParams = {
  page?: number;
  /** DRF's SearchFilter — matches original_name or file_key
   * (FileRecordViewSet.search_fields). */
  search?: string;
};

const listStorageFiles = ({
  page = 1,
  search,
}: ListStorageFilesParams = {}): Promise<Paginated<StorageFile>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set('search', search);
  return apiFetch(`/storage/files/?${params.toString()}`);
};

const getStorageFile = (uid: string): Promise<StorageFile> =>
  apiFetch(`/storage/files/${uid}/`);

// Soft in name only — the backend deletes the object from S3 first and
// only removes the FileRecord if that succeeds (FileRecordViewSet.
// perform_destroy), so a storage-side failure surfaces as a real error
// here rather than silently leaving an orphaned record.
const deleteStorageFile = (uid: string): Promise<void> =>
  apiFetch(`/storage/files/${uid}/`, { method: 'DELETE' });

type PresignedUploadRequest = {
  file_name: string;
  content_type: string;
  file_type: string;
};

// Step 1 of the upload flow — ask our API for a presigned POST target.
// This also creates the FileRecord row server-side (PresignedUploadUrlView),
// marked is_confirmed=False until the direct-to-storage upload below
// actually completes.
const requestPresignedUploads = (
  files: PresignedUploadRequest[],
): Promise<{ uploads: PresignedUpload[] }> =>
  apiFetch('/storage/presigned-upload-urls', {
    method: 'POST',
    json: { files },
  });

// Step 2 — upload the actual bytes straight to storage using the fields
// from step 1. This goes to `upload_url` (DigitalOcean Spaces/S3), not
// our own API — plain fetch, not apiFetch, since it's a different origin
// with no auth cookie and a multipart body, not JSON.
const uploadToPresignedUrl = async (
  upload: PresignedUpload,
  file: File,
): Promise<void> => {
  const formData = new FormData();
  Object.entries(upload.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  // The file field must be appended last — S3-compatible presigned POST
  // policies read form fields in order and expect the file part at the end.
  formData.append('file', file);

  const response = await fetch(upload.upload_url, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new ApiError(
      response.status,
      null,
      'Upload to storage failed. Please try again.',
    );
  }
};

const requestPresignedDownload = (
  fileKey: string,
): Promise<{ download_url: string; file_key: string; expires_in: number }> =>
  apiFetch('/storage/presigned-download-url', {
    method: 'POST',
    json: { file_key: fileKey },
  });

export {
  deleteStorageFile,
  getStorageFile,
  listStorageFiles,
  requestPresignedDownload,
  requestPresignedUploads,
  uploadToPresignedUrl,
};
export type { ListStorageFilesParams, Paginated, PresignedUploadRequest };
