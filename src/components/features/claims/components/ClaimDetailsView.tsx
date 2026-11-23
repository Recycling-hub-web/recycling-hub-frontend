'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuCircleCheck,
  LuCircleX,
  LuTruck,
  LuUser,
  LuWalletCards,
} from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { formatMYR } from '../../../../lib/money';
import { isAdminRole } from '../../../../types/auth';
import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import type { DropdownItem } from '../../../ui/buttons/ActionsDropdown';
import { ActionsDropdown } from '../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { STATUS_BADGE_VARIANT } from '../constants';
import { useClaim } from '../hooks';
import {
  CLAIM_CATEGORY_LABELS,
  CLAIM_STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
} from '../types';
import { ApproveRejectModal } from './ApproveRejectModal';

type ClaimDetailsViewProps = {
  claimId: string;
};

/** Accounting/admin's full review surface (Approve & mark as paid/Reject
 * via ActionsDropdown); staff and the owning driver see the same page
 * read-only — no dropdown at all, same split as Finance's own details
 * view. */
const ClaimDetailsView = ({ claimId }: ClaimDetailsViewProps) => {
  const { t, locale } = usePortalLocale();
  const { user } = useAuth();
  const canManage = user?.role === 'accounting' || isAdminRole(user?.role);
  const basePath =
    user?.role === 'super_admin'
      ? '/super-admin/claims'
      : `/${user?.role}/claims`;

  const { claim, loading, error, refetch } = useClaim(claimId);
  const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null);

  if (loading) return <Loading text={t('Loading claim…')} />;

  if (error || !claim) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {t(error || 'Claim not found.')}{' '}
        <button
          type="button"
          onClick={refetch}
          className="font-semibold underline"
        >
          {t('Retry')}
        </button>
      </div>
    );
  }

  const dropdownItems: DropdownItem[] = [
    {
      label: t('Approve & mark as paid'),
      icon: LuCircleCheck,
      color: 'success',
      disabled: claim.status !== 'pending',
      onClick: () => setModalMode('approve'),
    },
    {
      label: t('Reject'),
      icon: LuCircleX,
      color: 'danger',
      disabled: claim.status !== 'pending',
      onClick: () => setModalMode('reject'),
    },
  ];

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 lg:mb-4 lg:min-h-0"
      >
        <LuArrowLeft className="size-4" />
        {t('Back to expense claims')}
      </Link>

      <PageHeader
        title={t('{name} — {category} claim', {
          name: claim.driver.full_name,
          category: t(CLAIM_CATEGORY_LABELS[claim.category]),
        })}
        subtitle={t('Submitted {date}', {
          date: new Intl.DateTimeFormat(locale === 'bm' ? 'ms-MY' : 'en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(new Date(claim.date)),
        })}
        actions={
          canManage ? (
            <ActionsDropdown label={t('Actions')} items={dropdownItems} />
          ) : undefined
        }
      />

      <div className="mb-5">
        <StatusBadge variant={STATUS_BADGE_VARIANT[claim.status]}>
          {t(CLAIM_STATUS_LABELS[claim.status])}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuUser className="size-4" />}
            label={t('Driver')}
            value={claim.driver.full_name}
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label={t('Date')}
            value={
              <AppDate
                value={claim.date}
                format="short"
                locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
              />
            }
          />
          {claim.vehicle && (
            <InfoRow
              icon={<LuTruck className="size-4" />}
              label={t('Vehicle')}
              value={`${claim.vehicle.plate_number} (${t(VEHICLE_TYPE_LABELS[claim.vehicle.vehicle_type])})`}
            />
          )}
          <InfoRow
            icon={<LuWalletCards className="size-4" />}
            label={t('Amount claimed')}
            value={formatMYR(claim.amount_claimed)}
          />
          {claim.amount_approved !== null && (
            <InfoRow
              icon={<LuWalletCards className="size-4" />}
              label={t('Amount approved')}
              value={formatMYR(claim.amount_approved)}
            />
          )}
        </div>

        {claim.receipt?.public_url && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
              {t('Receipt')}
            </p>
            <a
              href={claim.receipt.public_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-brand-700 underline"
            >
              {t('View receipt')}
            </a>
          </div>
        )}

        {claim.payment_proof && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
              {t('Payment proof')}
            </p>
            {claim.payment_proof.public_url ? (
              <a
                href={claim.payment_proof.public_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-brand-700 underline"
              >
                {t('View payment proof')}
              </a>
            ) : (
              <p className="text-sm text-slate-600">
                {claim.payment_proof.file_key}
              </p>
            )}
          </div>
        )}

        {claim.status === 'rejected' && claim.rejection_reason && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
              {t('Rejection reason')}
            </p>
            <p className="text-sm text-slate-700">{claim.rejection_reason}</p>
          </div>
        )}
      </Card>

      {claim.status !== 'pending' && (
        <Card className="mt-4 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            {t('Review & payout')}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {claim.reviewed_by && (
              <InfoRow
                icon={<LuUser className="size-4" />}
                label={t('Reviewed by')}
                value={claim.reviewed_by}
              />
            )}
            {claim.reviewed_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label={t('Reviewed at')}
                value={
                  <AppDate
                    value={claim.reviewed_at}
                    format="long"
                    locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
                  />
                }
              />
            )}
            {claim.paid_by && (
              <InfoRow
                icon={<LuUser className="size-4" />}
                label={t('Paid by')}
                value={claim.paid_by}
              />
            )}
            {claim.paid_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label={t('Paid at')}
                value={
                  <AppDate
                    value={claim.paid_at}
                    format="long"
                    locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
                  />
                }
              />
            )}
          </div>
        </Card>
      )}

      {modalMode && (
        <ApproveRejectModal
          claim={claim}
          mode={modalMode}
          open
          onClose={() => setModalMode(null)}
          onDone={refetch}
        />
      )}
    </PageContainer>
  );
};

export { ClaimDetailsView };
