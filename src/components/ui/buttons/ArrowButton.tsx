import Link from 'next/link';
import type { ReactNode } from 'react';

type ArrowButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const isExternal = (href: string) =>
  href.startsWith('http') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('https://wa.me');

const cls =
  'group inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 transition-all duration-300 hover:scale-[1.02]';

const ArrowButton = ({ href, children, className = '' }: ArrowButtonProps) => {
  const inner = (
    <>
      <span className="text-sm font-semibold text-neutral-950 sm:text-base">
        {children}
      </span>
      <span className="flex size-10 shrink-0 -rotate-45 items-center justify-center rounded-full bg-neutral-100 text-neutral-950 transition-all duration-300 group-hover:rotate-0 group-hover:bg-brand-600 group-hover:text-white">
        <ArrowIcon />
      </span>
    </>
  );

  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cls} ${className}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={`${cls} ${className}`}>
      {inner}
    </Link>
  );
};

export { ArrowButton };
