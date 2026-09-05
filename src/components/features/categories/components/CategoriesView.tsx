'use client';

import { useEffect, useMemo, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { FilterSelect } from '../../../ui/FilterSelect';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { STATUS_FILTER_OPTIONS } from '../constants';
import { useCategories, useDeleteCategory } from '../hooks';
import type { CategoryListItem } from '../types';
import { CategoryTable } from './CategoryTable';

const SEARCH_DEBOUNCE_MS = 350;

type CategoriesViewProps = {
  basePath: '/admin/categories' | '/staff/categories';
};

/** One list view shared by /admin/categories and /staff/categories — same
 * data, same table. Unlike Contact, admin and staff have identical
 * permissions here (verified against CategoryViewSet/IsStaffOrReadOnly),
 * so there's no canDelete prop to thread through. */
const CategoriesView = ({ basePath }: CategoriesViewProps) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'' | 'true' | 'false'>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<CategoryListItem | null>(
    null,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { categories, count, loading, error, refetch } = useCategories({
    page,
    isActive: statusFilter || undefined,
    search: search || undefined,
  });
  const { execute: deleteCategory, loading: deleting } = useDeleteCategory();

  // Parent-name lookup for the table's Parent column — built from
  // whatever page is currently loaded (see CategoryTable's prop doc for
  // the known limitation once there's more than one page of categories).
  const parentNameById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as '' | 'true' | 'false');
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCategory(pendingDelete.id);
      toast.success(
        'Category deactivated',
        `${pendingDelete.name} is now inactive.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not deactivate the category',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Material Categories"
        subtitle="Manage the material types used across pickup requests."
        actions={
          <Button href={`${basePath}/create`}>
            <LuPlus className="mr-1.5 size-4" />
            New category
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
        <FilterSelect
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={STATUS_FILTER_OPTIONS}
        />
      </div>

      <CategoryTable
        categories={categories}
        count={count}
        page={page}
        onPageChange={setPage}
        statusFilter={statusFilter}
        search={search}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath={basePath}
        parentNameById={parentNameById}
        onDeleteRequest={setPendingDelete}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Deactivate category"
        message={`This deactivates "${pendingDelete?.name}" — it stays visible here as Inactive and can be reactivated later, but pickup requests can no longer be created against it.`}
        confirmText="Deactivate"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { CategoriesView };
