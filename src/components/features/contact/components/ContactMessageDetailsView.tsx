'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuMail,
  LuPencil,
  LuPhone,
  LuReply,
  LuTrash2,
  LuUser,
} from 'react-icons/lu';

import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import type { DropdownItem } from '../../../ui/buttons/ActionsDropdown';
import { ActionsDropdown } from '../../../ui/buttons/ActionsDropdown';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { FilterSelect } from '../../../ui/FilterSelect';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { STATUS_BADGE_VARIANT, STATUS_OPTIONS } from '../constants';
import {
  useContactMessage,
  useDeleteContactMessage,
  useUpdateContactStatus,
} from '../hooks';
import type { ContactMessageStatus } from '../types';

type ContactMessageDetailsViewProps = {
  messageId: string;
  basePath: '/admin/contact' | '/staff/contact';
  /** Admin only, per ContactMessageViewSet.get_permissions on the
   * backend — same real gate as the table's delete column. */
  canDelete: boolean;
};

const ContactMessageDetailsView = ({
  messageId,
  basePath,
  canDelete,
}: ContactMessageDetailsViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const { message, loading, error, refetch } = useContactMessage(messageId);
  const { execute: updateStatus, loading: updatingStatus } =
    useUpdateContactStatus();
  const { execute: deleteMessage, loading: deleting } =
    useDeleteContactMessage();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleStatusChange = async (value: string) => {
    if (!message || value === message.status) return;
    try {
      await updateStatus(message.id, value as ContactMessageStatus);
      toast.success('Status updated');
      refetch();
    } catch {
      toast.error('Could not update the status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!message) return;
    try {
      await deleteMessage(message.id);
      toast.success(
        'Message deleted',
        `The message from ${message.full_name} has been removed.`,
      );
      router.push(basePath);
    } catch {
      toast.error('Could not delete the message');
    }
  };

  if (loading) return <Loading text="Loading message…" />;

  if (error || !message) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Message not found.'}{' '}
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

  // Reply/Edit/Delete used to be three separate header buttons —
  // collapsed into one dropdown so the header stays a single control,
  // not a row that keeps growing every time an action is added.
  const actionItems: DropdownItem[] = [
    {
      label: 'Reply by email',
      icon: LuReply,
      onClick: () => {
        window.location.href = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`;
      },
      color: 'info',
    },
    ...(canDelete
      ? [
          {
            label: 'Edit',
            icon: LuPencil,
            onClick: () => router.push(`${basePath}/${message.id}/edit`),
            color: 'neutral' as const,
          },
          {
            label: 'Delete',
            icon: LuTrash2,
            onClick: () => setConfirmOpen(true),
            color: 'danger' as const,
          },
        ]
      : []),
  ];

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to messages
      </Link>

      <PageHeader
        title={message.subject}
        subtitle={`From ${message.full_name}`}
        actions={<ActionsDropdown items={actionItems} />}
      />

      <div className="mb-5">
        <StatusBadge variant={STATUS_BADGE_VARIANT[message.status]}>
          {STATUS_OPTIONS.find((o) => o.value === message.status)?.label}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuUser className="size-4" />}
            label="From"
            value={message.full_name}
          />
          <InfoRow
            icon={<LuMail className="size-4" />}
            label="Email"
            value={message.email}
          />
          <InfoRow
            icon={<LuPhone className="size-4" />}
            label="Contact details"
            value={message.phone_number}
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label="Submitted"
            value={<AppDate value={message.submitted_at} format="long" />}
          />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Message
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {message.message}
          </p>
        </div>
      </Card>

      <Card className="mt-4 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-900">Status</p>
        <FilterSelect
          value={message.status}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
          disabled={updatingStatus}
        />
      </Card>

      {canDelete && (
        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete message"
          message={`This permanently deletes the message from ${message.full_name}. This can't be undone.`}
          confirmText="Delete"
          confirmVariant="danger"
          loading={deleting}
        />
      )}
    </PageContainer>
  );
};

export { ContactMessageDetailsView };
