'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LuCheck,
  LuEye,
  LuPhoneCall,
  LuUserRoundSearch,
  LuX,
} from 'react-icons/lu';

import { ApiError } from '../../../../../lib/api';
import { StatusBadge } from '../../../../ui/badges/StatusBadge';
import { AppDate } from '../../../../ui/date/AppDate';
import { ConfirmModal } from '../../../../ui/modal/ConfirmModal';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../../ui/table';
import { useToast } from '../../../../ui/toast/ToastContext';
import { WhatsAppLink } from '../../../../ui/WhatsAppLink';
import {
  QUICK_REQUEST_STATUS_BADGE_VARIANT,
  REQUEST_TYPE_BADGE_VARIANT,
} from '../../constants';
import { cancelQuickPickupRequest } from '../../services/pickupService';
import {
  PICKUP_QUICK_REQUEST_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  type PickupQuickRequestListItem,
} from '../../types';

type QuickLeadTableProps = {
  leads: PickupQuickRequestListItem[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** Base route this table's "Follow up" links point into —
   * /super-admin/pickups or /staff/pickups, same as PickupRequestTable. */
  basePath: string;
  onMarkContacted: (lead: PickupQuickRequestListItem) => void;
  markingContactedId: string | null;
};

const columnCount = 5;

// wa.me only accepts digits (no "+", spaces, or dashes) — stored numbers
// are already a plain "+<dialcode><number>" string (see joinPhoneNumber),
// but this strips defensively in case of any other formatting.
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
  const toast = useToast();
  const [cancellingLead, setCancellingLead] =
    useState<PickupQuickRequestListItem | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const handleCancelLead = async () => {
    if (!cancellingLead || cancelling) return;
    setCancelling(true);
    try {
      await cancelQuickPickupRequest(cancellingLead.id);
      toast.success('Lead cancelled');
      setCancellingLead(null);
      onRetry();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'Could not cancel this lead',
      );
    } finally {
      setCancelling(false);
    }
  };

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
      return (
        <TableEmptyRow
          colSpan={columnCount}
          icon={<LuUserRoundSearch className="size-6" />}
          title="No quick leads yet"
          subtitle="Quick callback requests from the website will show up here."
        />
      );
    }
    return leads.map((lead) => (
      <tr key={lead.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">
          <WhatsAppLink
            phoneNumber={lead.phone_number}
            className="text-slate-900"
          />
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
            {lead.status === 'converted'
              ? lead.collection_request && (
                  <Link
                    href={`${basePath}/${lead.collection_request}`}
                    aria-label="View request"
                    className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <LuEye className="size-4" />
                  </Link>
                )
              : lead.status !== 'cancelled' && (
                  <>
                    {lead.status === 'new' && (
                      <button
                        type="button"
                        onClick={() => onMarkContacted(lead)}
                        disabled={markingContactedId === lead.id}
                        aria-label={`Mark lead from ${lead.phone_number} as contacted`}
                        className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <LuCheck className="size-4" />
                      </button>
                    )}
                    <Link
                      href={`${basePath}/create?leadId=${lead.id}`}
                      aria-label={`Follow up on lead from ${lead.phone_number}`}
                      className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                    >
                      <LuPhoneCall className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setCancellingLead(lead)}
                      aria-label={`Cancel lead from ${lead.phone_number}`}
                      className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <LuX className="size-4" />
                    </button>
                  </>
                )}
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <ConfirmModal
        open={!!cancellingLead}
        onClose={() => {
          if (!cancelling) setCancellingLead(null);
        }}
        onConfirm={handleCancelLead}
        title="Cancel quick lead"
        message={`Cancel the lead from ${cancellingLead?.phone_number ?? ''}? It will remain visible, but cannot be contacted or converted.`}
        confirmText="Cancel lead"
        cancelText="Keep lead"
        loading={cancelling}
      />
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
    </>
  );
};

export { QuickLeadTable };
