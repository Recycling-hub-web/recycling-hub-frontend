import type { ReactNode } from 'react';

type PageHeaderProps = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** Adds a bottom border and tightens the type scale — for headers sitting
   * directly above a form rather than at the top of a whole page. Merges
   * what were two near-duplicate components (PageHeader vs FormHeader). */
  bordered?: boolean;
  className?: string;
};

const PageHeader = ({
  icon,
  title,
  subtitle,
  actions,
  bordered = false,
  className = '',
}: PageHeaderProps) => (
  <div
    className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
      bordered ? 'border-b border-slate-200 pb-5' : ''
    } ${className}`}
  >
    <div className="flex min-w-0 items-center gap-3">
      {icon && (
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ${
            bordered ? 'size-10' : 'size-11'
          }`}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h1
          className={`truncate font-bold text-slate-900 ${bordered ? 'text-base' : 'text-xl'}`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`truncate text-slate-400 ${bordered ? 'text-xs' : 'mt-0.5 text-sm'}`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>

    {actions && (
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {actions}
      </div>
    )}
  </div>
);

export { PageHeader };
export type { PageHeaderProps };
