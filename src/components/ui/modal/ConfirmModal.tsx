import type { ReactNode } from 'react';

import { Modal } from './Modal';

type ConfirmVariant = 'danger' | 'primary';

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  message: ReactNode;
  icon?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ConfirmVariant;
  loading?: boolean;
};

const CONFIRM_VARIANT_CLASSES: Record<ConfirmVariant, string> = {
  danger: 'bg-red-600 hover:bg-red-700',
  primary: 'bg-brand-600 hover:bg-brand-700',
};

/** Confirmation dialog built on top of Modal. Buttons are plain (rather
 * than the marketing-site `Button`, which is a large pill-shaped CTA
 * component not meant for compact dialog actions). */
const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  subtitle,
  message,
  icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
}: ConfirmModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    subtitle={subtitle}
    icon={icon}
    size="sm"
    footer={
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${CONFIRM_VARIANT_CLASSES[confirmVariant]}`}
        >
          {loading ? 'Please wait…' : confirmText}
        </button>
      </div>
    }
  >
    <p className="text-sm text-slate-600">{message}</p>
  </Modal>
);

export { ConfirmModal };
export type { ConfirmModalProps, ConfirmVariant };
