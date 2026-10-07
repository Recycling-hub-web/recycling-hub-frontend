import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { uploadToPresignedUrl } from '../../storageFiles/services/storageFileService';
import { requestPickupPhotoUploadUrl } from '../services/pickupService';

/** Same two-step presigned-upload flow as useUploadStorageFile, but
 * through the pickups-specific, AllowAny endpoint (see
 * pickupService.requestPickupPhotoUploadUrl) — the public pickup form's
 * photo field has no logged-in user to authenticate. */
const usePickupPhotoUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (file: File) => {
    setLoading(true);
    setError('');
    try {
      const { uploads } = await requestPickupPhotoUploadUrl(
        file.name,
        file.type || 'image/jpeg',
      );
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

export { usePickupPhotoUpload };
