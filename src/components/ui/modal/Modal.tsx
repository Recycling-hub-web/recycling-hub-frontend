'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';

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
}: ModalProps) => {
  const system = useSystemExperience();
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);

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
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`${system ? 'system-modal-backdrop' : ''} fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        shown ? 'bg-black/40' : 'bg-black/0'
      }`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-shown={shown}
        className={`${system ? 'system-modal-panel' : ''} relative flex w-full ${SIZE_CLASSES[size]} max-h-[90dvh] flex-col rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
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
                <h2 className="truncate text-sm font-bold text-slate-900">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="ml-3 flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
        <div className="overflow-y-auto px-5 py-4">{children}</div>

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
