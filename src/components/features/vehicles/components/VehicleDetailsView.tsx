'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCreditCard,
  LuPencil,
  LuTrash2,
  LuUser,
} from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import type { DropdownItem } from '../../../ui/buttons/ActionsDropdown';
import { ActionsDropdown } from '../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../ui/card/Card';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import {
  OWNERSHIP_LABELS,
  STATUS_BADGE_VARIANT,
  VEHICLE_TYPE_LABELS,
} from '../constants';
import { useDeleteVehicle, useVehicle } from '../hooks';

type VehicleDetailsViewProps = {
  vehicleId: string;
  basePath: '/admin/vehicles' | '/staff/vehicles';
};

const VehicleDetailsView = ({
  vehicleId,
  basePath,
}: VehicleDetailsViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { vehicle, loading, error, refetch } = useVehicle(vehicleId);
  const { execute: deleteVehicle, loading: deleting } = useDeleteVehicle();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!vehicle) return;
    try {
      await deleteVehicle(vehicle.id);
      toast.success(
        'Vehicle deleted',
        `${vehicle.plate_number} has been removed.`,
      );
      router.push(basePath);
    } catch (err) {
      toast.error(
        'Could not delete the vehicle',
        err instanceof ApiError ? err.message : undefined,
      );
      setConfirmOpen(false);
    }
  };

  if (loading) return <Loading text="Loading vehicle…" />;

  if (error || !vehicle) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Vehicle not found.'}{' '}
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

  const actionItems: DropdownItem[] = [
    {
      label: 'Edit',
      icon: LuPencil,
      onClick: () => router.push(`${basePath}/${vehicle.id}/edit`),
      color: 'neutral',
    },
    {
      label: 'Delete',
      icon: LuTrash2,
      onClick: () => setConfirmOpen(true),
      color: 'danger',
    },
  ];

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to vehicles
      </Link>

      <PageHeader
        title={vehicle.plate_number}
        subtitle={`${VEHICLE_TYPE_LABELS[vehicle.vehicle_type]} — ${OWNERSHIP_LABELS[vehicle.ownership]} owned`}
        actions={<ActionsDropdown items={actionItems} />}
      />

      <div className="mb-5">
        <StatusBadge
          variant={
            STATUS_BADGE_VARIANT[vehicle.is_active ? 'active' : 'inactive']
          }
        >
          {vehicle.is_active ? 'Active' : 'Inactive'}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuUser className="size-4" />}
            label="Assigned driver"
            value={vehicle.assigned_driver_name || 'Unassigned'}
          />
          <InfoRow
            icon={<LuCreditCard className="size-4" />}
            label="Fleet card"
            value={vehicle.has_fleet_card ? 'Yes' : 'No'}
          />
        </div>
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete vehicle"
        message={`This permanently deletes "${vehicle.plate_number}" — this cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { VehicleDetailsView };
