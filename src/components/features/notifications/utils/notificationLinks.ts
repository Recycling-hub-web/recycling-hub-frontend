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
  if (
    item.title === 'New callback request' &&
    ['admin', 'super_admin', 'staff'].includes(role ?? '')
  ) {
    return `${base}/pickup-requests?tab=quick`;
  }
  if (item.title === 'New pickup request submitted') {
    return item.link.replace(
      /\/(admin|staff|super-admin)\/pickups\//,
      `${base}/pickup-requests/`,
    );
  }
  if (role === 'super_admin') {
    if (item.link === '/admin/users') return '/super-admin/administrators';
    if (item.link.startsWith('/admin/'))
      return item.link.replace('/admin/', '/super-admin/');
  }
  // Backend notifications are internal links; never navigate to external URLs.
  return item.link.startsWith('/') && !item.link.startsWith('//')
    ? item.link
    : '';
};

export { notificationInboxPath, notificationLink };
