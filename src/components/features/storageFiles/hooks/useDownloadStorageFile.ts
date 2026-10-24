import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { requestPresignedDownload } from '../services/storageFileService';

/** Requests a time-limited presigned GET URL, then opens it — the
 * browser handles the actual download/view against storage directly. */
const useDownloadStorageFile = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (fileKey: string) => {
    setLoading(true);
    try {
      const { download_url: downloadUrl } =
        await requestPresignedDownload(fileKey);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      throw err instanceof ApiError
        ? err
        : new ApiError(500, null, 'Could not generate a download link.');
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDownloadStorageFile };
