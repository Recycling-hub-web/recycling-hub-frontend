'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '../../../contexts/AuthContext';
import { ApiError, apiFetch } from '../../../lib/api';
import type { DriverPayoutDetails } from '../../../types/driverPayout';
import { Button } from '../../ui/buttons/Button';
import { Card } from '../../ui/card/Card';
import { AppDate } from '../../ui/date/AppDate';
import { Modal } from '../../ui/modal/Modal';
import { useToast } from '../../ui/toast/ToastContext';
import type { Bank } from '../banks/types';

type BankHistoryEntry = {
  id: string;
  created_at: string;
  changed_by_name: string;
  before: Record<string, string>;
  after: Record<string, string>;
  changed_fields: string[];
};

const methods = {
  bank_transfer: 'Bank transfer',
  duitnow: 'DuitNow',
  cash: 'Cash',
};
const identifiers = {
  mobile: 'Mobile number',
  nric: 'NRIC',
  passport: 'Passport',
  army_police: 'Army / Police ID',
  business: 'Business registration number',
};
const fields = {
  bank_name: 'Bank name',
  account_holder_name: 'Account holder name',
  bank_account_number: 'Account number',
  bank_branch: 'Branch (optional)',
  duitnow_id: 'DuitNow ID',
};

export const DriverBankDetails = ({
  details,
  canEdit = false,
  onSaved,
  canManageBanks = canEdit,
}: {
  details: DriverPayoutDetails;
  canEdit?: boolean;
  canManageBanks?: boolean;
  onSaved: () => void;
}) => {
  const { user } = useAuth();
  const banksPath =
    user?.role === 'super_admin' ? '/super-admin/banks' : '/admin/banks';
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksError, setBanksError] = useState('');
  const [banksLoading, setBanksLoading] = useState(false);
  const loadBanks = async () => {
    setBanksLoading(true);
    setBanksError('');
    try {
      setBanks(await apiFetch<Bank[]>('/accounts/banks/'));
    } catch {
      setBanksError('Could not load banks. Please try again.');
    } finally {
      setBanksLoading(false);
    }
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) loadBanks();
  }, [open]);
  const [form, setForm] = useState(details);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<BankHistoryEntry[]>([]);
  const [historyError, setHistoryError] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const loadHistory = async (page = 1) => {
    setHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryError('');
    if (page === 1) setHistory([]);
    try {
      const result = await apiFetch<{
        results: BankHistoryEntry[];
        next: string | null;
      }>(`/accounts/drivers/${details.id}/payout/history/?page=${page}`);
      setHistory((previous) =>
        page === 1 ? result.results : [...previous, ...result.results],
      );
      setHasMore(Boolean(result.next));
      setNextPage(page + 1);
    } catch {
      setHistoryError('Could not load bank history. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };
  const historyValue = (field: string, value: string) => {
    if (!value) return 'Not set';
    if (field === 'bank')
      return (
        banks.find((bank) => bank.id === value)?.name ||
        'Bank selection changed'
      );
    if (field === 'payout_method')
      return methods[value as keyof typeof methods] || value;
    if (field === 'duitnow_id_type')
      return identifiers[value as keyof typeof identifiers] || value;
    return value;
  };
  const toast = useToast();
  const close = () => {
    if (!saving) setOpen(false);
  };
  const save = async () => {
    setSaving(true);
    setError('');
    try {
      await apiFetch(`/accounts/drivers/${details.id}/payout/`, {
        method: 'PATCH',
        json: Object.fromEntries(
          [
            'payout_method',
            'bank',
            'account_holder_name',
            'bank_account_number',
            'bank_branch',
            'duitnow_id_type',
            'duitnow_id',
          ].map((key) => [key, form[key as keyof DriverPayoutDetails]]),
        ),
      });
      setOpen(false);
      toast.success('Payout details updated');
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.data && typeof err.data === 'object') {
        setError(
          Object.entries(err.data)
            .map(
              ([key, value]) =>
                `${fields[key as keyof typeof fields] || key.replaceAll('_', ' ')}: ${Array.isArray(value) ? value.join(' ') : String(value)}`,
            )
            .join(' '),
        );
      } else setError('Could not save payout details. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  const getFields = (method: string): (keyof typeof fields)[] => {
    if (method === 'bank_transfer')
      return ['account_holder_name', 'bank_account_number', 'bank_branch'];
    if (method === 'duitnow') return ['account_holder_name', 'duitnow_id'];
    return [];
  };
  const visible = getFields(details.payout_method);
  if (details.payout_method === 'bank_transfer') visible.unshift('bank_name');
  const inputFields = getFields(form.payout_method);
  const lengths = {
    bank_name: 120,
    bank_branch: 120,
    account_holder_name: 150,
    bank_account_number: 34,
    duitnow_id: 64,
  };
  return (
    <Card className="mt-4 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Driver bank & payout details
        </h2>
        {canEdit && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setForm(details);
              setError('');
              setOpen(true);
            }}
          >
            Edit payout details
          </Button>
        )}
      </div>
      {canManageBanks && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" href={banksPath}>
            Manage banks
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              loadHistory();
            }}
          >
            Bank history
          </Button>
        </div>
      )}
      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Bank details history"
        size="xl"
      >
        <p className="mb-4 text-xs text-slate-500">
          Changes recorded by admins and drivers, newest first. History starts
          when this feature is enabled.
        </p>
        {historyError && (
          <p role="alert" className="mb-3 text-sm text-red-700">
            {historyError}{' '}
            <button
              type="button"
              className="underline"
              onClick={() => {
                loadHistory(history.length ? nextPage : 1);
              }}
            >
              Retry
            </button>
          </p>
        )}
        {!historyLoading && !historyError && history.length === 0 && (
          <p className="text-sm text-slate-500">
            No bank details changes recorded yet.
          </p>
        )}
        <ol className="space-y-4">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="rounded-lg border border-slate-200 p-4"
            >
              <p className="mb-3 text-sm font-semibold">
                {entry.changed_by_name || 'Unknown user'} ·{' '}
                <AppDate value={entry.created_at} format="long" />
                {' · '}
                <time dateTime={entry.created_at}>
                  {new Date(entry.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </p>
              <dl className="space-y-3 text-sm">
                {entry.changed_fields.map((field) => (
                  <div key={field}>
                    <dt className="font-medium">
                      {fields[field as keyof typeof fields] ||
                        field.replaceAll('_', ' ')}
                    </dt>
                    <dd className="break-all text-slate-500">
                      Previous: {historyValue(field, entry.before[field] || '')}
                    </dd>
                    <dd className="break-all">
                      Updated: {historyValue(field, entry.after[field] || '')}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
        {historyLoading && (
          <p role="status" className="mt-3 text-sm">
            Loading history…
          </p>
        )}
        {hasMore && !historyLoading && !historyError && (
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => {
              loadHistory(nextPage);
            }}
          >
            Load more
          </Button>
        )}
      </Modal>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Payout method</dt>
          <dd>
            {methods[details.payout_method as keyof typeof methods] ||
              'Not set'}
          </dd>
        </div>
        {visible.map((key) => (
          <div key={key}>
            <dt className="text-slate-500">{fields[key]}</dt>
            <dd className="break-all">{details[key] || '—'}</dd>
          </div>
        ))}
        {details.payout_method === 'duitnow' && (
          <div>
            <dt className="text-slate-500">DuitNow ID type</dt>
            <dd>
              {identifiers[
                details.duitnow_id_type as keyof typeof identifiers
              ] || '—'}
            </dd>
          </div>
        )}
      </dl>
      {!details.payout_ready && (
        <p className="mt-4 text-sm text-amber-700">
          Complete payout details before reimbursement.
          {details.payout_account_details &&
            ` Previous payout instructions: ${details.payout_account_details}`}
        </p>
      )}
      <Modal
        open={open}
        onClose={close}
        title="Edit driver payout details"
        size="xl"
        closeOnBackdrop={!saving}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                const element = document.getElementById(
                  'driver-payout-form',
                ) as HTMLFormElement | null;
                element?.requestSubmit();
              }}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save details'}
            </Button>
          </div>
        }
      >
        <form
          id="driver-payout-form"
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <label className="block text-sm font-medium">
            Payout method *
            <select
              required
              disabled={saving}
              className="mt-1 block w-full rounded-lg border border-slate-200 p-3"
              value={form.payout_method}
              onChange={(event) =>
                setForm({ ...form, payout_method: event.target.value })
              }
            >
              <option value="">Select method</option>
              {Object.entries(methods).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {form.payout_method === 'duitnow' && (
            <label className="block text-sm font-medium">
              DuitNow ID type *
              <select
                required
                disabled={saving}
                className="mt-1 block w-full rounded-lg border border-slate-200 p-3"
                value={form.duitnow_id_type}
                onChange={(event) =>
                  setForm({ ...form, duitnow_id_type: event.target.value })
                }
              >
                <option value="">Select ID type</option>
                {Object.entries(identifiers).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {form.payout_method === 'bank_transfer' && (
            <label className="block text-sm font-medium">
              Bank *
              {banksError && (
                <span role="alert" className="block text-red-700">
                  {banksError}{' '}
                  <button
                    type="button"
                    className="underline"
                    onClick={loadBanks}
                  >
                    Retry
                  </button>
                </span>
              )}
              <select
                required
                disabled={saving || banksLoading || Boolean(banksError)}
                className="mt-1 block w-full rounded-lg border border-slate-200 p-3"
                value={form.bank || ''}
                onChange={(event) => {
                  const bank = banks.find(
                    (item) => item.id === event.target.value,
                  );
                  setForm({
                    ...form,
                    bank: bank?.id || null,
                    bank_name: bank?.name || '',
                  });
                }}
              >
                <option value="">
                  {banksLoading ? 'Loading banks…' : 'Select bank'}
                </option>
                {form.bank && !banks.some((bank) => bank.id === form.bank) && (
                  <option value={form.bank}>
                    {form.bank_name} (current bank)
                  </option>
                )}
                {banks
                  .filter((bank) => bank.is_active || bank.id === form.bank)
                  .map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name}
                      {!bank.is_active && ' (inactive)'}
                    </option>
                  ))}
              </select>
              {!banksLoading &&
                !banksError &&
                !banks.some((bank) => bank.is_active) && (
                  <span className="mt-1 block text-xs text-amber-700">
                    An administrator needs to add an active bank.
                  </span>
                )}
            </label>
          )}
          {inputFields.map((key) => (
            <label key={key} className="block text-sm font-medium">
              {fields[key]}
              {key !== 'bank_branch' && ' *'}
              <input
                type="text"
                disabled={saving}
                required={key !== 'bank_branch'}
                maxLength={lengths[key]}
                inputMode={key === 'bank_account_number' ? 'numeric' : 'text'}
                className="mt-1 block w-full rounded-lg border border-slate-200 p-3"
                value={form[key]}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.value })
                }
              />
            </label>
          ))}
          <p className="text-xs text-slate-500">
            Enter the account holder name exactly as registered with the bank.
            Keep leading zeros in account numbers. Only local banks are
            supported. For a DuitNow mobile ID, use international format (for
            example +60123456789).
          </p>
        </form>
      </Modal>
    </Card>
  );
};
