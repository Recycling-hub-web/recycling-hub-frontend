import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { UpdatePartnerPayload } from '../services/partnershipService';
import { updatePartner } from '../services/partnershipService';

const useUpdatePartner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (id: string, payload: UpdatePartnerPayload) => {
    setLoading(true);
    setError('');
    try {
      return await updatePartner(id, payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not save this partner.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useUpdatePartner };
