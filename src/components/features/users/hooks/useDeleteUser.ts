import { useState } from 'react';

import { deleteUser } from '../services/userService';

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteUser(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteUser };
