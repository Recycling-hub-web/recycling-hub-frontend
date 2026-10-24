import { useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { VehiclePayload } from '../services/vehiclesService';
import { createVehicle } from '../services/vehiclesService';

const useCreateVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = async (payload: VehiclePayload) => {
    setLoading(true);
    setError('');
    try {
      return await createVehicle(payload);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not create the vehicle.',
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export { useCreateVehicle };
