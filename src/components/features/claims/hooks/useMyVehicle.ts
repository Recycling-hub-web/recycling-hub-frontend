import { useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { getMyVehicle } from '../services/claimsService';
import type { Vehicle } from '../types';

/** The driver's own assigned vehicle (GET /claims/vehicles/mine/),
 * used by ClaimForm to branch the petrol claim fields: loading ->
 * blocked-no-vehicle -> fleet-card-blocked -> normal. A 404 is the
 * expected "no vehicle assigned" state, not a failure — it's surfaced
 * via `hasNoVehicle`, never `error`. Only petrol claims need this; tool
 * claims don't call it at all. */
const useMyVehicle = () => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasNoVehicle, setHasNoVehicle] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setHasNoVehicle(false);

    getMyVehicle()
      .then((data) => {
        if (!active) return;
        setVehicle(data);
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError && err.status === 404) {
          setHasNoVehicle(true);
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : 'Could not load your assigned vehicle.',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { vehicle, loading, error, hasNoVehicle };
};

export { useMyVehicle };
