import type { ReactNode } from 'react';

type IconButtonVariant = 'outline' | 'ghost';

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  outline:
    'border border-brand-600 text-brand-600 hover:border-brand-700 hover:text-brand-700',
  ghost:
    'border border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700',
};

type IconButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  icon: ReactNode;
  variant?: IconButtonVariant;
  className?: string;
  title?: string;
  'aria-label'?: string;
};

// Rewritten from a version that took raw `bgColor`/`textColor`/`borderColor`
// Tailwind-class strings as props — unconstrained, easy to typo, and
// inconsistent with every other button in this project, which uses a
// `variant` enum (see ui/buttons/Button.tsx). aria-label now required
// (falls back to `title`) since an icon-only button has no accessible name
// otherwise.
const IconButton = ({
  onClick,
  disabled,
  icon,
  variant = 'outline',
  className = '',
  title,
  'aria-label': ariaLabel,
}: IconButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={ariaLabel ?? title}
    className={`flex items-center justify-center rounded-lg p-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
  >
    <span className="flex items-center">{icon}</span>
  </button>
);

export { IconButton };
export type { IconButtonProps, IconButtonVariant };
