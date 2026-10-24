import { apiFetch } from '../../../../lib/api';
import type { UserRole } from '../../../../types/auth';
import type { DailyVolumePoint } from '../../pickups/services/pickupService';
import type { PickupStatus } from '../../pickups/types';

type FinanceStatus = 'pending' | 'claimed' | 'verified' | 'reimbursed';

/** Admin/Staff share this one endpoint — `total_users` is only present
 * for an actual admin (Staff has no Users module access), so it's
 * optional here rather than a plain `number`. See
 * AdminOverviewStatsView on the backend. */
type AdminDashboardStats = {
  total_users?: number;
  pending_pickups: number;
  pending_messages: number;
  published_posts: number;
  pickup_status_counts: Record<PickupStatus, number>;
  finance_status_counts: Record<FinanceStatus, number>;
};

/** A preset for the pickup volume chart, or `custom` with from/to. */
type PickupVolumeRange = '7d' | '30d' | '3m' | '6m' | '12m' | 'all' | 'custom';

type PickupVolumeQuery =
  | { range: Exclude<PickupVolumeRange, 'custom'> }
  | { range: 'custom'; from: string; to: string };

/** Response of GET /dashboard/pickup-volume/ (PickupVolumeView). The
 * backend picks `interval` from the range's length; each point's `date`
 * is its bucket's first day (a Monday for weeks, the 1st for months). */
type PickupVolume = {
  range: PickupVolumeRange;
  from: string;
  to: string;
  interval: 'day' | 'week' | 'month';
  total: number;
  points: DailyVolumePoint[];
};

type DriverDashboardStats = {
  available_pickups: number;
  my_assigned_pickups: number;
  /** Count of this driver's scheduled stops still on an open route —
   * not just whether one exists. */
  open_route_stops: number;
  pickup_status_counts: Record<PickupStatus, number>;
  finance_status_counts: Record<FinanceStatus, number>;
};

type ReceivingDashboardStats = {
  awaiting_close: number;
  closed_this_month: number;
  /** Only the two statuses a Receiving Officer ever sees. */
  pickup_status_counts: Record<'delivered' | 'closed', number>;
};

type AccountingDashboardStats = {
  unverified_records: number;
  /** Decimal amounts arrive as strings, same as every other money field
   * in this app (see FinanceRecord.price/actual_amount). */
  amount_pending: string;
  amount_reimbursed_this_month: string;
  finance_status_counts: Record<FinanceStatus, number>;
};

type SuperAdminDashboardStats = {
  users_by_role: Record<UserRole, number>;
  total_pickups_this_month: number;
  total_reimbursed_this_month: string;
  active_collection_points: number;
  active_service_areas: number;
};

// Admin/staff only — see AdminOverviewStatsView on the backend.
const getAdminOverviewStats = (): Promise<AdminDashboardStats> =>
  apiFetch('/dashboard/admin/');

// Driver only, server-scoped to the caller's own data — see
// DriverOverviewStatsView.
const getDriverOverviewStats = (): Promise<DriverDashboardStats> =>
  apiFetch('/dashboard/driver/');

// Receiving Officer only — see ReceivingOverviewStatsView.
const getReceivingOverviewStats = (): Promise<ReceivingDashboardStats> =>
  apiFetch('/dashboard/receiving/');

// Accounting only — see AccountingOverviewStatsView.
const getAccountingOverviewStats = (): Promise<AccountingDashboardStats> =>
  apiFetch('/dashboard/accounting/');

// Super Admin only, organization-wide — see SuperAdminOverviewStatsView.
const getSuperAdminOverviewStats = (): Promise<SuperAdminDashboardStats> =>
  apiFetch('/dashboard/super-admin/');

// Shared by every "volume over a selectable range" endpoint below — one
// query-string encoding instead of duplicating it per role. See
// `volume_range_data` on the backend, which every one of these endpoints
// is built on.
const fetchVolume = (
  path: string,
  query: PickupVolumeQuery,
): Promise<PickupVolume> => {
  const params = new URLSearchParams(
    query.range === 'custom'
      ? { from: query.from, to: query.to }
      : { range: query.range },
  );
  return apiFetch(`${path}?${params.toString()}`);
};

// Admin/staff only — the overview's pickup volume chart, on its own
// endpoint so changing the range refetches only this. See
// PickupVolumeView on the backend.
const getPickupVolume = (query: PickupVolumeQuery): Promise<PickupVolume> =>
  fetchVolume('/dashboard/pickup-volume/', query);

// Driver only, scoped to the caller's own pickups — see
// DriverPickupVolumeView.
const getDriverPickupVolume = (
  query: PickupVolumeQuery,
): Promise<PickupVolume> =>
  fetchVolume('/dashboard/driver/pickup-volume/', query);

// Receiving Officer only — see ReceivingVolumeView.
const getReceivingVolume = (query: PickupVolumeQuery): Promise<PickupVolume> =>
  fetchVolume('/dashboard/receiving/volume/', query);

// Accounting only — see AccountingVolumeView.
const getAccountingVolume = (query: PickupVolumeQuery): Promise<PickupVolume> =>
  fetchVolume('/dashboard/accounting/volume/', query);

// Super Admin only, organization-wide — see SuperAdminPickupVolumeView.
const getSuperAdminPickupVolume = (
  query: PickupVolumeQuery,
): Promise<PickupVolume> =>
  fetchVolume('/dashboard/super-admin/pickup-volume/', query);

export {
  getAccountingOverviewStats,
  getAccountingVolume,
  getAdminOverviewStats,
  getDriverOverviewStats,
  getDriverPickupVolume,
  getPickupVolume,
  getReceivingOverviewStats,
  getReceivingVolume,
  getSuperAdminOverviewStats,
  getSuperAdminPickupVolume,
};
export type {
  AccountingDashboardStats,
  AdminDashboardStats,
  DriverDashboardStats,
  PickupVolume,
  PickupVolumeQuery,
  PickupVolumeRange,
  ReceivingDashboardStats,
  SuperAdminDashboardStats,
};
