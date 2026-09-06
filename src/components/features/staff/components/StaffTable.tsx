'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuPencil, LuTrash2, LuUser } from 'react-icons/lu';

import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import type { StaffListItem } from '../types';

const PAGE_SIZE = 12;

type StaffTableProps = {
  staff: StaffListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onDeleteRequest: (member: StaffListItem) => void;
};

/** Pure presentational — every value it renders is a prop. Admin only
 * (this endpoint's create/update/delete are all IsAdminUser — see
 * StaffManagementView.get_permissions), so no basePath/canDelete split
 * like the shared admin+staff tables elsewhere in this codebase. */
const StaffTable = ({
  staff,
  count,
  page,
  onPageChange,
  loading,
  error,
  onRetry,
  onDeleteRequest,
}: StaffTableProps) => {
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
    if (staff.length === 0) {
      return <TableEmptyRow colSpan={columnCount} title="No staff found" />;
    }
    return staff.map((member) => (
      <tr
        key={member.id}
        onClick={() => router.push(`/admin/staff/${member.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="max-w-[240px] px-6 py-4 font-medium text-slate-900">
          <Link
            href={`/admin/staff/${member.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2.5 truncate hover:text-brand-600 hover:underline"
          >
            {member.user.profile_photo?.public_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
              <img
                src={member.user.profile_photo.public_url}
                alt=""
                className="size-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <LuUser className="size-4" />
              </span>
            )}
            <span className="truncate">{member.user.full_name}</span>
          </Link>
        </td>
        <td className="px-6 py-4 text-slate-500">{member.employee_id}</td>
        <td className="max-w-[160px] truncate px-6 py-4 text-slate-500">
          {member.department || '—'}
        </td>
        <td className="max-w-[160px] truncate px-6 py-4 text-slate-500">
          {member.position || '—'}
        </td>
        <td className="max-w-[160px] truncate px-6 py-4 text-slate-500">
          {member.branch || '—'}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/admin/staff/${member.id}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${member.user.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`/admin/staff/${member.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Edit ${member.user.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(member);
              }}
              aria-label={`Delete ${member.user.full_name}`}
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
          itemCount={staff.length}
          totalCount={count}
          itemLabel="staff"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Employee ID
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Department
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Position
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Branch
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

export { PAGE_SIZE, StaffTable };
