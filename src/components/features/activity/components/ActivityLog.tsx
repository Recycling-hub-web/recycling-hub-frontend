'use client';

import { useEffect, useState } from 'react';
import { LuHistory } from 'react-icons/lu';

import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { SearchInput } from '../../../form/filter/SearchInput';
import { AppDate } from '../../../ui/date/AppDate';
import { EmptyState } from '../../../ui/empty/EmptyState';
import { FilterSelect } from '../../../ui/FilterSelect';
import { Loading } from '../../../ui/loading/Loading';
import { TablePagination } from '../../../ui/table';
import { useActivityLog } from '../hooks';
import { activityLabel, presentActivity, roleLabel } from '../presentation';
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

/** Shared, newest-first activity timeline for records and the system log. */
const ActivityLog = ({ entityType, entityId }: ActivityLogProps) => {
  const { t, locale } = usePortalLocale();
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
    if (loading) return <Loading text={t('Loading activity…')} />;
    if (error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {t(error)}{' '}
          <button
            type="button"
            onClick={refetch}
            className="font-semibold underline"
          >
            {t('Retry')}
          </button>
        </div>
      );
    }
    if (entries.length === 0) {
      return (
        <EmptyState
          icon={<LuHistory className="size-6" />}
          title={t('No activity yet')}
          description={
            standalone
              ? t('Activity across the system will show up here.')
              : t('Changes to this record will show up here.')
          }
        />
      );
    }
    return (
      <div>
        <p className="mb-3 text-xs text-slate-600">{t('Newest first')}</p>
        <ol
          aria-label={t('Activity history')}
          className="ml-3 space-y-4 border-l border-slate-200 pl-6"
        >
          {entries.map((entry) => {
            const { title, details } = presentActivity(entry, t);
            return (
              <li key={entry.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-9 top-4 flex size-6 items-center justify-center rounded-full bg-white ring-4 ring-white"
                >
                  <LuHistory className="size-3.5 text-slate-400" />
                </span>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-slate-800">
                        {title}
                      </p>
                      <p className="mt-1 break-words text-xs text-slate-500">
                        {t('By')}{' '}
                        <span className="font-medium text-slate-700">
                          {entry.actor_name || t('System')}
                        </span>
                        {entry.actor_role &&
                          ` · ${t(roleLabel(entry.actor_role) || activityLabel(entry.actor_role))}`}
                      </p>
                    </div>
                    <AppDate
                      value={entry.created_at}
                      format="datetime"
                      locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
                      className="shrink-0 text-xs text-slate-600"
                    />
                  </div>
                  {standalone && (
                    <p className="mt-2 break-all text-xs text-slate-500">
                      {t(
                        MODULE_LABELS[entry.module] ||
                          activityLabel(entry.module),
                      )}{' '}
                      · {t(activityLabel(entry.entity_type))} ·{' '}
                      {entry.object_id}
                    </p>
                  )}
                  {details.length > 0 && (
                    <dl className="mt-3 space-y-2 border-t border-slate-200/70 pt-3 text-xs">
                      {details.map((detail) => (
                        <div
                          key={detail.label}
                          className="grid gap-0.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3"
                        >
                          <dt className="font-medium text-slate-500">
                            {detail.label}
                          </dt>
                          <dd className="min-w-0 whitespace-pre-wrap break-words text-slate-700">
                            {detail.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
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
            placeholder={t('Search by actor name…')}
            className="sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            <FilterSelect
              value={moduleFilter}
              onChange={(v) => {
                setModuleFilter(v as ActivityModule | '');
                setPage(1);
              }}
              options={MODULE_FILTER_OPTIONS.map((option) => ({
                ...option,
                label: t(option.label),
              }))}
            />
            <FilterSelect
              value={actionFilter}
              onChange={(v) => {
                setActionFilter(v as ActivityAction | '');
                setPage(1);
              }}
              options={ACTION_FILTER_OPTIONS.map((option) => ({
                ...option,
                label: t(option.label),
              }))}
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
          itemLabel={t('activity entries')}
          loading={loading}
        />
      )}
    </div>
  );
};

export { ActivityLog };
