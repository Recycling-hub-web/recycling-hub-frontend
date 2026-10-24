import { useState } from 'react';

import { deleteContactMessage } from '../services/contactService';

const useDeleteContactMessage = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string) => {
    setLoading(true);
    try {
      await deleteContactMessage(id);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useDeleteContactMessage };
