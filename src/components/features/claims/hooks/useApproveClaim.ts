import { useState } from 'react';

import { approveClaim } from '../services/claimsService';

/** Accounting/admin's Approve action — `amountApproved` optional, omit
 * to approve at the claimed amount (see claimsService.approveClaim). */
const useApproveClaim = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, amountApproved?: number) => {
    setLoading(true);
    try {
      return await approveClaim(id, amountApproved);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useApproveClaim };
