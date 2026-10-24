import { useState } from 'react';

import type { UpdateVehiclePayload } from '../services/vehiclesService';
import { updateVehicle } from '../services/vehiclesService';

const useUpdateVehicle = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: UpdateVehiclePayload) => {
    setLoading(true);
    try {
      return await updateVehicle(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateVehicle };
