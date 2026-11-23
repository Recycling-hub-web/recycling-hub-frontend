import { ROLE_LABELS, type UserRole } from '../../../types/auth';
import { ACTION_LABELS, type ActivityLogEntry } from './types';

const FIELD_LABELS: Record<string, string> = {
  changed_fields: 'Fields updated',
  is_active: 'Account active',
  is_2fa_enabled: 'Two-factor authentication',
  full_name: 'Full name',
  from: 'From',
  to: 'To',
  role: 'Role',
  note: 'Note',
  reason: 'Reason',
  ids: 'IDs',
};

const activityLabel = (value: string): string =>
  FIELD_LABELS[value] ??
  value.replace(/_/g, ' ').replace(/^./, (letter) => letter.toUpperCase());

const roleLabel = (value: unknown): string | null =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(ROLE_LABELS, value)
    ? ROLE_LABELS[value as UserRole]
    : null;

type Translate = (
  message: string,
  values?: Record<string, string | number>,
) => string;
const identity: Translate = (message, values = {}) =>
  message.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  );

const detailValue = (value: unknown, t: Translate): string => {
  if (value === null || value === undefined || value === '')
    return t('Not set');
  if (typeof value === 'boolean') return t(value ? 'Yes' : 'No');
  if (Array.isArray(value))
    return value.length
      ? value.map((item) => detailValue(item, t)).join(', ')
      : t('None');
  if (typeof value === 'object') {
    const fields = Object.entries(value);
    return fields.length
      ? fields
          .map(
            ([key, nested]) =>
              `${t(activityLabel(key))}: ${detailValue(nested, t)}`,
          )
          .join('; ')
      : t('None');
  }
  return String(value);
};

/** Keep the immutable audit payload intact; translate it only for display. */
const presentActivity = (entry: ActivityLogEntry, t: Translate = identity) => {
  const fromRole = roleLabel(entry.details.from);
  const toRole = roleLabel(entry.details.to);
  const roleChanged =
    entry.module === 'accounts' &&
    entry.entity_type === 'user' &&
    entry.action === 'status_changed' &&
    fromRole &&
    toRole;
  const title = roleChanged
    ? t('Role changed from {from} to {to}', {
        from: t(fromRole),
        to: t(toRole),
      })
    : t(ACTION_LABELS[entry.action] ?? activityLabel(entry.action));
  const details = Object.entries(entry.details)
    .filter(([key]) => !roleChanged || (key !== 'from' && key !== 'to'))
    .sort(([a], [b]) => {
      const priority = ['from', 'to', 'changed_fields', 'reason', 'note'];
      const rank = (key: string) =>
        priority.includes(key) ? priority.indexOf(key) : priority.length;
      return rank(a) - rank(b) || a.localeCompare(b);
    })
    .map(([key, value]) => {
      let formatted = detailValue(value, t);
      if (key === 'changed_fields' && Array.isArray(value)) {
        formatted =
          value
            .map((field) =>
              typeof field === 'string'
                ? t(activityLabel(field))
                : detailValue(field, t),
            )
            .join(', ') || t('None');
      } else if (
        ['from', 'to', 'role', 'status', 'evaluation_status'].includes(key) &&
        typeof value === 'string' &&
        value
      ) {
        formatted = t(roleLabel(value) || activityLabel(value));
      }
      return { label: t(activityLabel(key)), value: formatted };
    });
  return { title, details };
};

export { activityLabel, presentActivity, roleLabel };
