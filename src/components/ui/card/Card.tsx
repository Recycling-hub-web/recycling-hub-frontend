import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

// Rewritten from a template version that relied on `shadow-shadow-500` /
// `bg-lightPrimary` — Tailwind tokens from a different project's config
// that don't exist here, so the card rendered with no visible shadow at all.
const Card = ({ children, className = '', ...rest }: CardProps) => (
  <div
    className={`relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export { Card };
export type { CardProps };
