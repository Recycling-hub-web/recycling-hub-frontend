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

const detailValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return 'Not set';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value))
    return value.length ? value.map(detailValue).join(', ') : 'None';
  if (typeof value === 'object') {
    const fields = Object.entries(value);
    return fields.length
      ? fields
          .map(
            ([key, nested]) => `${activityLabel(key)}: ${detailValue(nested)}`,
          )
          .join('; ')
      : 'None';
  }
  return String(value);
};

/** Keep the immutable audit payload intact; translate it only for display. */
const presentActivity = (entry: ActivityLogEntry) => {
  const fromRole = roleLabel(entry.details.from);
  const toRole = roleLabel(entry.details.to);
  const roleChanged =
    entry.module === 'accounts' &&
    entry.entity_type === 'user' &&
    entry.action === 'status_changed' &&
    fromRole &&
    toRole;
  const title = roleChanged
    ? `Role changed from ${fromRole} to ${toRole}`
    : ACTION_LABELS[entry.action] ?? activityLabel(entry.action);
  const details = Object.entries(entry.details)
    .filter(([key]) => !roleChanged || (key !== 'from' && key !== 'to'))
    .sort(([a], [b]) => {
      const priority = ['from', 'to', 'changed_fields', 'reason', 'note'];
      const rank = (key: string) =>
        priority.includes(key) ? priority.indexOf(key) : priority.length;
      return rank(a) - rank(b) || a.localeCompare(b);
    })
    .map(([key, value]) => {
      let formatted = detailValue(value);
      if (key === 'changed_fields' && Array.isArray(value)) {
        formatted =
          value
            .map((field) =>
              typeof field === 'string'
                ? activityLabel(field)
                : detailValue(field),
            )
            .join(', ') || 'None';
      } else if (
        ['from', 'to', 'role', 'status', 'evaluation_status'].includes(key) &&
        typeof value === 'string' &&
        value
      ) {
        formatted = roleLabel(value) || activityLabel(value);
      }
      return { label: activityLabel(key), value: formatted };
    });
  return { title, details };
};

export { activityLabel, presentActivity, roleLabel };
