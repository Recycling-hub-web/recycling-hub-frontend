import { useState } from 'react';

import type { ConfirmSchedulePayload } from '../services/pickupService';
import { confirmSchedule } from '../services/pickupService';

/** The assigned driver's explicit confirmation of an Order's pickup
 * time — see ConfirmScheduleModal. Only valid from `scheduled`, and
 * only by the assigned driver. */
const useConfirmSchedule = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: ConfirmSchedulePayload) => {
    setLoading(true);
    try {
      return await confirmSchedule(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useConfirmSchedule };
