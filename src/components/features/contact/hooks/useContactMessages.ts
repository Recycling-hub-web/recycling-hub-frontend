import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type {
  ContactMessage,
  ContactMessageStatus,
} from '../../../../types/contact';
import { listContactMessages } from '../services/contactService';

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

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listContactMessages({ page, status, search });
      setMessages(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load messages.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { messages, count, loading, error, refetch };
};

export { useContactMessages };
