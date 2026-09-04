import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'white' | 'outline-white';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
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

const variants: Record<ButtonVariant, string> = {
  primary:
    'ring-2 ring-brand-600 ring-offset-2 bg-brand-600 text-white hover:bg-brand-700 hover:ring-brand-700',
  secondary:
    'ring-2 ring-slate-200 ring-offset-2 bg-white text-neutral-950 hover:bg-brand-600 hover:text-white hover:ring-brand-600',
  white:
    'ring-2 ring-white ring-offset-2 ring-offset-neutral-950 bg-white text-neutral-950 hover:bg-white/90',
  'outline-white':
    'ring-2 ring-white/60 ring-offset-2 ring-offset-transparent bg-white/10 text-white hover:bg-white/20 hover:ring-white',
};

const base =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out cursor-pointer';

const isExternal = (href: string) =>
  href.startsWith('http') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('https://wa.me');

const Button = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const cls = `${base} ${variants[variant]} ${className} ${disabled ? 'pointer-events-none opacity-50' : ''}`;

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
