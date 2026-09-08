'use client';

import { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { FilterSelect } from '../../../ui/FilterSelect';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { STATUS_FILTER_OPTIONS, TYPE_FILTER_OPTIONS } from '../constants';
import { useDeletePartner, usePartners } from '../hooks';
import type { Partner, PartnershipType } from '../types';
import { PartnerTable } from './PartnerTable';

const SEARCH_DEBOUNCE_MS = 350;

type PartnersViewProps = {
  basePath: '/admin/partnerships' | '/staff/partnerships';
};

/** One list view shared by /admin/partnerships and /staff/partnerships —
 * same data, same table. Admin and staff have identical permissions here
 * (verified against PartnerViewSet/IsStaffOrReadOnly, both is_staff=True),
 * same as Categories, so no canDelete prop to thread through. */
const PartnersView = ({ basePath }: PartnersViewProps) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<PartnershipType | ''>('');
  const [statusFilter, setStatusFilter] = useState<'' | 'true' | 'false'>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Partner | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { partners, count, loading, error, refetch } = usePartners({
    page,
    partnershipType: typeFilter || undefined,
    isActive: statusFilter || undefined,
    search: search || undefined,
  });
  const { execute: deletePartner, loading: deleting } = useDeletePartner();

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value as PartnershipType | '');
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as '' | 'true' | 'false');
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deletePartner(pendingDelete.id);
      toast.success(
        'Partner deactivated',
        `${pendingDelete.name} is now inactive.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not deactivate the partner',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Partnerships"
        subtitle="Manage the organizations shown on the public partners page."
        actions={
          <Button href={`${basePath}/create`}>
            <LuPlus className="mr-1.5 size-4" />
            New partner
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name…"
          className="sm:max-w-xs"
        />
        <div className="flex gap-2">
          <FilterSelect
            value={typeFilter}
            onChange={handleTypeFilterChange}
            options={TYPE_FILTER_OPTIONS}
          />
          <FilterSelect
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={STATUS_FILTER_OPTIONS}
          />
        </div>
      </div>

      <PartnerTable
        partners={partners}
        count={count}
        page={page}
        onPageChange={setPage}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        search={search}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath={basePath}
        onDeleteRequest={setPendingDelete}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Deactivate partner"
        message={`This deactivates "${pendingDelete?.name}" — it stays visible here as Inactive and can be reactivated later, but it's removed from the public partners page.`}
        confirmText="Deactivate"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { PartnersView };
