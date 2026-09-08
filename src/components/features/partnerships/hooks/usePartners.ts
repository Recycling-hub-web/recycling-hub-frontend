import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { listPartners } from '../services/partnershipService';
import type { Partner, PartnershipType } from '../types';

type UsePartnersParams = {
  page: number;
  partnershipType?: PartnershipType | '';
  isActive?: 'true' | 'false';
  search?: string;
};

/** Fetches one page of partners — mirrors useCategories' shape. */
const usePartners = ({
  page,
  partnershipType,
  isActive,
  search,
}: UsePartnersParams) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listPartners({
        page,
        partnershipType,
        isActive,
        search,
      });
      setPartners(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load partners.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, partnershipType, isActive, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { partners, count, loading, error, refetch };
};

export { usePartners };
