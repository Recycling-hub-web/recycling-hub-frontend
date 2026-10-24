import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { CreateOrderPayload } from '../services/pickupService';
import { createOrder } from '../services/pickupService';

/** Admin/staff creating an Order under an existing PickupRequest — see
 * CreateOrderView. Up to 7 Orders per request (hard block past that). */
const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (
    pickupRequestId: string,
    payload: CreateOrderPayload,
  ) => {
    setLoading(true);
    setError('');
    try {
      return await createOrder(pickupRequestId, payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create this order.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateOrder };
