'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuCar, LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';

import { StatusBadge } from '../../../ui/badges/StatusBadge';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import {
  OWNERSHIP_LABELS,
  STATUS_BADGE_VARIANT,
  VEHICLE_TYPE_LABELS,
} from '../constants';
import type { Vehicle } from '../types';

const PAGE_SIZE = 12;

type VehicleTableProps = {
  vehicles: Vehicle[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** /admin/vehicles or /staff/vehicles — one component serves both role
   * areas, same as CategoryTable. */
  basePath: string;
  onDeleteRequest: (vehicle: Vehicle) => void;
};

/** Pure presentational — every value it renders is a prop. Same shape as
 * CategoryTable. Admin and staff have identical permissions on vehicles
 * (verified against VehicleViewSet.get_permissions), so there's no
 * canDelete gate — View/Edit/Delete always all render. */
const VehicleTable = ({
  vehicles,
  count,
  page,
  onPageChange,
  loading,
  error,
  onRetry,
  basePath,
  onDeleteRequest,
}: VehicleTableProps) => {
  const router = useRouter();
  const columnCount = 6;

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
    if (vehicles.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          icon={<LuCar className="size-6" />}
          title="No vehicles found"
          subtitle="Fleet vehicles you add will show up here."
        />
      );
    }
    return vehicles.map((v) => (
      <tr
        key={v.id}
        onClick={() => router.push(`${basePath}/${v.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="max-w-[160px] px-6 py-4 font-medium text-slate-900">
          <span className="truncate">{v.plate_number}</span>
        </td>
        <td className="px-6 py-4 text-slate-500">
          {VEHICLE_TYPE_LABELS[v.vehicle_type]}
        </td>
        <td className="px-6 py-4 text-slate-500">
          {OWNERSHIP_LABELS[v.ownership]}
        </td>
        <td className="max-w-[200px] truncate px-6 py-4 text-slate-500">
          {v.assigned_driver_name || 'Unassigned'}
        </td>
        <td className="px-6 py-4">
          <StatusBadge
            variant={STATUS_BADGE_VARIANT[v.is_active ? 'active' : 'inactive']}
          >
            {v.is_active ? 'Active' : 'Inactive'}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`${basePath}/${v.id}`}
              aria-label={`View vehicle ${v.plate_number}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`${basePath}/${v.id}/edit`}
              aria-label={`Edit vehicle ${v.plate_number}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDeleteRequest(v)}
              aria-label={`Delete vehicle ${v.plate_number}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <LuTrash2 className="size-4" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <TableWrapper
      footer={
        <TablePagination
          currentPage={page}
          onPageChange={onPageChange}
          itemsPerPage={PAGE_SIZE}
          itemCount={vehicles.length}
          totalCount={count}
          itemLabel="vehicles"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Plate number
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Type
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Ownership
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Assigned driver
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
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

export { PAGE_SIZE, VehicleTable };
