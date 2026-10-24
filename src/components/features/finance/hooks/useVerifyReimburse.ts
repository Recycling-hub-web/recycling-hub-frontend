import { useState } from 'react';

import { verifyAndReimburse } from '../services/financeService';

/** Accounting/admin/staff's Verify & Reimburse — one id or many at once
 * (bulk pay-back), same single action either way. `proof`, if given,
 * applies to every id in this call. */
const useVerifyReimburse = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (ids: string[], proof?: string) => {
    setLoading(true);
    try {
      return await verifyAndReimburse(ids, proof);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useVerifyReimburse };
