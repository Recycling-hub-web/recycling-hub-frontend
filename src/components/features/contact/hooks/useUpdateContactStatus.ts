import { useState } from 'react';

import type { ContactMessageStatus } from '../../../../types/contact';
import { updateContactMessageStatus } from '../services/contactService';

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
