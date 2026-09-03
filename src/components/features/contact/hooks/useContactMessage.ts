import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { ContactMessage } from '../../../../types/contact';
import { getContactMessage } from '../services/contactService';

/** Fetches a single message's full detail — mirrors useUser's shape. */
const useContactMessage = (id: string) => {
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getContactMessage(id);
      setMessage(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load this message.',
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { message, loading, error, refetch };
};

export { useContactMessage };
