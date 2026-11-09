import type { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  /** Right of the title — e.g. an Edit button. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A bordered section with a title row and an optional action, e.g. one
 * card per step on a step form's review. Card and SectionContainer are
 * plain boxes with no title or action slot; this adds just that. */
const SectionCard = ({
  title,
  action,
  children,
  className = '',
}: SectionCardProps) => (
  <section
    className={`rounded-2xl border border-slate-200 bg-white ${className}`}
  >
    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
      <h3 className="text-sm font-semibold text-neutral-950">{title}</h3>
      {action}
    </header>
    <div className="px-5 py-4">{children}</div>
  </section>
);

export { SectionCard };
export type { SectionCardProps };
