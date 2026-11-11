import { useState } from 'react';

import type { EvaluateRequestPayload } from '../services/pickupService';
import { evaluateWholeRequest } from '../services/pickupService';

/** POST /pickup-requests/{id}/evaluate/ — see RequestEvaluateModal. */
const useEvaluateWholeRequest = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (
    pickupRequestId: string,
    payload: EvaluateRequestPayload,
  ) => {
    setLoading(true);
    try {
      return await evaluateWholeRequest(pickupRequestId, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useEvaluateWholeRequest };
