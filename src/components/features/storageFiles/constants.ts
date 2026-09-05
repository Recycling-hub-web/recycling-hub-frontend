/** Bytes -> "1.2 MB"-style label. No shared formatter exists elsewhere in
 * the codebase yet — kept local to this feature until a second module
 * needs it. */
const formatFileSize = (bytes: number | null): string => {
  if (bytes === null || bytes === undefined) return '—';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
};

// Maps a picked File's MIME type to one of PresignedUploadUrlView's
// accepted `file_type` values (apps/storage/serializers.py's
// DEFAULT_FILE_TYPE_CONFIG) — determines the storage folder, allowed
// types, and max size on the backend.
const inferFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (
    mimeType === 'application/msword' ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'document';
  }
  return 'file';
};

const FILE_TYPE_LABELS: Record<string, string> = {
  image: 'Image',
  video: 'Video',
  pdf: 'PDF',
  document: 'Document',
  thumbnail: 'Thumbnail',
  file: 'File',
};

export { FILE_TYPE_LABELS, formatFileSize, inferFileType };
