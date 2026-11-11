'use client';

import { useEffect, useState } from 'react';

import { ApiError, apiFetch } from '../../../../lib/api';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import type { Bank } from '../types';

export const BanksView = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setBanks(await apiFetch<Bank[]>('/accounts/banks/'));
    } catch {
      setError('Could not load banks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const mutate = async (id: string | null, json: unknown) => {
    setBusy(true);
    setError('');
    try {
      await apiFetch(id ? `/accounts/banks/${id}/` : '/accounts/banks/', {
        method: id ? 'PATCH' : 'POST',
        json,
      });
      setName('');
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save bank.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <PageContainer variant="form">
      <PageHeader
        title="Banks"
        subtitle="Manage local banks available for driver payouts."
      />
      <Card className="p-5">
        <p className="mb-4 text-sm text-slate-500">
          Add banks for drivers to select. Deactivating a bank preserves
          existing account details and history.
        </p>
        {error && (
          <p role="alert" className="mb-3 text-sm text-red-700">
            {error}{' '}
            <button
              type="button"
              disabled={busy || loading}
              className="underline"
              onClick={load}
            >
              Reload banks
            </button>
          </p>
        )}
        <form
          className="mb-5 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            mutate(editing, { name: name.trim() });
          }}
        >
          <label className="block text-sm font-medium">
            Bank name *
            <input
              required
              maxLength={120}
              value={name}
              disabled={busy}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-200 p-3"
            />
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>
              {editing ? 'Save bank' : 'Add bank'}
            </Button>
            {editing && (
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  setEditing(null);
                  setName('');
                }}
              >
                Cancel edit
              </Button>
            )}
          </div>
        </form>
        {loading && <p role="status">Loading banks…</p>}
        {!loading && banks.length === 0 && (
          <p className="text-sm text-slate-500">No banks added yet.</p>
        )}
        <ul className="space-y-3">
          {banks.map((bank) => (
            <li
              key={bank.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
            >
              <div>
                <p className="text-sm font-semibold">{bank.name}</p>
                <p className="text-xs text-slate-500">
                  {bank.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => {
                    setEditing(bank.id);
                    setName(bank.name);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => {
                    mutate(bank.id, { is_active: !bank.is_active });
                  }}
                >
                  {bank.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
};
