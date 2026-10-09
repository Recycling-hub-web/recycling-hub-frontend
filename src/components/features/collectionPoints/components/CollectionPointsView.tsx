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
import { useCollectionPoints, useDeleteCollectionPoint } from '../hooks';
import type { CollectionPoint } from '../types';
import { CollectionPointTable } from './CollectionPointTable';

const SEARCH_DEBOUNCE_MS = 350;

type CollectionPointsViewProps = {
  basePath: '/admin/collection-points' | '/staff/collection-points';
};

/** One list view shared by /admin/collection-points and
 * /staff/collection-points — same data, same table. Admin and staff
 * have identical permissions here (IsAdminOrStaffUser on every write
 * action), so no canDelete prop to thread through. */
const CollectionPointsView = ({ basePath }: CollectionPointsViewProps) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<CollectionPoint | null>(
    null,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { collectionPoints, count, loading, error, refetch } =
    useCollectionPoints({ page, search: search || undefined });
  const { execute: deleteCollectionPoint, loading: deleting } =
    useDeleteCollectionPoint();

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCollectionPoint(pendingDelete.id);
      toast.success(
        'Collection point deleted',
        `${pendingDelete.name} has been removed.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not delete the collection point',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Collection Points"
        subtitle="Manage the drop-off points residents can bring recyclables to."
        actions={
          <Button href={`${basePath}/create`}>
            <LuPlus className="mr-1.5 size-4" />
            New collection point
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, city, or UID…"
          className="sm:max-w-xs"
        />
      </div>

      <CollectionPointTable
        collectionPoints={collectionPoints}
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
        title="Delete collection point"
        message={`This permanently deletes "${pendingDelete?.name}". This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { CollectionPointsView };
