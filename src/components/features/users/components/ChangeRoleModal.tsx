'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuUserCog } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import type { UserRole } from '../../../../types/auth';
import { ROLE_LABELS } from '../../../../types/auth';
import { SelectField } from '../../../form/fields/SelectField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Modal } from '../../../ui/modal/Modal';
import { useChangeUserRole } from '../hooks';

type ChangeRoleModalProps = {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
  user: { id: string; full_name: string; role: UserRole };
  /** Roles the signed-in admin may assign (creatableRolesFor). */
  assignableRoles: UserRole[];
};

/** What the backend refused with: the `role` reasons (open orders,
 * unpaid payments, seat limits…), else the general message. */
const reasonsFrom = (err: unknown): string[] => {
  if (!(err instanceof ApiError)) return ['Could not change the role.'];
  const role = (err.data as Record<string, unknown> | null)?.role;
  if (Array.isArray(role)) return role.map(String);
  if (typeof role === 'string') return [role];
  return [err.message || 'Could not change the role.'];
};

/** Change a user's role (User details → Actions → Change role). The
 * backend does the real work — moves them onto the new role's profile
 * (work details carried over), refuses while a driver still has orders
 * or unpaid payments, signs them out everywhere and notifies them and
 * management — so this only picks the role and says what will happen. */
const ChangeRoleModal = ({
  open,
  onClose,
  onChanged,
  user,
  assignableRoles,
}: ChangeRoleModalProps) => {
  const { execute: changeRole, loading } = useChangeUserRole();
  const [formData, setFormData] = useState({ role: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reasons, setReasons] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setFormData({ role: '' });
    setErrors({});
    setReasons([]);
  }, [open]);

  const options = assignableRoles
    .filter((role) => role !== user.role)
    .map((role) => ({ value: role, label: ROLE_LABELS[role] }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setReasons([]);
    if (!formData.role) {
      setErrors({ role: 'Choose the new role.' });
      return;
    }
    try {
      await changeRole(user.id, formData.role as UserRole);
      onChanged();
      onClose();
    } catch (err) {
      setReasons(reasonsFrom(err));
    }
  };

  const newRole = formData.role ? ROLE_LABELS[formData.role as UserRole] : '';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Change role"
      subtitle={`${user.full_name} is currently ${ROLE_LABELS[user.role]}.`}
      icon={<LuUserCog className="size-5" />}
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit} noValidate>
        {reasons.length > 0 && (
          <AlertBanner
            message={
              reasons.length === 1 ? (
                reasons[0]
              ) : (
                <ul className="list-disc space-y-1 ps-4">
                  {reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )
            }
          />
        )}

        <SelectField
          label="New role"
          field="role"
          options={[{ value: '', label: 'Choose a role' }, ...options]}
          formData={formData}
          errors={errors}
          updateFormData={(_field, value) => {
            setFormData({ role: value });
            setErrors({});
            setReasons([]);
          }}
          disabled={loading}
        />

        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="font-medium">
            {newRole
              ? `When ${user.full_name} becomes ${newRole}:`
              : 'When the role changes:'}
          </p>
          <ul className="mt-1 list-disc space-y-0.5 ps-4">
            <li>
              Their department, position, branch and joining date carry over.
            </li>
            <li>
              They&apos;re signed out and see the new role&apos;s menu next
              time.
            </li>
            <li>They and the admins get a notification.</li>
            {user.role === 'driver' && (
              <li>
                A driver with orders on the go or payments still owed can&apos;t
                be moved until those are done.
              </li>
            )}
            {formData.role === 'driver' && (
              <li>
                As a driver they need payout details before their first
                reimbursement.
              </li>
            )}
          </ul>
        </div>

        <FormActions>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Changing…' : 'Change role'}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
};

export { ChangeRoleModal };
