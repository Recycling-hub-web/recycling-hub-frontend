import Link from 'next/link';
import type { ReactNode } from 'react';

type LinkIconButtonVariant = 'outline' | 'ghost';

const VARIANT_CLASSES: Record<LinkIconButtonVariant, string> = {
  outline:
    'border border-brand-600 text-brand-600 hover:border-brand-700 hover:text-brand-700',
  ghost:
    'border border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700',
};

type LinkIconButtonProps = {
  href: string;
  icon: ReactNode;
  label?: string;
  title?: string;
  variant?: LinkIconButtonVariant;
  className?: string;
};

const isExternal = (href: string) =>
  href.startsWith('http') ||
  href.startsWith('//') ||
  href.startsWith('mailto:');

// Consolidates what were two near-identical files (a link with an optional
// label, and an icon-only variant of the same thing) into one component —
// `label` is just optional. Also fixes a padding bug in the original: it
// applied both `px-4 py-2` and a trailing `p-2` in the same class string,
// which is unpredictable (Tailwind's generated CSS order decides which
// wins, not the order written in the string).
const LinkIconButton = ({
  href,
  icon,
  label,
  title,
  variant = 'outline',
  className = '',
}: LinkIconButtonProps) => {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full border p-2 text-sm font-medium transition ${
    label ? 'px-4' : ''
  } ${VARIANT_CLASSES[variant]} ${className}`;

  const content = (
    <>
      {icon}
      {label && <span className="whitespace-nowrap">{label}</span>}
    </>
  );

  if (isExternal(href)) {
    return (
      <a
        href={href}
        title={title ?? label}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} title={title ?? label} className={classes}>
      {content}
    </Link>
  );
};

export { LinkIconButton };
export type { LinkIconButtonProps, LinkIconButtonVariant };
