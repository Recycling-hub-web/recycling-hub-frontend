'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuPencil, LuTag, LuTrash2 } from 'react-icons/lu';

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
import { STATUS_BADGE_VARIANT } from '../constants';
import { useCategory, useDeleteCategory } from '../hooks';
import { getCategory } from '../services/categoryService';

type CategoryDetailsViewProps = {
  categoryId: string;
  basePath: '/admin/categories' | '/staff/categories';
};

const CategoryDetailsView = ({
  categoryId,
  basePath,
}: CategoryDetailsViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { category, loading, error, refetch } = useCategory(categoryId);
  const { execute: deleteCategory, loading: deleting } = useDeleteCategory();
  const [confirmOpen, setConfirmOpen] = useState(false);
  // The detail serializer nests `children` but not `parent` — it's just
  // an id — so resolve its name with one extra fetch rather than showing
  // a raw UUID.
  const [parentName, setParentName] = useState<string | null>(null);

  useEffect(() => {
    const parentId = category?.parent;
    if (!parentId) {
      setParentName(null);
      return undefined;
    }
    let cancelled = false;
    getCategory(parentId)
      .then((parent) => {
        if (!cancelled) setParentName(parent.name);
      })
      .catch(() => {
        if (!cancelled) setParentName(null);
      });
    return () => {
      cancelled = true;
    };
  }, [category?.parent]);

  const handleConfirmDelete = async () => {
    if (!category) return;
    try {
      await deleteCategory(category.id);
      toast.success(
        'Category deactivated',
        `${category.name} is now inactive.`,
      );
      refetch();
      setConfirmOpen(false);
    } catch (err) {
      toast.error(
        'Could not deactivate the category',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  if (loading) return <Loading text="Loading category…" />;

  if (error || !category) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Category not found.'}{' '}
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
      onClick: () => router.push(`${basePath}/${category.id}/edit`),
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
        Back to categories
      </Link>

      <PageHeader
        title={category.name}
        subtitle={`/${category.slug}`}
        actions={<ActionsDropdown items={actionItems} />}
      />

      <div className="mb-5">
        <StatusBadge
          variant={
            STATUS_BADGE_VARIANT[category.is_active ? 'active' : 'inactive']
          }
        >
          {category.is_active ? 'Active' : 'Inactive'}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={
              <span
                className="size-4 rounded-full"
                style={{ backgroundColor: category.hex_color }}
                aria-hidden
              />
            }
            label="Color"
            value={category.hex_color}
          />
          <InfoRow
            icon={<LuTag className="size-4" />}
            label="Parent category"
            value={
              category.parent
                ? parentName ?? 'Loading…'
                : 'None — top-level category'
            }
          />
        </div>

        {category.description && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Description
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {category.description}
            </p>
          </div>
        )}

        {(category.name_ar || category.description_ar) && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Arabic translation (auto-generated)
            </p>
            {category.name_ar && (
              <p dir="rtl" className="text-sm font-semibold text-slate-800">
                {category.name_ar}
              </p>
            )}
            {category.description_ar && (
              <p
                dir="rtl"
                className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-700"
              >
                {category.description_ar}
              </p>
            )}
          </div>
        )}
      </Card>

      {category.children.length > 0 && (
        <Card className="mt-4 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Subcategories
          </p>
          <div className="flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`${basePath}/${child.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: child.hex_color }}
                  aria-hidden
                />
                {child.name}
              </Link>
            ))}
          </div>
        </Card>
      )}

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Deactivate category"
        message={`This deactivates "${category.name}" — it stays visible here as Inactive and can be reactivated later, but pickup requests can no longer be created against it.`}
        confirmText="Deactivate"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { CategoryDetailsView };
