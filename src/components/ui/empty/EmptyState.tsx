import Link from 'next/link';
import type { ReactNode } from 'react';

type EmptyStateAction =
  | { label: string; onClick: () => void; href?: never }
  | { label: string; href: string; onClick?: never };

/** Every empty state has all three: an icon, a title saying what's
 * missing, and a description saying why or what to do next — required,
 * so a bare "No data" can't slip through type-checking. */
type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: EmptyStateAction;
  /** `compact` fits a fixed-height box (a chart); default is page/table. */
  size?: 'default' | 'compact';
};

const EmptyState = ({
  icon,
  title,
  description,
  action,
  size = 'default',
}: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center px-6 text-center ${size === 'compact' ? 'py-4' : 'py-16'}`}
  >
    <div
      className={`flex items-center justify-center bg-slate-100 text-slate-400 ring-1 ring-slate-200 ${size === 'compact' ? 'mb-3 size-12 rounded-xl text-xl' : 'mb-5 size-16 rounded-2xl text-2xl'}`}
    >
      {icon}
    </div>

    <p
      className={`font-semibold text-slate-700 ${size === 'compact' ? 'text-sm' : 'text-base'}`}
    >
      {title}
    </p>
    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-400">
      {description}
    </p>

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
