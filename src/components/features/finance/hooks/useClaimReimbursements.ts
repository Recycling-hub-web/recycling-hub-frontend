import { useState } from 'react';

import { claimMyReimbursements } from '../services/financeService';

/** The driver's one-click bulk claim — see financeService.claimMyReimbursements. */
const useClaimReimbursements = () => {
  const [loading, setLoading] = useState(false);

  const execute = async () => {
    setLoading(true);
    try {
      return await claimMyReimbursements();
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useClaimReimbursements };
