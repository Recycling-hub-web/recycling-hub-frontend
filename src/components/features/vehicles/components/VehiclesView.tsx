'use client';

import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useDeleteVehicle, useVehicles } from '../hooks';
import type { Vehicle } from '../types';
import { VehicleTable } from './VehicleTable';

type VehiclesViewProps = {
  basePath: '/admin/vehicles' | '/staff/vehicles';
};

/** One list view shared by /admin/vehicles and /staff/vehicles — same
 * data, same table. Admin and staff have identical permissions here
 * (verified against VehicleViewSet), so there's no canDelete prop to
 * thread through, same as CategoriesView. Unlike CategoriesView, there's
 * no search/status filter row — VehicleViewSet.get_queryset has no
 * `?search=`/`?is_active=` query-param support, so one isn't invented
 * client-side (keeping this module simple, per the ask). */
const VehiclesView = ({ basePath }: VehiclesViewProps) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null);

  const { vehicles, count, loading, error, refetch } = useVehicles({ page });
  const { execute: deleteVehicle, loading: deleting } = useDeleteVehicle();

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteVehicle(pendingDelete.id);
      toast.success(
        'Vehicle deleted',
        `${pendingDelete.plate_number} has been removed.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not delete the vehicle',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Vehicles"
        subtitle="Manage the fleet vehicles drivers claim petrol expenses against."
        actions={
          <Button href={`${basePath}/create`}>
            <LuPlus className="mr-1.5 size-4" />
            New vehicle
          </Button>
        }
      />

      <VehicleTable
        vehicles={vehicles}
        count={count}
        page={page}
        onPageChange={setPage}
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
        title="Delete vehicle"
        message={`This permanently deletes "${pendingDelete?.plate_number}" — this cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { VehiclesView };
