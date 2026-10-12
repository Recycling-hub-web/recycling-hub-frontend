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
  daily_pickup_volume: DailyVolumePoint[];
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
  daily_closed_volume: DailyVolumePoint[];
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

export {
  getAccountingOverviewStats,
  getAdminOverviewStats,
  getDriverOverviewStats,
  getReceivingOverviewStats,
  getSuperAdminOverviewStats,
};
export type {
  AccountingDashboardStats,
  AdminDashboardStats,
  DriverDashboardStats,
  ReceivingDashboardStats,
  SuperAdminDashboardStats,
};
