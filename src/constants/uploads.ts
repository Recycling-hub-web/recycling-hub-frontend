type AllowedFileTypes = {
  mimeTypes: string[];
  extensions: string[];
  label: string;
};

// Generic document upload config (PDF + images) for the upload fields in
// components/form/upload/. Backend-agnostic — these fields take an
// `uploadHandler`/`onFileChange` prop, they don't call any API themselves.
const ALLOWED_FILE_TYPES: AllowedFileTypes = {
  mimeTypes: ['application/pdf', 'image/png', 'image/jpeg'],
  extensions: ['.pdf', '.png', '.jpg', '.jpeg'],
  label: 'PDF, JPG, or PNG',
};

export { ALLOWED_FILE_TYPES };
export type { AllowedFileTypes };
