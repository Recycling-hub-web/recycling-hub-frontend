'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuPencil,
  LuTrash2,
  LuUser,
} from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { PageContainer } from '../../../layout/PageContainer';
import type { DropdownItem } from '../../../ui/buttons/ActionsDropdown';
import { ActionsDropdown } from '../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useClassification, useDeleteClassification } from '../hooks';

type ClassificationDetailsViewProps = {
  classificationId: string;
  basePath: '/admin/classifications' | '/staff/classifications';
};

const ClassificationDetailsView = ({
  classificationId,
  basePath,
}: ClassificationDetailsViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { classification, loading, error, refetch } =
    useClassification(classificationId);
  const { execute: deleteClassification, loading: deleting } =
    useDeleteClassification();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!classification) return;
    try {
      await deleteClassification(classification.id);
      toast.success(
        'Classification deleted',
        `${classification.name} has been removed.`,
      );
      router.push(basePath);
    } catch (err) {
      toast.error(
        'Could not delete the classification',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  if (loading) return <Loading text="Loading classification…" />;

  if (error || !classification) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Classification not found.'}{' '}
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
      onClick: () => router.push(`${basePath}/${classification.id}/edit`),
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
        Back to classifications
      </Link>

      <PageHeader
        title={classification.name}
        subtitle="Classification"
        actions={<ActionsDropdown items={actionItems} />}
      />

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuUser className="size-4" />}
            label="Assigned by"
            value={classification.assigned_by?.full_name ?? 'Unknown'}
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label="Assigned"
            value={<AppDate value={classification.assigned_at} format="long" />}
          />
        </div>

        {classification.description && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Description
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {classification.description}
            </p>
          </div>
        )}

        {(classification.name_ar || classification.description_ar) && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Arabic translation (auto-generated)
            </p>
            {classification.name_ar && (
              <p dir="rtl" className="text-sm font-semibold text-slate-800">
                {classification.name_ar}
              </p>
            )}
            {classification.description_ar && (
              <p
                dir="rtl"
                className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700"
              >
                {classification.description_ar}
              </p>
            )}
          </div>
        )}
      </Card>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete classification"
        message={`This permanently deletes "${classification.name}". This can't be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { ClassificationDetailsView };
