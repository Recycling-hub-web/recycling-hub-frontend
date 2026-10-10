'use client';

import Link from 'next/link';
import { LuPackageCheck } from 'react-icons/lu';

import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../ui/table';
import { STATUS_BADGE_VARIANT } from '../../pickups/constants';
import { PICKUP_STATUS_LABELS } from '../../pickups/types';
import { useReceivingOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

const PREVIEW_SIZE = 5;
const columnCount = 3;

/** Receiving Officer's own "what do I need to do today" — a stat tile
 * + a short preview table, both from the same `status: 'delivered'`
 * query ReceivingDeliveriesView's own default filter already uses (see
 * useReceivingOverviewStats). No verify/close action here — that
 * stays on the full Deliveries page; this is a glance, not a second
 * place to do the work. */
const ReceivingOverviewView = () => {
  const { awaitingCloseCount, deliveries, loading, error, refetch } =
    useReceivingOverviewStats();

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error)
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={refetch}
        />
      );
    if (deliveries.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="Nothing awaiting close right now"
        />
      );
    }
    return deliveries.slice(0, PREVIEW_SIZE).map((d) => (
      <tr key={d.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">{d.full_name}</td>
        <td className="px-6 py-4 text-slate-500">{d.category.name}</td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[d.status]}>
            {PICKUP_STATUS_LABELS[d.status]}
          </StatusBadge>
        </td>
      </tr>
    ));
  };

  return (
    <RoleOverviewLayout
      navItems={OPERATIONAL_ROLES.receiving_officer.navItems}
      ownHref="/receiving"
      statGrid={
        <OverviewStatGrid>
          <OverviewStatCard
            icon={LuPackageCheck}
            label="Awaiting close"
            value={awaitingCloseCount}
            href="/receiving/deliveries"
          />
        </OverviewStatGrid>
      }
      extra={
        (loading || deliveries.length > 0) && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Awaiting close
              </h2>
              <Link
                href="/receiving/deliveries"
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <TableWrapper>
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-500">
                      Requester
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-500">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {renderRows()}
                </tbody>
              </table>
            </TableWrapper>
          </div>
        )
      }
    />
  );
};

export { ReceivingOverviewView };
