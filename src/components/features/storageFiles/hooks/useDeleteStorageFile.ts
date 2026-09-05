import { useState } from 'react';

import { deleteStorageFile } from '../services/storageFileService';

const useDeleteStorageFile = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (uid: string) => {
    setLoading(true);
    try {
      await deleteStorageFile(uid);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteStorageFile };
