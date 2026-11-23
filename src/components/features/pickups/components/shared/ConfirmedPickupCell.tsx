'use client';

import { LuCalendarCheck } from 'react-icons/lu';

import { usePortalLocale } from '../../../../../contexts/PortalLocaleContext';
import { AppDate } from '../../../../ui/date/AppDate';
import type { CollectionRequestListItem } from '../../types';

/** A table cell for an order's pickup time: the confirmed day and time
 * once confirmed (by the driver, or by admin/staff while assigning);
 * "Not confirmed" while a scheduled pickup is still waiting; "—"
 * otherwise. Shared by the driver's and the admin/staff order tables. */
const ConfirmedPickupCell = ({
  order,
}: {
  order: Pick<
    CollectionRequestListItem,
    'pickup_confirmed_at' | 'scheduled_at' | 'status'
  >;
}) => {
  const { t, locale } = usePortalLocale();
  if (order.pickup_confirmed_at && order.scheduled_at) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-700">
        <LuCalendarCheck className="size-4 shrink-0 text-brand-600" />
        <AppDate
          value={order.scheduled_at}
          format="datetime"
          locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
        />
      </span>
    );
  }
  if (order.status === 'scheduled') {
    return (
      <span className="whitespace-nowrap text-amber-700">
        {t('Not confirmed')}
      </span>
    );
  }
  return <span className="text-slate-600">—</span>;
};

export { ConfirmedPickupCell };
