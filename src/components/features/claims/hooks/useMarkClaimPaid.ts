import { useState } from 'react';

import { markClaimPaid } from '../services/claimsService';

/** Accounting/admin's Mark as Paid action — no body. */
const useMarkClaimPaid = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      return await markClaimPaid(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useMarkClaimPaid };
