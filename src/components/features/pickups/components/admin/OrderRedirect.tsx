'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Loading } from '../../../../ui/loading/Loading';
import { useOrder } from '../../hooks';

type OrderRedirectProps = {
  orderId: string;
  /** e.g. /admin/pickup-requests */
  requestsBasePath:
    | '/admin/pickup-requests'
    | '/staff/pickup-requests'
    | '/super-admin/pickup-requests';
};

/** There's no separate order page any more — an order lives on its
 * pickup request's page. Old order links (/…/pickups/{id}, notifications,
 * bookmarks) land here and are sent on to that page with the order open. */
const OrderRedirect = ({ orderId, requestsBasePath }: OrderRedirectProps) => {
  const router = useRouter();
  const { request: order, error } = useOrder(orderId);

  useEffect(() => {
    if (order) {
      router.replace(
        `${requestsBasePath}/${order.pickup_request.id}?order=${order.id}`,
      );
    }
  }, [order, requestsBasePath, router]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }
  return <Loading text="Opening order…" />;
};

export { OrderRedirect };
