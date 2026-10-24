import { useState } from 'react';

import type { AssignDriverPayload } from '../services/pickupService';
import { assignDriverToRequest } from '../services/pickupService';

const useAssignDriver = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: AssignDriverPayload) => {
    setLoading(true);
    try {
      return await assignDriverToRequest(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useAssignDriver };
