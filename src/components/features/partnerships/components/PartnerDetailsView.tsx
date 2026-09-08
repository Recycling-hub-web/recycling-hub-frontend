'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuBuilding2,
  LuGlobe,
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
import { PARTNERSHIP_TYPE_LABELS, STATUS_BADGE_VARIANT } from '../constants';
import { useDeletePartner, usePartner } from '../hooks';

type PartnerDetailsViewProps = {
  partnerId: string;
  basePath: '/admin/partnerships' | '/staff/partnerships';
};

const PartnerDetailsView = ({
  partnerId,
  basePath,
}: PartnerDetailsViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { partner, loading, error, refetch } = usePartner(partnerId);
  const { execute: deletePartner, loading: deleting } = useDeletePartner();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!partner) return;
    try {
      await deletePartner(partner.id);
      toast.success('Partner deactivated', `${partner.name} is now inactive.`);
      refetch();
      setConfirmOpen(false);
    } catch (err) {
      toast.error(
        'Could not deactivate the partner',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  if (loading) return <Loading text="Loading partner…" />;

  if (error || !partner) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Partner not found.'}{' '}
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
      onClick: () => router.push(`${basePath}/${partner.id}/edit`),
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
        Back to partnerships
      </Link>

      <PageHeader
        title={partner.name}
        subtitle={PARTNERSHIP_TYPE_LABELS[partner.partnership_type]}
        actions={<ActionsDropdown items={actionItems} />}
      />

      <div className="mb-5 flex items-center gap-3">
        {partner.logo.public_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
          <img
            src={partner.logo.public_url}
            alt=""
            className="size-16 shrink-0 rounded-xl border border-slate-200 object-contain p-1.5"
          />
        ) : (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            <LuBuilding2 className="size-6" />
          </span>
        )}
        <StatusBadge
          variant={
            STATUS_BADGE_VARIANT[partner.is_active ? 'active' : 'inactive']
          }
        >
          {partner.is_active ? 'Active' : 'Inactive'}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuTag className="size-4" />}
            label="Partnership type"
            value={PARTNERSHIP_TYPE_LABELS[partner.partnership_type]}
          />
          <InfoRow
            icon={<LuGlobe className="size-4" />}
            label="Website"
            value={
              <a
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                {partner.website_url}
              </a>
            }
          />
        </div>
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Deactivate partner"
        message={`This deactivates "${partner.name}" — it stays visible here as Inactive and can be reactivated later, but it's removed from the public partners page.`}
        confirmText="Deactivate"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { PartnerDetailsView };
