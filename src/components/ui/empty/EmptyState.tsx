import Link from 'next/link';
import type { ReactNode } from 'react';

type EmptyStateAction =
  | { label: string; onClick: () => void; href?: never }
  | { label: string; href: string; onClick?: never };

type EmptyStateProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
};

const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    {icon && (
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400 ring-1 ring-slate-200">
        {icon}
      </div>
    )}

    <p className="text-base font-semibold text-slate-700">{title}</p>
    {description && (
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    )}

    {action &&
      (action.href ? (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700"
        >
          {action.label}
        </Link>
      ) : (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700"
        >
          {action.label}
        </button>
      ))}
  </div>
);

export { EmptyState };
export type { EmptyStateProps };
