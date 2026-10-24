'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';
import { LuCheck, LuInfo, LuTriangleAlert, LuX } from 'react-icons/lu';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastOptions = {
  type?: ToastType;
  title?: string;
  message?: string;
  /** ms before auto-dismiss; 0 disables auto-dismiss. */
  duration?: number;
};

type ToastEntry = { id: number } & Required<Pick<ToastOptions, 'type'>> &
  Pick<ToastOptions, 'title' | 'message'>;

type ToastContextValue = {
  toast: (options: ToastOptions) => number;
  success: (title: string, message?: string, opts?: ToastOptions) => number;
  error: (title: string, message?: string, opts?: ToastOptions) => number;
  warning: (title: string, message?: string, opts?: ToastOptions) => number;
  info: (title: string, message?: string, opts?: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

const STYLES: Record<
  ToastType,
  { bar: string; iconBg: string; Icon: typeof LuCheck }
> = {
  success: {
    bar: 'bg-brand-600',
    iconBg: 'bg-brand-50 text-brand-600',
    Icon: LuCheck,
  },
  error: { bar: 'bg-red-500', iconBg: 'bg-red-50 text-red-500', Icon: LuX },
  warning: {
    bar: 'bg-amber-400',
    iconBg: 'bg-amber-50 text-amber-500',
    Icon: LuTriangleAlert,
  },
  info: {
    bar: 'bg-blue-500',
    iconBg: 'bg-blue-50 text-blue-500',
    Icon: LuInfo,
  },
};

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: ToastEntry;
  onDismiss: (id: number) => void;
}) => {
  const { bar, iconBg, Icon } = STYLES[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto flex w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60"
    >
      <div className={`w-1 shrink-0 ${bar}`} />

      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        <span
          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          {toast.title && (
            <p className="text-sm font-semibold text-slate-900">
              {toast.title}
            </p>
          )}
          {toast.message && (
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="ml-1 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
        >
          <LuX className="size-3" />
        </button>
      </div>
    </motion.div>
  );
};

const ToastContainer = ({
  toasts,
  onDismiss,
}: {
  toasts: ToastEntry[];
  onDismiss: (id: number) => void;
}) => (
  <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5">
    <AnimatePresence>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
);

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = type === 'error' ? 7000 : 4000,
    }: ToastOptions) => {
      nextId += 1;
      const id = nextId;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const success = useCallback(
    (title: string, message?: string, opts?: ToastOptions) =>
      toast({ type: 'success', title, message, ...opts }),
    [toast],
  );
  const error = useCallback(
    (title: string, message?: string, opts?: ToastOptions) =>
      toast({ type: 'error', title, message, ...opts }),
    [toast],
  );
  const warning = useCallback(
    (title: string, message?: string, opts?: ToastOptions) =>
      toast({ type: 'warning', title, message, ...opts }),
    [toast],
  );
  const info = useCallback(
    (title: string, message?: string, opts?: ToastOptions) =>
      toast({ type: 'info', title, message, ...opts }),
    [toast],
  );

  return (
    <ToastContext.Provider
      value={{ toast, success, error, warning, info, dismiss }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

export { ToastProvider, useToast };
export type { ToastOptions, ToastType };
