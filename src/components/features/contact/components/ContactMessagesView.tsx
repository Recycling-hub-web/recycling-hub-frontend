'use client';

import { useEffect, useState } from 'react';

import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { FilterSelect } from '../../../ui/FilterSelect';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { STATUS_FILTER_OPTIONS } from '../constants';
import { useContactMessages, useDeleteContactMessage } from '../hooks';
import type { ContactMessage, ContactMessageStatus } from '../types';
import { ContactMessageTable } from './ContactMessageTable';

const SEARCH_DEBOUNCE_MS = 350;

type ContactMessagesViewProps = {
  basePath: '/admin/contact' | '/staff/contact';
  canDelete: boolean;
};

/** One list view shared by /admin/contact and /staff/contact — same data,
 * same table, the only difference between the two role areas is whether
 * canDelete is true (enforced for real on the backend too, not just here
 * — see ContactMessageViewSet.get_permissions). */
const ContactMessagesView = ({
  basePath,
  canDelete,
}: ContactMessagesViewProps) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | ''>(
    '',
  );
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState<ContactMessage | null>(
    null,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { messages, count, loading, error, refetch } = useContactMessages({
    page,
    status: statusFilter || undefined,
    search: search || undefined,
  });
  const { execute: deleteMessage, loading: deleting } =
    useDeleteContactMessage();

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ContactMessageStatus | '');
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMessage(pendingDelete.id);
      toast.success(
        'Message deleted',
        `The message from ${pendingDelete.full_name} has been removed.`,
      );
      setPendingDelete(null);
      refetch();
    } catch {
      toast.error('Could not delete the message');
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Contact Messages"
        subtitle="Submissions from the public Contact Us form."
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, email, or subject…"
          className="sm:max-w-xs"
        />
        <FilterSelect
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={STATUS_FILTER_OPTIONS}
        />
      </div>

      <ContactMessageTable
        messages={messages}
        count={count}
        page={page}
        onPageChange={setPage}
        statusFilter={statusFilter}
        search={search}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath={basePath}
        canDelete={canDelete}
        onDeleteRequest={setPendingDelete}
      />

      {canDelete && (
        <ConfirmModal
          open={Boolean(pendingDelete)}
          onClose={() => setPendingDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete message"
          message={`This permanently deletes the message from ${pendingDelete?.full_name}. This can't be undone.`}
          confirmText="Delete"
          confirmVariant="danger"
          loading={deleting}
        />
      )}
    </PageContainer>
  );
};

export { ContactMessagesView };
