import { useState } from 'react';

import type { UpdateContactMessagePayload } from '../services/contactService';
import { updateContactMessage } from '../services/contactService';

const useUpdateContactMessage = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, payload: UpdateContactMessagePayload) => {
    setLoading(true);
    try {
      return await updateContactMessage(id, payload);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateContactMessage };
