import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'white'
  | 'outline-white'
  | 'danger-outline';

type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Ignored when `href` is set (an anchor/Link has no submit behavior).
   * Defaults to 'button' — pass 'submit' to make this a real form
   * submit trigger rather than requiring a separate onClick that
   * duplicates the form's own submit handler. */
  type?: 'button' | 'submit';
  disabled?: boolean;
};

// Flat colors only — no ring/ring-offset halo. Variants that need to
// read as "outlined" use a plain 1px border instead.
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary:
    'border border-slate-200 bg-white text-neutral-950 hover:border-brand-600 hover:bg-brand-600 hover:text-white',
  white: 'bg-white text-neutral-950 hover:bg-white/90',
  'outline-white':
    'border border-white/60 bg-white/10 text-white hover:border-white hover:bg-white/20',
  'danger-outline':
    'border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

// transition-all so background-color, border-color and transform
// (whichever a variant/hover state actually changes) all animate
// smoothly together rather than snapping. No shadows — buttons stay
// flat, lifting slightly on hover instead.
const base =
  'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 ease-out cursor-pointer hover:-translate-y-0.5 active:translate-y-0';

const isExternal = (href: string) =>
  href.startsWith('http') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('https://wa.me');

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className} ${disabled ? 'pointer-events-none opacity-50' : ''}`;

  if (href) {
    if (isExternal(href)) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
};

export { Button };
