import { useState } from 'react';

import { rejectClaim } from '../services/claimsService';

/** Accounting/admin's Reject action — rejection_reason is required (see
 * claimsService.rejectClaim). */
const useRejectClaim = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, rejectionReason: string) => {
    setLoading(true);
    try {
      return await rejectClaim(id, rejectionReason);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useRejectClaim };
