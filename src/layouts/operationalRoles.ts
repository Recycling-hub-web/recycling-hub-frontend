import type { NavItem } from '../components/ui/navigation';
import type { UserRole } from '../types/auth';
import { buildNavItems } from './navigation';

// Admin and Super Admin each have their own dedicated layout+sidebar
// (AdminLayout/SuperAdminLayout) outside this operational-role bundle,
// same as before — excluded here same as always, just no longer for
// the same reason (Super Admin used to share Admin's own layout; now
// it has its own separate /super-admin section instead).
type OperationalRole = Exclude<UserRole, 'admin' | 'super_admin'>;

type OperationalRoleConfig = {
  route: string;
  navItems: NavItem[];
};

// Each role's own route + sidebar. Only "Overview", "Notifications"
// (every role, same shared NotificationsView — see
// features/notifications/components), and, for staff,
// "Pickup Requests"/"Contact"/"Categories"/"Collection
// Points"/"Storage Files"/"Blog Posts"/"Partnerships"/"Finance Records";
// for driver, its own scoped "Pickup Requests"; for accounting, "Finance
// Records" — is wired to real pages today — the rest of each role's
// section (assigned tasks, reports) lands here as that workflow work
// gets built, same "roles first, then workflows" pattern the admin
// sidebar started with. Staff sees the same pickups/contact management
// admin does (same components, basePath="/staff/…") but without contact
// delete — enforced on the backend too (ContactMessageViewSet.get_permissions),
// not just a hidden button here. Pickups, Categories,
// Collection Points, Storage Files, Blog Posts, and Partnerships have no
// such split: admin and staff share identical permissions on all six
// modules (CollectionRequestViewSet / CategoryViewSet +
// IsStaffOrReadOnly / CollectionPointViewSet +
// IsAdminOrStaffUser / FileRecordViewSet + IsAdminOrStaffUser /
// BlogPostViewSet + IsStaffOrReadOnly / PartnerViewSet +
// IsStaffOrReadOnly). Driver's "Pickup Requests" is a different,
// scoped-down view (DriverPickupsView) — not PickupRequestsView reused
// — since a driver only ever sees the open claimable pool + their own
// (see CollectionRequestViewSet.get_queryset's driver branch), with
// claim/collect actions instead of the full admin/staff CRUD. Finance
// Records (FinanceRecordsView) is accounting/admin/staff's full,
// writable (claim/verify/reimburse) table — staff gained this access
// alongside accounting/admin (IsAccountingOrAdminOrStaff on the
// backend), unlike every other role-split module in this app where
// staff's extra reach stops short of something admin can do; the
// driver's own route renders the same component, scoped server-side to
// their own records and read-only past submission — their one write
// action (the one-click bulk claim) lives as a banner on their Pickup
// Requests page instead, not on this table. The driver's "Drop Off to
// Store" (RouteDropOffView) is its own dedicated screen, not
// CollectModal reused — one batch action across every `collected`
// request on their current open Route (see Route on the backend), not a
// per-task repeat. Receiving Officer's first real page, "Deliveries"
// (ReceivingDeliveriesView), is the other end of that same chain —
// verifying/closing requests a driver has already dropped off; the
// backend already scopes its queryset to delivered/closed only, so
// there's nothing earlier in the lifecycle to accidentally expose here.
// "Vehicles" (VehiclesView) is admin/staff only, deliberately not added
// to driver/accounting here — a driver only ever reads their own
// assigned vehicle (GET /claims/vehicles/mine/, surfaced on the claim
// form itself, not a sidebar page), never manages the fleet.
const OPERATIONAL_ROLES: Record<OperationalRole, OperationalRoleConfig> = {
  staff: {
    route: '/staff',
    navItems: buildNavItems('/staff', [
      'overview',
      'pickupRequests',
      'pickups',
      'contact',
      'categories',
      'collectionPoints',
      'storageFiles',
      'blogs',
      'partnerships',
      'finance',
      'claims',
      'vehicles',
      'notifications',
    ]),
  },
  driver: {
    route: '/driver',
    navItems: buildNavItems('/driver', [
      'overview',
      'pickups',
      'dropOff',
      'finance',
      'claims',
      'notifications',
    ]),
  },
  receiving_officer: {
    route: '/receiving',
    navItems: buildNavItems('/receiving', [
      'overview',
      'deliveries',
      'notifications',
    ]),
  },
  accounting: {
    route: '/accounting',
    navItems: buildNavItems('/accounting', [
      'overview',
      'finance',
      'claims',
      'notifications',
    ]),
  },
};

export { OPERATIONAL_ROLES };
export type { OperationalRole };
