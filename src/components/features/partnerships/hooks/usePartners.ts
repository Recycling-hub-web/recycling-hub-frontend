import { useCallback, useEffect, useRef, useState } from 'react';

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

  const requestGeneration = useRef(0);

  const refetch = useCallback(async () => {
    requestGeneration.current += 1;
    const generation = requestGeneration.current;
    setLoading(true);
    setError('');
    try {
      const data = await listPartners({
        page,
        partnershipType,
        isActive,
        search,
      });
      if (generation !== requestGeneration.current) return;
      setPartners(data.results);
      setCount(data.count);
    } catch (err) {
      if (generation !== requestGeneration.current) return;
      setError(
        err instanceof ApiError ? err.message : 'Could not load partners.',
      );
    } finally {
      if (generation === requestGeneration.current) setLoading(false);
    }
  }, [page, partnershipType, isActive, search]);

  useEffect(() => {
    refetch();
    return () => {
      requestGeneration.current += 1;
    };
  }, [refetch]);

  return { partners, count, loading, error, refetch };
};

export { usePartners };
