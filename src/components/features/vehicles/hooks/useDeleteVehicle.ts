import { useState } from 'react';

import { deleteVehicle } from '../services/vehiclesService';

const useDeleteVehicle = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteVehicle(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteVehicle };
