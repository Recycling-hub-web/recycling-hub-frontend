'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuMapPin,
  LuPackage,
  LuTruck,
  LuUser,
  LuUserCheck,
  LuWalletCards,
} from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { formatMYR } from '../../../../lib/money';
import { isAdminRole } from '../../../../types/auth';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { ActivityLog } from '../../activity/components';
import { DriverBankDetails } from '../../drivers/DriverBankDetails';
import { STATUS_BADGE_VARIANT } from '../constants';
import { reimbursementBlocker } from '../eligibility';
import { useFinanceRecord } from '../hooks';
import {
  DRIVER_FINANCE_STATUS_LABELS,
  FINANCE_PAYMENT_METHOD_LABELS,
  FINANCE_STATUS_LABELS,
} from '../types';
import { ReimburseModal } from './ReimburseModal';

type FinanceRecordDetailsViewProps = {
  recordId: string;
};

/** Accounting/admin/staff's full record view; a driver sees the same
 * page read-only (no Verify & Reimburse action — 403 on the backend
 * anyway, see FinanceRecordViewSet.get_permissions), same split
 * FinanceRecordsView's own table already makes. */
const FinanceRecordDetailsView = ({
  recordId,
}: FinanceRecordDetailsViewProps) => {
  const { t, locale } = usePortalLocale();
  const { user } = useAuth();
  const canManage =
    user?.role === 'accounting' ||
    isAdminRole(user?.role) ||
    user?.role === 'staff';
  // Admin no longer has a Finance Records route of its own (moved to
  // Super Admin's own section) — see FinanceRecordsView's matching
  // basePath for the full explanation.
  const basePath =
    user?.role === 'super_admin'
      ? '/super-admin/finance'
      : `/${user?.role}/finance`;

  const { record, loading, error, refetch } = useFinanceRecord(recordId);
  const [reimburseOpen, setReimburseOpen] = useState(false);

  if (loading) return <Loading text={t('Loading finance record…')} />;

  if (error || !record) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {t(error || 'Finance record not found.')}{' '}
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

  const canReimburse = canManage && !reimbursementBlocker(record);

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 lg:mb-4 lg:min-h-0"
      >
        <LuArrowLeft className="size-4" />
        {t('Back to finance records')}
      </Link>

      <PageHeader
        title={record.collection_request.full_name}
        subtitle={t('{items} — finance record', {
          items: record.collection_request.items_summary,
        })}
        actions={
          canReimburse ? (
            <Button onClick={() => setReimburseOpen(true)}>
              <LuWalletCards className="mr-1.5 size-4" />
              {t('Verify & Reimburse')}
            </Button>
          ) : undefined
        }
      />

      <div className="mb-5">
        <StatusBadge
          variant={
            user?.role === 'driver' &&
            (record.status === 'claimed' || record.status === 'verified')
              ? 'success'
              : STATUS_BADGE_VARIANT[record.status]
          }
        >
          {user?.role === 'driver'
            ? t(DRIVER_FINANCE_STATUS_LABELS[record.status])
            : t(FINANCE_STATUS_LABELS[record.status])}
        </StatusBadge>
      </div>

      {canManage && record.driver && record.status !== 'reimbursed' && (
        <AlertBanner
          message={t(reimbursementBlocker(record))}
          variant="warning"
        />
      )}
      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuUser className="size-4" />}
            label={t('Requester')}
            value={record.collection_request.full_name}
          />
          <InfoRow
            icon={<LuMapPin className="size-4" />}
            label={t('Pickup address')}
            value={record.collection_request.pickup_address}
          />
          <InfoRow
            icon={<LuTruck className="size-4" />}
            label={t('Driver')}
            value={record.driver ? record.driver.full_name : '—'}
          />
          <InfoRow
            icon={<LuPackage className="size-4" />}
            label={t('Agreed price')}
            value={formatMYR(record.price)}
          />
          <InfoRow
            icon={<LuPackage className="size-4" />}
            label={t('Actual paid')}
            value={formatMYR(record.actual_amount)}
          />
          <InfoRow
            icon={<LuWalletCards className="size-4" />}
            label={t('Payment method')}
            value={
              record.payment_method
                ? t(FINANCE_PAYMENT_METHOD_LABELS[record.payment_method])
                : '—'
            }
          />
        </div>

        {record.items.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
              {t('Itemized price breakdown')}
            </p>
            <ul className="space-y-0.5 text-sm text-slate-700">
              {record.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>{item.category}</span>
                  <span>{formatMYR(item.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {record.proof_of_payment?.public_url && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
              {t('Proof of payment (driver → customer)')}
            </p>
            <a
              href={record.proof_of_payment.public_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-brand-700 underline"
            >
              {t('View payment proof')}
            </a>
          </div>
        )}
      </Card>

      {record.driver && (
        <DriverBankDetails
          details={record.driver}
          canEdit={isAdminRole(user?.role)}
          onSaved={refetch}
        />
      )}

      {record.status !== 'pending' && (
        <Card className="mt-4 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            {user?.role === 'driver'
              ? t('Customer payment & reimbursement')
              : t('Payment review & reimbursement')}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {record.claimed_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label={t('Payment recorded at')}
                value={
                  <AppDate
                    value={record.claimed_at}
                    format="long"
                    locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
                  />
                }
              />
            )}
            {record.verified_by && (
              <InfoRow
                icon={<LuUserCheck className="size-4" />}
                label={t('Verified by')}
                value={record.verified_by}
              />
            )}
            {record.verified_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label={t('Verified at')}
                value={
                  <AppDate
                    value={record.verified_at}
                    format="long"
                    locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
                  />
                }
              />
            )}
            {record.reimbursed_by && (
              <InfoRow
                icon={<LuUserCheck className="size-4" />}
                label={t('Reimbursed by')}
                value={record.reimbursed_by}
              />
            )}
            {record.reimbursed_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label={t('Reimbursed at')}
                value={
                  <AppDate
                    value={record.reimbursed_at}
                    format="long"
                    locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
                  />
                }
              />
            )}
          </div>

          {record.reimbursement_proof?.public_url && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                {t('Reimbursement proof (accounting → driver)')}
              </p>
              <a
                href={record.reimbursement_proof.public_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-brand-700 underline"
              >
                {t('View reimbursement proof')}
              </a>
            </div>
          )}
        </Card>
      )}

      <Card className="mt-4 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-900">
          {t('Activity')}
        </p>
        <ActivityLog entityType="financerecord" entityId={record.id} />
      </Card>

      <ReimburseModal
        ids={[record.id]}
        open={reimburseOpen}
        onClose={() => setReimburseOpen(false)}
        onReimbursed={() => {
          setReimburseOpen(false);
          refetch();
        }}
      />
    </PageContainer>
  );
};

export { FinanceRecordDetailsView };
