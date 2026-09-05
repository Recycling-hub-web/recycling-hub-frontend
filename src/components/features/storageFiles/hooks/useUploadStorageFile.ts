import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { inferFileType } from '../constants';
import {
  requestPresignedUploads,
  uploadToPresignedUrl,
} from '../services/storageFileService';

/** Runs the full two-step upload flow for one picked File: ask the API
 * for a presigned POST target (which also creates the FileRecord row),
 * then upload the bytes straight to storage with it. */
const useUploadStorageFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (file: File) => {
    setLoading(true);
    setError('');
    try {
      const { uploads } = await requestPresignedUploads([
        {
          file_name: file.name,
          content_type: file.type || 'application/octet-stream',
          file_type: inferFileType(file.type),
        },
      ]);
      const [upload] = uploads;
      if (!upload) {
        throw new ApiError(500, null, 'Could not start the upload.');
      }
      await uploadToPresignedUrl(upload, file);
      return upload;
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not upload the file.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useUploadStorageFile };
