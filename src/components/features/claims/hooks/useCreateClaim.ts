import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreateClaimPayload } from '../services/claimsService';
import { createClaim } from '../services/claimsService';

const useCreateClaim = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: CreateClaimPayload) => {
    setLoading(true);
    setError('');
    try {
      return await createClaim(payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not submit the claim.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateClaim };
