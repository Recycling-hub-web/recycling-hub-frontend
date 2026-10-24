import { useState } from 'react';

import { updateContactMessageStatus } from '../services/contactService';
import type { ContactMessageStatus } from '../types';

const useUpdateContactStatus = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (id: string, status: ContactMessageStatus) => {
    setLoading(true);
    try {
      return await updateContactMessageStatus(id, status);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateContactStatus };
