'use client';

import {
  LuCalendar,
  LuChevronDown,
  LuPackage,
  LuTruck,
  LuUser,
  LuX,
} from 'react-icons/lu';

import { usePortalLocale } from '../../../../../contexts/PortalLocaleContext';
import { StatusBadge } from '../../../../ui/badges/StatusBadge';
import {
  ActionsDropdown,
  type DropdownItem,
} from '../../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../../ui/card/Card';
import { AppDate } from '../../../../ui/date/AppDate';
import { InfoRow } from '../../../../ui/InfoRow';
import { PICKUP_STAGE_BADGE_VARIANT } from '../../constants';
import {
  type CollectionRequestDetails,
  derivePickupStage,
  itemsSummary,
  PICKUP_STAGE_LABELS,
} from '../../types';
import { formatQuantity } from '../../units';
import { OrderRecordTabs } from '../shared/OrderRecordTabs';

type OrderAction = 'schedule' | 'collect' | 'cancel';

type RequestOrderCardProps = {
  order: CollectionRequestDetails;
  expanded: boolean;
  onToggle: () => void;
  /** One of the order's own actions was picked from its menu. */
  onAction: (action: OrderAction) => void;
  onChanged: () => void;
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mt-5 border-t border-slate-100 pt-5">
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
      {title}
    </p>
    {children}
  </div>
);

/** One order inside its pickup request's page — there is no separate
 * order page. Collapsed: code, materials, stage and price, plus the
 * order's own Actions (Schedule pickup, Mark as collected, Cancel order;
 * evaluation is per request). Expanded: the order's Overview, Documents,
 * Payment and Activity (OrderRecordTabs). */
const RequestOrderCard = ({
  order,
  expanded,
  onToggle,
  onAction,
  onChanged,
}: RequestOrderCardProps) => {
  const { t, locale } = usePortalLocale();
  const stage = derivePickupStage(order.status, order.evaluation_status);
  const actions: DropdownItem[] = [
    ...(order.status === 'pending' && order.evaluation_status === 'approved'
      ? [
          {
            label: t('Schedule pickup'),
            icon: LuTruck,
            onClick: () => onAction('schedule'),
            color: 'neutral' as const,
          },
        ]
      : []),
    ...(order.status === 'scheduled'
      ? [
          {
            label: t('Mark as collected'),
            icon: LuPackage,
            onClick: () => onAction('collect'),
            color: 'neutral' as const,
          },
        ]
      : []),
    ...(order.status === 'pending' || order.status === 'scheduled'
      ? [
          {
            label: t('Cancel order'),
            icon: LuX,
            onClick: () => onAction('cancel'),
            color: 'danger' as const,
          },
        ]
      : []),
  ];

  return (
    <Card id={`order-${order.id}`} className="overflow-hidden p-0">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-3 text-left"
        >
          <LuChevronDown
            className={`size-4 shrink-0 text-slate-400 transition-transform ${expanded ? '' : '-rotate-90'}`}
          />
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-neutral-950">
              {order.code}
            </span>
            <span className="block truncate text-sm text-slate-500">
              {itemsSummary(order.items, t) || t('No materials')}
              {order.price ? t(' · RM {value0}', { value0: order.price }) : ''}
            </span>
          </span>
          <StatusBadge variant={PICKUP_STAGE_BADGE_VARIANT[stage]}>
            {t(PICKUP_STAGE_LABELS[stage])}
          </StatusBadge>
        </button>
        {actions.length > 0 && (
          <ActionsDropdown label={t('Order actions')} items={actions} />
        )}
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-4 sm:p-5">
          <OrderRecordTabs
            order={order}
            onChanged={onChanged}
            overview={
              <Card className="p-5">
                <InfoRow
                  icon={<LuPackage className="size-4" />}
                  label={t('Materials')}
                  value={
                    order.items.length === 0 ? (
                      '—'
                    ) : (
                      <ul className="space-y-0.5">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.category.name}
                            {item.estimated_quantity
                              ? ` — ${formatQuantity(item.estimated_quantity, item.quantity_unit)}`
                              : ''}
                          </li>
                        ))}
                      </ul>
                    )
                  }
                />
                {order.note && (
                  <Section title={t('Note')}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                      {order.note}
                    </p>
                  </Section>
                )}
                {order.evaluation_status !== 'pending' && (
                  <Section title={t('Evaluation')}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {order.price && (
                        <InfoRow
                          icon={<LuPackage className="size-4" />}
                          label={t('Price')}
                          value={t('RM {value0}', { value0: order.price })}
                        />
                      )}
                      {order.evaluated_by && (
                        <InfoRow
                          icon={<LuUser className="size-4" />}
                          label={t('Evaluated by')}
                          value={order.evaluated_by}
                        />
                      )}
                      {order.evaluated_at && (
                        <InfoRow
                          icon={<LuCalendar className="size-4" />}
                          label={t('Evaluated at')}
                          value={
                            <AppDate
                              value={order.evaluated_at}
                              format="long"
                              locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
                            />
                          }
                        />
                      )}
                    </div>
                    {order.evaluation_note && (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                        {order.evaluation_note}
                      </p>
                    )}
                  </Section>
                )}
              </Card>
            }
          />
        </div>
      )}
    </Card>
  );
};

export { RequestOrderCard };
export type { OrderAction };
