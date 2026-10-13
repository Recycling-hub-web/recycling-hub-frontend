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
  /** Bytes — signed into the upload URL, so storage rejects any other size. */
  file_size: number;
};

// Step 1 of the upload flow — ask our API for a presigned PUT URL.
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

// Step 2 — send the file's bytes straight to storage with a plain PUT to
// the presigned `upload_url` from step 1 (any S3-compatible store: Google
// Cloud Storage, Cloudflare R2, DigitalOcean Spaces, AWS…), not through
// our own API — plain fetch, not apiFetch, since it's a different origin
// with no auth cookie. `upload.headers` (Content-Type, and x-amz-acl if
// the server uses per-object ACLs) are part of the signature, so they're
// sent exactly as given; the browser sets Content-Length from the file,
// which matches the signed size from step 1.
const uploadToPresignedUrl = async (
  upload: PresignedUpload,
  file: File,
): Promise<void> => {
  const response = await fetch(upload.upload_url, {
    method: upload.method,
    headers: upload.headers,
    body: file,
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
