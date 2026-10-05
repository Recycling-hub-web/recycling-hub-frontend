'use client';

import Link from 'next/link';
import { LuCheck, LuMessageCircle, LuPhoneCall } from 'react-icons/lu';

import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { AppDate } from '../../../ui/date/AppDate';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../ui/table';
import {
  QUICK_REQUEST_STATUS_BADGE_VARIANT,
  REQUEST_TYPE_BADGE_VARIANT,
} from '../constants';
import {
  PICKUP_QUICK_REQUEST_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  type PickupQuickRequestListItem,
} from '../types';

type QuickLeadTableProps = {
  leads: PickupQuickRequestListItem[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** Base route this table's "Follow up" links point into —
   * /admin/pickups or /staff/pickups, same as PickupRequestTable. */
  basePath: string;
  onMarkContacted: (lead: PickupQuickRequestListItem) => void;
  markingContactedId: string | null;
};

const columnCount = 5;

// wa.me only accepts digits (no "+", spaces, or dashes) — stored numbers
// are already a plain "+<dialcode><number>" string (see joinPhoneNumber),
// but this strips defensively in case of any other formatting.
const whatsAppLink = (phoneNumber: string) =>
  `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;

/** Pure presentational — the Quick Leads tab on PickupRequestsView. No
 * pagination yet (see useQuickPickupRequests — small-volume queue to
 * start). "Follow up" opens the existing create form prefilled with
 * this lead's type+phone (CreatePickupRequestView's `leadId` param). */
const QuickLeadTable = ({
  leads,
  loading,
  error,
  onRetry,
  basePath,
  onMarkContacted,
  markingContactedId,
}: QuickLeadTableProps) => {
  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error)
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={onRetry}
        />
      );
    if (leads.length === 0) {
      return <TableEmptyRow colSpan={columnCount} title="No quick leads yet" />;
    }
    return leads.map((lead) => (
      <tr key={lead.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">
          <a
            href={whatsAppLink(lead.phone_number)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Message ${lead.phone_number} on WhatsApp`}
            className="inline-flex items-center gap-1.5 text-slate-900 transition hover:text-brand-600"
          >
            <LuMessageCircle className="size-4 shrink-0 text-brand-600" />
            {lead.phone_number}
          </a>
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={REQUEST_TYPE_BADGE_VARIANT[lead.request_type]}>
            {PICKUP_REQUEST_TYPE_LABELS[lead.request_type]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          <StatusBadge
            variant={QUICK_REQUEST_STATUS_BADGE_VARIANT[lead.status]}
          >
            {PICKUP_QUICK_REQUEST_STATUS_LABELS[lead.status]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4 text-slate-500">
          <AppDate value={lead.created_at} format="short" />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            {lead.status === 'converted' ? (
              lead.collection_request && (
                <Link
                  href={`${basePath}/${lead.collection_request}`}
                  className="text-sm font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700"
                >
                  View request
                </Link>
              )
            ) : (
              <>
                {lead.status === 'new' && (
                  <button
                    type="button"
                    onClick={() => onMarkContacted(lead)}
                    disabled={markingContactedId === lead.id}
                    aria-label={`Mark lead from ${lead.phone_number} as contacted`}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LuCheck className="size-4" />
                    Mark contacted
                  </button>
                )}
                <Link
                  href={`${basePath}/create?leadId=${lead.id}`}
                  aria-label={`Follow up on lead from ${lead.phone_number}`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
                >
                  <LuPhoneCall className="size-4" />
                  Follow up
                </Link>
              </>
            )}
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <TableWrapper>
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Phone
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Type
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Created
            </th>
            <th className="px-6 py-3 text-right font-semibold text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
      </table>
    </TableWrapper>
  );
};

export { QuickLeadTable };
