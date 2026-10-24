import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreatePartnerPayload } from '../services/partnershipService';
import { createPartner } from '../services/partnershipService';

const useCreatePartner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreatePartnerPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createPartner(payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create the partner.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreatePartner };
