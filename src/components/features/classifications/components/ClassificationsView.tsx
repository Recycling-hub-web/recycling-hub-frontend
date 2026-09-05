'use client';

import { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useClassifications, useDeleteClassification } from '../hooks';
import type { ClassificationListItem } from '../types';
import { ClassificationTable } from './ClassificationTable';

const SEARCH_DEBOUNCE_MS = 350;

type ClassificationsViewProps = {
  basePath: '/admin/classifications' | '/staff/classifications';
};

/** One list view shared by /admin/classifications and
 * /staff/classifications — same data, same table. Admin and staff have
 * identical permissions here (verified against ClassificationView /
 * IsAdminOrStaffUser), so no canDelete prop to thread through. */
const ClassificationsView = ({ basePath }: ClassificationsViewProps) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] =
    useState<ClassificationListItem | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { classifications, count, loading, error, refetch } =
    useClassifications({ page, search: search || undefined });
  const { execute: deleteClassification, loading: deleting } =
    useDeleteClassification();

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteClassification(pendingDelete.id);
      toast.success(
        'Classification deleted',
        `${pendingDelete.name} has been removed.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not delete the classification',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Classifications"
        subtitle="Manage the classification labels used to categorize accounts."
        actions={
          <Button href={`${basePath}/create`}>
            <LuPlus className="mr-1.5 size-4" />
            New classification
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name…"
          className="sm:max-w-xs"
        />
      </div>

      <ClassificationTable
        classifications={classifications}
        count={count}
        page={page}
        onPageChange={setPage}
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
        title="Delete classification"
        message={`This permanently deletes "${pendingDelete?.name}". This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { ClassificationsView };
