import type { ReactNode } from 'react';
import {
  LuCircleAlert,
  LuCircleCheck,
  LuInfo,
  LuTriangleAlert,
} from 'react-icons/lu';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-600',
  success: 'border-brand-200 bg-brand-50 text-brand-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-600',
  info: 'border-blue-200 bg-blue-50 text-blue-600',
};

const VARIANT_ICON: Record<AlertVariant, ReactNode> = {
  error: <LuCircleAlert className="size-4 shrink-0" />,
  success: <LuCircleCheck className="size-4 shrink-0" />,
  warning: <LuTriangleAlert className="size-4 shrink-0" />,
  info: <LuInfo className="size-4 shrink-0" />,
};

type AlertBannerProps = {
  /** Renders nothing if falsy — lets callers write `<AlertBanner message={error} />` unconditionally. */
  message?: ReactNode;
  variant?: AlertVariant;
  className?: string;
};

const AlertBanner = ({
  message,
  variant = 'error',
  className,
}: AlertBannerProps) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2.5 text-sm font-medium ${className ?? 'mb-4 rounded-xl border px-4 py-3'} ${VARIANT_CLASSES[variant]}`}
    >
      {VARIANT_ICON[variant]}
      <span>{message}</span>
    </div>
  );
};

export { AlertBanner };
export type { AlertBannerProps, AlertVariant };
