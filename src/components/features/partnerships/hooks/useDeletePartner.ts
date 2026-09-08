import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { deletePartner } from '../services/partnershipService';

const useDeletePartner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      return await deletePartner(id);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not deactivate this partner.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useDeletePartner };
