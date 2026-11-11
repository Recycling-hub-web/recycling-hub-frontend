import { OrderRedirect } from '../../../../../components/features/pickups/components';

/** Orders live on their pickup request's page — see OrderRedirect. */
export default function AdminOrderPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <OrderRedirect
      orderId={params.requestId}
      requestsBasePath="/admin/pickup-requests"
    />
  );
}
