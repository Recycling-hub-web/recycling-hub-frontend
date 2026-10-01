'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuPencil, LuSend, LuTrash2 } from 'react-icons/lu';

import {
  ROLE_LABELS,
  type UserListItem,
  type UserRole,
} from '../../../../types/auth';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import {
  MAX_VERIFICATION_EMAILS,
  REGISTRATION_STATUS_BADGE_VARIANT,
  REGISTRATION_STATUS_LABELS,
  ROLE_BADGE_VARIANT,
} from '../constants';

const PAGE_SIZE = 12;

type UserTableProps = {
  users: UserListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  roleFilter: UserRole | '';
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onToggleActive: (user: UserListItem) => void;
  onDeleteRequest: (user: UserListItem) => void;
  /** Optional — StaffListView reuses this table but has no admin-only
   * resend-invite action wired up; the icon simply doesn't render for
   * callers that don't pass this. */
  onResendInvite?: (user: UserListItem) => void;
  /** Disables every row's resend button while a resend request is in
   * flight — the backend throttles this per user at 1/min, so without
   * this guard a double-click (or an impatient re-click when nothing
   * visibly happens) fires it twice and the second one gets a 429. */
  resendLoading?: boolean;
  /** 'pending' swaps Status/Registration for a Resends-used column and
   * always shows the Resend action — used for the Pending Registrations
   * tab, where every row is already known to be pending (so those two
   * columns would just repeat the same two badges on every row) and the
   * one genuinely useful extra fact is how close each row is to the
   * resend cap. Same table, same row logic — just a different column
   * set, not a second hand-built table. */
  variant?: 'default' | 'pending';
};

/** Pure presentational — every value it renders is a prop. Data fetching
 * and mutation calls live in the hooks (useUsers/useUpdateUser/
 * useDeleteUser), not here. */
const UserTable = ({
  users,
  count,
  page,
  onPageChange,
  roleFilter,
  search,
  loading,
  error,
  onRetry,
  onToggleActive,
  onDeleteRequest,
  onResendInvite,
  resendLoading = false,
  variant = 'default',
}: UserTableProps) => {
  const router = useRouter();
  const columnCount = variant === 'pending' ? 5 : 6;

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
    if (users.length === 0) {
      let emptySubtitle: string | undefined;
      if (search) {
        emptySubtitle = `No matches for "${search}".`;
      } else if (roleFilter) {
        emptySubtitle = 'Try a different filter.';
      }
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title={
            variant === 'pending'
              ? 'No pending registrations'
              : 'No users found'
          }
          subtitle={emptySubtitle}
        />
      );
    }
    return users.map((u) => (
      <tr
        key={u.id}
        onClick={() => router.push(`/admin/users/${u.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="px-6 py-4 font-medium text-slate-900">{u.full_name}</td>
        <td className="px-6 py-4 text-slate-500">{u.email}</td>
        <td className="px-6 py-4">
          <StatusBadge variant={ROLE_BADGE_VARIANT[u.role]}>
            {ROLE_LABELS[u.role]}
          </StatusBadge>
        </td>
        {variant === 'pending' ? (
          <td className="px-6 py-4 text-slate-500">
            {u.verification_emails_sent} of {MAX_VERIFICATION_EMAILS}
          </td>
        ) : (
          <>
            <td className="px-6 py-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive(u);
                }}
              >
                <StatusBadge variant={u.is_active ? 'success' : 'neutral'}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </StatusBadge>
              </button>
            </td>
            <td className="px-6 py-4">
              <StatusBadge
                variant={
                  REGISTRATION_STATUS_BADGE_VARIANT[u.registration_status]
                }
              >
                {REGISTRATION_STATUS_LABELS[u.registration_status]}
              </StatusBadge>
            </td>
          </>
        )}
        <td className="px-6 py-4">
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Resending only makes sense pre-verification — hidden for
             * verified/expired rows (an expired registration needs to be
             * re-created, not resent; the backend enforces this too).
             * In the 'pending' variant every row already qualifies. */}
            {onResendInvite &&
              (variant === 'pending' ||
                u.registration_status === 'pending') && (
                <button
                  type="button"
                  disabled={resendLoading}
                  onClick={() => onResendInvite(u)}
                  aria-label={`Resend invite to ${u.full_name}`}
                  className={`inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition ${resendLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-slate-100 hover:text-slate-700'}`}
                >
                  <LuSend className="size-4" />
                </button>
              )}
            <Link
              href={`/admin/users/${u.id}`}
              aria-label={`View ${u.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`/admin/users/${u.id}/edit`}
              aria-label={`Edit ${u.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDeleteRequest(u)}
              aria-label={`Delete ${u.full_name}`}
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
          itemCount={users.length}
          totalCount={count}
          itemLabel={variant === 'pending' ? 'pending registrations' : 'users'}
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
              Email
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Role
            </th>
            {variant === 'pending' ? (
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Resends used
              </th>
            ) : (
              <>
                <th className="px-6 py-3 text-left font-semibold text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-500">
                  Registration
                </th>
              </>
            )}
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

export { PAGE_SIZE, UserTable };
