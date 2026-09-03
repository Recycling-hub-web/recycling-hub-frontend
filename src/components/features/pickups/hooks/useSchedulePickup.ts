import { useState } from 'react';

import type { SchedulePickupPayload } from '../services/pickupService';
import { schedulePickupRequest } from '../services/pickupService';

const useSchedulePickup = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: SchedulePickupPayload) => {
    setLoading(true);
    try {
      return await schedulePickupRequest(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useSchedulePickup };
