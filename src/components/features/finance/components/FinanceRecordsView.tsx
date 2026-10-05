'use client';

import { useState } from 'react';

import { PageContainer } from '../../../layout/PageContainer';
import { PageHeader } from '../../../ui/PageHeader';
import { useFinanceRecords } from '../hooks';
import { FinanceRecordTable } from './FinanceRecordTable';

/** Accounting's first real page — read-only, no payment workflow yet
 * (explicitly deferred). One row per approved, priced pickup request
 * (see FinanceRecord on the backend, created by
 * CollectionRequestDecisionService.evaluate). */
const FinanceRecordsView = () => {
  const [page, setPage] = useState(1);
  const { records, count, loading, error, refetch } = useFinanceRecords({
    page,
  });

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Finance Records"
        subtitle="Priced pickup requests, ready for payment/invoicing."
      />

      <FinanceRecordTable
        records={records}
        count={count}
        page={page}
        onPageChange={setPage}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </PageContainer>
  );
};

export { FinanceRecordsView };
