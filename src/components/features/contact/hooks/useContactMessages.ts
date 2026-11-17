import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listContactMessages } from '../services/contactService';
import type { ContactMessage, ContactMessageStatus } from '../types';

type UseContactMessagesParams = {
  page: number;
  status?: ContactMessageStatus;
  search?: string;
};

/** Fetches one page of the contact inbox — the single fetch
 * ContactMessageTable/the list view render from, not re-fetched per
 * widget. Mirrors useUsers' shape exactly. */
const useContactMessages = ({
  page,
  status,
  search,
}: UseContactMessagesParams) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    setLoading(true);
    setError('');
    try {
      const data = await listContactMessages({ page, status, search });
      if (generation !== requestGeneration.current) return;
      setMessages(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError ? err.message : 'Could not load messages.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { messages, count, loading, error, refetch };
};

export { useContactMessages };
