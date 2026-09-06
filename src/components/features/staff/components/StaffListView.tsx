'use client';

import { useState } from 'react';
import { LuDownload, LuPlus } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useDeleteStaff, useExportStaffReport, useStaffList } from '../hooks';
import type { StaffListItem } from '../types';
import { StaffTable } from './StaffTable';

/** Admin-only — StaffManagementView's create/update/delete are all
 * IsAdminUser (list is also open to staff, but only for the Pickups
 * collector picker, not any UI screen — see collectorService.ts). No
 * search box: the endpoint has no search_fields/filter_backends at all,
 * confirmed by reading StaffManagementView directly, so this doesn't
 * pretend to filter something the backend can't. */
const StaffListView = () => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<StaffListItem | null>(
    null,
  );

  const { staff, count, loading, error, refetch } = useStaffList(page);
  const { execute: deleteStaffMember, loading: deleting } = useDeleteStaff();
  const { execute: exportReport, loading: exporting } = useExportStaffReport();

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteStaffMember(pendingDelete.id);
      toast.success(
        'Staff profile deleted',
        `"${pendingDelete.user.full_name}" has been removed from staff. Their user account is unaffected.`,
      );
      setPendingDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        'Could not delete this staff profile',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  const handleExport = async () => {
    try {
      await exportReport();
    } catch (err) {
      toast.error(
        'Could not export the staff report',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Staff Management"
        subtitle="Manage employee profiles, employment details, and photos."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={exporting}
            >
              <LuDownload className="mr-1.5 size-4" />
              {exporting ? 'Exporting…' : 'Export'}
            </Button>
            <Button href="/admin/staff/create">
              <LuPlus className="mr-1.5 size-4" />
              New staff
            </Button>
          </>
        }
      />

      <StaffTable
        staff={staff}
        count={count}
        page={page}
        onPageChange={setPage}
        loading={loading}
        error={error}
        onRetry={refetch}
        onDeleteRequest={setPendingDelete}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete staff profile"
        message={`This permanently deletes "${pendingDelete?.user.full_name}"'s staff profile (employee ID, department, position, branch). Their user account is not deleted.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { StaffListView };
