import { useState } from 'react';

import { verifyAndReimburse } from '../services/financeService';

/** Accounting/admin's Verify & Reimburse — one id or many at once (bulk
 * pay-back), same single action either way. */
const useVerifyReimburse = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (ids: string[]) => {
    setLoading(true);
    try {
      return await verifyAndReimburse(ids);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useVerifyReimburse };
