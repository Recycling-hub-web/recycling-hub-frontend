'use client';

import { useEffect, useState } from 'react';

import { SearchInput } from '../../../form/filter/SearchInput';
import { AppDate } from '../../../ui/date/AppDate';
import { FilterSelect } from '../../../ui/FilterSelect';
import { Loading } from '../../../ui/loading/Loading';
import { TablePagination } from '../../../ui/table';
import { useActivityLog } from '../hooks';
import {
  ACTION_LABELS,
  type ActivityAction,
  type ActivityModule,
  MODULE_LABELS,
} from '../types';

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 350;

const MODULE_FILTER_OPTIONS = [
  { value: '', label: 'All modules' },
  ...(Object.keys(MODULE_LABELS) as ActivityModule[]).map((m) => ({
    value: m,
    label: MODULE_LABELS[m],
  })),
];

const ACTION_FILTER_OPTIONS = [
  { value: '', label: 'All actions' },
  ...(Object.keys(ACTION_LABELS) as ActivityAction[]).map((a) => ({
    value: a,
    label: ACTION_LABELS[a],
  })),
];

type ActivityLogProps = {
  /** Together, scope this to one record's own activity (no filter UI —
   * the caller already knows what it's looking at). Omit both for the
   * system-wide log, which renders its own module/action/actor filters. */
  entityType?: string;
  entityId?: string;
};

/** The one shared activity feed — used both as a per-record "Activity"
 * section (PickupRequestDetailsView, UserDetailsView) and as the
 * system-wide, admin-only Activity Log page. `details` is rendered
 * generically (key: value pairs) since its shape varies by `action`
 * rather than being modeled per-action here. */
const ActivityLog = ({ entityType, entityId }: ActivityLogProps) => {
  const standalone = !entityType || !entityId;
  const [page, setPage] = useState(1);
  const [moduleFilter, setModuleFilter] = useState<ActivityModule | ''>('');
  const [actionFilter, setActionFilter] = useState<ActivityAction | ''>('');
  const [actorInput, setActorInput] = useState('');
  const [actor, setActor] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActor(actorInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [actorInput]);

  const { entries, count, loading, error, refetch } = useActivityLog({
    page,
    module: standalone ? moduleFilter || undefined : undefined,
    action: standalone ? actionFilter || undefined : undefined,
    actor: standalone ? actor || undefined : undefined,
    entityType,
    objectId: entityId,
  });

  const renderBody = () => {
    if (loading) return <Loading text="Loading activity…" />;
    if (error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}{' '}
          <button
            type="button"
            onClick={refetch}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      );
    }
    if (entries.length === 0) {
      return (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No activity yet.
        </p>
      );
    }
    return (
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {entry.actor_name || 'System'}
                <span className="font-normal text-slate-500">
                  {' '}
                  — {ACTION_LABELS[entry.action]}
                </span>
              </p>
              {Object.keys(entry.details).length > 0 && (
                <p className="mt-1 truncate text-xs text-slate-500">
                  {Object.entries(entry.details)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' · ')}
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              {standalone && (
                <p className="text-xs font-medium text-slate-400">
                  {MODULE_LABELS[entry.module]}
                </p>
              )}
              <p className="mt-0.5 text-xs text-slate-400">
                <AppDate value={entry.created_at} format="short" />
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {standalone && (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={actorInput}
            onChange={(e) => setActorInput(e.target.value)}
            placeholder="Search by actor name…"
            className="sm:max-w-xs"
          />
          <div className="flex gap-2">
            <FilterSelect
              value={moduleFilter}
              onChange={(v) => {
                setModuleFilter(v as ActivityModule | '');
                setPage(1);
              }}
              options={MODULE_FILTER_OPTIONS}
            />
            <FilterSelect
              value={actionFilter}
              onChange={(v) => {
                setActionFilter(v as ActivityAction | '');
                setPage(1);
              }}
              options={ACTION_FILTER_OPTIONS}
            />
          </div>
        </div>
      )}

      {renderBody()}

      {!loading && !error && count > PAGE_SIZE && (
        <TablePagination
          currentPage={page}
          onPageChange={setPage}
          itemsPerPage={PAGE_SIZE}
          itemCount={entries.length}
          totalCount={count}
          itemLabel="activity entries"
          loading={loading}
        />
      )}
    </div>
  );
};

export { ActivityLog };
