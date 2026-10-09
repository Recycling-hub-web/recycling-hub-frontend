'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuClock,
  LuMapPin,
  LuPencil,
  LuTag,
  LuTrash2,
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
  useCollectionPoint,
  useDeleteCollectionPoint,
  useMaterialCategories,
} from '../hooks';

type CollectionPointDetailsViewProps = {
  collectionPointId: string;
  basePath: '/admin/collection-points' | '/staff/collection-points';
};

const CollectionPointDetailsView = ({
  collectionPointId,
  basePath,
}: CollectionPointDetailsViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { collectionPoint, loading, error, refetch } =
    useCollectionPoint(collectionPointId);
  const { execute: deleteCollectionPoint, loading: deleting } =
    useDeleteCollectionPoint();
  const { categories } = useMaterialCategories();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!collectionPoint) return;
    try {
      await deleteCollectionPoint(collectionPoint.id);
      toast.success(
        'Collection point deleted',
        `${collectionPoint.name} has been removed.`,
      );
      router.push(basePath);
    } catch (err) {
      toast.error(
        'Could not delete the collection point',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  if (loading) return <Loading text="Loading collection point…" />;

  if (error || !collectionPoint) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Collection point not found.'}{' '}
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
      onClick: () => router.push(`${basePath}/${collectionPoint.id}/edit`),
      color: 'neutral',
    },
    {
      label: 'Delete',
      icon: LuTrash2,
      onClick: () => setConfirmOpen(true),
      color: 'danger',
    },
  ];

  // accepted_categories is an array of plain ids on this serializer, not
  // nested objects — map back to names for display using the same
  // materials-categories list the form's picker uses.
  const acceptedCategoryNames = collectionPoint.accepted_categories
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to collection points
      </Link>

      <PageHeader
        title={collectionPoint.name}
        subtitle={collectionPoint.point_uid}
        actions={<ActionsDropdown items={actionItems} />}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge
          variant={collectionPoint.is_active ? 'success' : 'neutral'}
        >
          {collectionPoint.is_active ? 'Active' : 'Inactive'}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuMapPin className="size-4" />}
            label="Address"
            value={`${collectionPoint.address}, ${collectionPoint.city}${collectionPoint.postcode ? ` ${collectionPoint.postcode}` : ''}`}
          />
          {collectionPoint.operating_hours && (
            <InfoRow
              icon={<LuClock className="size-4" />}
              label="Operating hours"
              value={collectionPoint.operating_hours}
            />
          )}
        </div>

        {(collectionPoint.latitude || collectionPoint.longitude) && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Coordinates
            </p>
            <p className="text-sm text-slate-700">
              {collectionPoint.latitude}, {collectionPoint.longitude}
            </p>
          </div>
        )}

        {acceptedCategoryNames.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <LuTag className="size-3.5" />
              Accepted categories
            </p>
            <div className="flex flex-wrap gap-2">
              {acceptedCategoryNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {collectionPoint.name_ar && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Name (Arabic)
            </p>
            <p dir="rtl" className="text-sm font-semibold text-slate-800">
              {collectionPoint.name_ar}
            </p>
          </div>
        )}
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete collection point"
        message={`This permanently deletes "${collectionPoint.name}". This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { CollectionPointDetailsView };
