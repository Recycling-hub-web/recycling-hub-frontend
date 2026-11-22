'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';

import { usePortalLocale } from '../../../contexts/PortalLocaleContext';
import { useSystemExperience } from '../../../contexts/SystemExperienceContext';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  dismissible?: boolean;
};

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  dismissible = true,
}: ModalProps) => {
  const { t } = usePortalLocale();
  const system = useSystemExperience();
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isTopDialog = () => {
    const dialogs = document.querySelectorAll(
      '[role="dialog"][aria-modal="true"]',
    );
    return dialogs[dialogs.length - 1] === dialogRef.current;
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !visible || !dialog) return undefined;
    const opener = document.activeElement;
    const focusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button, input, select, textarea, [tabindex]',
        ),
      ).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.matches(':disabled, [hidden], [aria-hidden="true"]') &&
          element.getClientRects().length > 0,
      );
    const focusFirst = () => (focusable()[0] ?? dialog).focus();
    focusFirst();
    const trapTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !isTopDialog()) return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === dialog)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (isTopDialog() && !dialog.contains(event.target as Node)) focusFirst();
    };
    document.addEventListener('keydown', trapTab);
    document.addEventListener('focusin', containFocus);
    return () => {
      document.removeEventListener('keydown', trapTab);
      document.removeEventListener('focusin', containFocus);
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [open, visible]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      // Double rAF: wait for the element to be painted before adding the
      // transition classes, so the enter animation actually plays.
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShown(true)),
      );
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const timer = setTimeout(() => setVisible(false), 200);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissible && isTopDialog()) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, dismissible]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <div
      data-lenis-prevent
      className={`${system ? 'system-modal-backdrop' : ''} fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        shown ? 'bg-black/40' : 'bg-black/0'
      }`}
      onClick={closeOnBackdrop && dismissible ? onClose : undefined}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-shown={shown}
        className={`${system ? 'system-modal-panel' : ''} relative flex w-full ${SIZE_CLASSES[size]} max-h-[90dvh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
          shown
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || icon) && (
          <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex min-w-0 items-center gap-2.5">
              {icon}
              <div className="min-w-0">
                <h2 className="break-words text-sm font-bold text-slate-900">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-0.5 break-words text-xs leading-relaxed text-slate-600">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              disabled={!dismissible}
              onClick={onClose}
              aria-label={t('Close dialog')}
              className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <LuX className="size-4" />
            </button>
          </div>
        )}

        {/* The only part that scrolls — header and footer stay put, so a
         * tall form (e.g. CollectModal with several items) never hides
         * its own action buttons below an unreachable fold: the body's
         * own scroll is locked while a modal is open (see the effect
         * above), so without this the content below max-h simply had no
         * way to reach the screen at all, not just an awkward one. */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-slate-100 px-5 pb-5 pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export { Modal };
export type { ModalProps, ModalSize };
