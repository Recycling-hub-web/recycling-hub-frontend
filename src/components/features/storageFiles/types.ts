// Mirrors apps.storage.serializers.FileRecordSerializer — entirely
// read-only from this feature's side except for delete, since a
// FileRecord is only ever created by the presigned-upload flow itself.
type FileUploader = {
  id: string;
  email: string;
  full_name: string;
  role: string;
};

type StorageFile = {
  uid: string;
  original_name: string;
  file_key: string;
  file_size: number | null;
  content_type: string;
  file_type: string;
  uploader: FileUploader | null;
  is_confirmed: boolean;
  created_at: string;
  public_url: string | null;
};

// One entry of the presigned-upload-urls response (PresignedUploadUrlView).
type PresignedUpload = {
  upload_url: string;
  fields: Record<string, string>;
  file_key: string;
  public_url: string;
  expires_in: number;
};

export type { FileUploader, PresignedUpload, StorageFile };
