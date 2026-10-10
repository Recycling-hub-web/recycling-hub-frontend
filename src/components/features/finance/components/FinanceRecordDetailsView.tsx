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
import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { ActivityLog } from '../../activity/components';
import { STATUS_BADGE_VARIANT } from '../constants';
import { useFinanceRecord } from '../hooks';
import { FINANCE_PAYMENT_METHOD_LABELS, FINANCE_STATUS_LABELS } from '../types';
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
  const { user } = useAuth();
  const canManage =
    user?.role === 'accounting' ||
    user?.role === 'admin' ||
    user?.role === 'staff';
  const basePath = `/${user?.role}/finance`;

  const { record, loading, error, refetch } = useFinanceRecord(recordId);
  const [reimburseOpen, setReimburseOpen] = useState(false);

  if (loading) return <Loading text="Loading finance record…" />;

  if (error || !record) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Finance record not found.'}{' '}
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

  const canReimburse = canManage && record.status === 'claimed';

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to finance records
      </Link>

      <PageHeader
        title={record.collection_request.full_name}
        subtitle={`${record.collection_request.category} — finance record`}
        actions={
          canReimburse ? (
            <Button onClick={() => setReimburseOpen(true)}>
              <LuWalletCards className="mr-1.5 size-4" />
              Verify & Reimburse
            </Button>
          ) : undefined
        }
      />

      <div className="mb-5">
        <StatusBadge variant={STATUS_BADGE_VARIANT[record.status]}>
          {FINANCE_STATUS_LABELS[record.status]}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuUser className="size-4" />}
            label="Requester"
            value={record.collection_request.full_name}
          />
          <InfoRow
            icon={<LuMapPin className="size-4" />}
            label="Pickup address"
            value={record.collection_request.pickup_address}
          />
          <InfoRow
            icon={<LuTruck className="size-4" />}
            label="Driver"
            value={record.driver ? record.driver.full_name : '—'}
          />
          <InfoRow
            icon={<LuPackage className="size-4" />}
            label="Agreed price"
            value={record.price}
          />
          <InfoRow
            icon={<LuPackage className="size-4" />}
            label="Actual paid"
            value={record.actual_amount ?? '—'}
          />
          <InfoRow
            icon={<LuWalletCards className="size-4" />}
            label="Payment method"
            value={
              record.payment_method
                ? FINANCE_PAYMENT_METHOD_LABELS[record.payment_method]
                : '—'
            }
          />
        </div>

        {record.proof_of_payment?.public_url && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Proof of payment (customer → driver)
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset */}
            <img
              src={record.proof_of_payment.public_url}
              alt=""
              className="size-32 rounded-xl border border-slate-200 object-cover"
            />
          </div>
        )}
      </Card>

      {record.status !== 'pending' && (
        <Card className="mt-4 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Claim & reimbursement
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {record.claimed_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label="Claimed at"
                value={<AppDate value={record.claimed_at} format="long" />}
              />
            )}
            {record.verified_by && (
              <InfoRow
                icon={<LuUserCheck className="size-4" />}
                label="Verified by"
                value={record.verified_by}
              />
            )}
            {record.verified_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label="Verified at"
                value={<AppDate value={record.verified_at} format="long" />}
              />
            )}
            {record.reimbursed_by && (
              <InfoRow
                icon={<LuUserCheck className="size-4" />}
                label="Reimbursed by"
                value={record.reimbursed_by}
              />
            )}
            {record.reimbursed_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label="Reimbursed at"
                value={<AppDate value={record.reimbursed_at} format="long" />}
              />
            )}
          </div>

          {record.reimbursement_proof?.public_url && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Reimbursement proof (accounting → driver)
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset */}
              <img
                src={record.reimbursement_proof.public_url}
                alt=""
                className="size-32 rounded-xl border border-slate-200 object-cover"
              />
            </div>
          )}
        </Card>
      )}

      <Card className="mt-4 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-900">Activity</p>
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
