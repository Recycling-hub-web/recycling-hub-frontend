import { expect, test } from '@playwright/test';

import { presentActivity } from '../src/components/features/activity/presentation';
import type { ActivityLogEntry } from '../src/components/features/activity/types';

const entry = (
  details: Record<string, unknown>,
  overrides: Partial<ActivityLogEntry> = {},
): ActivityLogEntry => ({
  id: 'activity-1',
  actor_name: 'Adnan Madi',
  actor_role: 'admin',
  module: 'accounts',
  entity_type: 'user',
  object_id: 'user-1',
  action: 'status_changed',
  created_at: '2026-11-17T08:00:00Z',
  details,
  ...overrides,
});

test('role changes read from the previous role to the new role regardless of JSON key order', () => {
  const input = entry({ to: 'driver', from: 'staff' });
  const original = JSON.stringify(input);
  expect(presentActivity(input)).toEqual({
    title: 'Role changed from Staff to Driver',
    details: [],
  });
  expect(JSON.stringify(input)).toBe(original);
});

test('ordinary status changes retain both values in a predictable order', () => {
  expect(
    presentActivity(
      entry(
        { to: 'closed', from: 'delivered' },
        { module: 'pickups', entity_type: 'collectionrequest' },
      ),
    ),
  ).toEqual({
    title: 'Status changed',
    details: [
      { label: 'From', value: 'Delivered' },
      { label: 'To', value: 'Closed' },
    ],
  });
});

test('updated fields and nested details display readable values', () => {
  const display = presentActivity(
    entry(
      {
        changed_fields: ['full_name', 'is_2fa_enabled'],
        metadata: { enabled: true, note: null },
        ids: ['one', 'two'],
      },
      { action: 'updated' },
    ),
  );
  expect(display.details).toEqual([
    { label: 'Fields updated', value: 'Full name, Two-factor authentication' },
    { label: 'IDs', value: 'one, two' },
    { label: 'Metadata', value: 'Enabled: Yes; Note: Not set' },
  ]);
});
