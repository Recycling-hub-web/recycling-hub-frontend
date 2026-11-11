import type { UserRole } from '../../../../types/auth';
import type { NotificationItem } from '../types';

const roleBase = (role: UserRole | undefined): string => {
  if (role === 'receiving_officer') return '/receiving';
  if (role === 'super_admin') return '/super-admin';
  return `/${role ?? 'profile'}`;
};

const notificationInboxPath = (role: UserRole | undefined) =>
  `${roleBase(role)}/notifications`;

// Repair previously stored links too; unread notifications predate new routing.
const notificationLink = (
  item: NotificationItem,
  role: UserRole | undefined,
): string => {
  const base = roleBase(role);
  if (
    !item.link.startsWith('/') ||
    item.link.startsWith('//') ||
    item.link.includes('\\')
  )
    return '';
  let { link } = item;
  if (
    item.title === 'New callback request' &&
    ['admin', 'super_admin', 'staff'].includes(role ?? '')
  ) {
    link = `${base}/pickup-requests?tab=quick`;
  }
  if (
    item.title === 'New pickup request submitted' &&
    ['admin', 'super_admin', 'staff'].includes(role ?? '')
  ) {
    link = link.replace(
      /\/(admin|staff|super-admin)\/pickups\//,
      `${base}/pickup-requests/`,
    );
  }
  if (
    role === 'super_admin' &&
    link.startsWith('/admin/') &&
    !/^\/admin\/(users|vehicles)(?:\/|$|\?)/.test(link)
  ) {
    link = link.replace('/admin/', '/super-admin/');
  }
  if (link === '/profile' || link.startsWith('/profile/')) return link;
  if (
    role === 'super_admin' &&
    /^\/admin\/(users|vehicles)(?:\/|$|\?)/.test(link)
  )
    return link;
  const modules: Partial<Record<UserRole, string[]>> = {
    admin: [
      'pickup-requests',
      'pickups',
      'categories',
      'collection-points',
      'banks',
      'vehicles',
      'blogs',
      'partnerships',
      'contact',
      'storage-files',
      'finance',
      'claims',
      'users',
      'staff',
      'notifications',
    ],
    super_admin: [
      'pickup-requests',
      'pickups',
      'categories',
      'collection-points',
      'banks',
      'blogs',
      'partnerships',
      'contact',
      'storage-files',
      'finance',
      'claims',
      'administrators',
      'system',
      'activity',
      'notifications',
    ],
    staff: [
      'pickup-requests',
      'pickups',
      'categories',
      'collection-points',
      'vehicles',
      'blogs',
      'partnerships',
      'contact',
      'storage-files',
      'finance',
      'claims',
      'notifications',
    ],
    driver: ['pickups', 'drop-off', 'finance', 'claims', 'notifications'],
    accounting: ['finance', 'claims', 'notifications'],
    receiving_officer: ['deliveries', 'notifications'],
  };
  const segment = link.slice(base.length + 1).split(/[/?#]/)[0] || '';
  if (link.startsWith(`${base}/`) && role && modules[role]?.includes(segment))
    return link;
  return notificationInboxPath(role);
};

export { notificationInboxPath, notificationLink };
