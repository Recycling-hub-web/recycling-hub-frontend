import { usePickupRequests } from '../../pickups/hooks';

/** Deliveries awaiting close — same `status: 'delivered'` scope
 * ReceivingDeliveriesView's own default filter already uses (see its
 * own docstring: the receiving officer's queryset is server-scoped to
 * only `delivered`/`closed` — see CollectionRequestViewSet.get_queryset).
 * Returns the fetched rows too, for the overview's own short preview
 * table — same data, no second fetch. */
const useReceivingOverviewStats = () => {
  const { requests, count, loading, error, refetch } = usePickupRequests({
    page: 1,
    status: 'delivered',
  });

  return {
    awaitingCloseCount: loading ? null : count,
    deliveries: requests,
    loading,
    error,
    refetch,
  };
};

export { useReceivingOverviewStats };
