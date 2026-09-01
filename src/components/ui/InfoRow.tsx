import type { ReactNode } from 'react';

type InfoRowProps = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
};

/** Reusable icon + label + value row for detail pages. */
const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3.5">
    {icon && (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/80">
        {icon}
      </div>
    )}
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="truncate text-sm font-semibold text-slate-800">
        {value}
      </div>
    </div>
  </div>
);

export { InfoRow };
export type { InfoRowProps };
