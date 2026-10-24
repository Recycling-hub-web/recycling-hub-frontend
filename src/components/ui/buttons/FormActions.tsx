import type { ReactNode } from 'react';

type FormActionsProps = {
  children: ReactNode;
  className?: string;
};

/** The row of action buttons at the end of a form or modal (Cancel,
 * Save, …) — always right-aligned, each button at its natural width,
 * wrapping onto a second line rather than overflowing on narrow
 * screens. Use this instead of a hand-rolled flex row so every form's
 * buttons line up the same way. */
const FormActions = ({ children, className = '' }: FormActionsProps) => (
  <div className={`flex flex-wrap items-center justify-end gap-3 ${className}`}>
    {children}
  </div>
);

export { FormActions };
export type { FormActionsProps };
