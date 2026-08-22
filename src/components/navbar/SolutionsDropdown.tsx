import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { LuArrowRight, LuChevronDown } from 'react-icons/lu';

import { SOLUTIONS } from '../../constants/content';
import { useDictionary } from '../../hooks/useDictionary';
import { SOLUTION_ICONS } from '../public/solutions/SolutionsGrid';

// Only the two active primary markets are linked directly from the nav —
// the other four segments are built and live at /solutions/<slug>, just not
// surfaced here yet. Reachable via "View All Solutions" below until the
// business is ready to actively market to those segments.
const NAV_SOLUTIONS = SOLUTIONS.filter((s) => s.priority);

const DOT_SPRING = { type: 'spring', stiffness: 600, damping: 25 } as const;

const NavDot = () => (
  <svg width="7" height="7" viewBox="0 0 7 7" fill="currentColor">
    <circle cx="3.5" cy="3.5" r="3.5" />
  </svg>
);

// ── Desktop dropdown ──────────────────────────────────────────────────────────

type SolutionsDropdownProps = {
  light: boolean;
};

const SolutionsDropdown = ({ light }: SolutionsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dict = useDictionary();

  const isActiveSolutions = router.pathname.startsWith('/solutions');
  const showDot = isActiveSolutions || open;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  const triggerActiveCls = light ? 'text-brand-600' : 'text-white';
  const triggerIdleCls = light
    ? 'text-slate-500 hover:text-neutral-950'
    : 'text-white/75 hover:text-white';
  const triggerCls = isActiveSolutions ? triggerActiveCls : triggerIdleCls;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`group flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200 lg:text-sm ${triggerCls}`}
      >
        <motion.span
          className="shrink-0"
          initial={false}
          animate={{ scale: showDot ? 1 : 0, opacity: showDot ? 1 : 0 }}
          whileHover={{ scale: 1.5 }}
          transition={DOT_SPRING}
          style={{ display: 'inline-flex' }}
        >
          <NavDot />
        </motion.span>
        {dict.nav.solutions}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ display: 'inline-flex' }}
        >
          <LuChevronDown size={13} strokeWidth={2.5} />
        </motion.span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-80 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            {NAV_SOLUTIONS.map(({ slug, icon, title, summary }) => {
              const href = `/solutions/${slug}`;
              const Icon = SOLUTION_ICONS[icon];
              const active = router.pathname === href;
              return (
                <Link
                  key={slug}
                  href={href}
                  className={`group flex w-full items-start gap-3 rounded-xl p-4 transition-colors duration-150 ${
                    active
                      ? 'border border-slate-200 bg-neutral-100'
                      : 'border border-transparent hover:border-slate-200 hover:bg-neutral-100'
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.75}
                    className={`mt-0.5 shrink-0 transition-colors duration-150 ${
                      active
                        ? 'text-neutral-700'
                        : 'text-slate-400 group-hover:text-neutral-700'
                    }`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold leading-snug transition-colors duration-150 ${
                        active
                          ? 'text-neutral-950'
                          : 'text-neutral-900 group-hover:text-neutral-950'
                      }`}
                    >
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {summary}
                    </p>
                  </div>
                </Link>
              );
            })}

            <Link
              href="/solutions"
              className="mt-1 flex items-center justify-between rounded-xl border-t border-slate-100 px-4 py-3 text-sm font-semibold text-brand-600 transition-colors duration-150 hover:bg-neutral-100"
            >
              {dict.nav.viewAllSolutions}
              <LuArrowRight size={15} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Mobile accordion ──────────────────────────────────────────────────────────

const SolutionsMobileAccordion = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dict = useDictionary();

  const isActiveSolutions = router.pathname.startsWith('/solutions');

  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
          isActiveSolutions
            ? 'bg-brand-50 text-brand-600'
            : 'text-slate-500 hover:bg-neutral-100 hover:text-neutral-950'
        }`}
      >
        <span className="flex items-center gap-2">
          {isActiveSolutions && (
            <motion.span
              className="shrink-0 text-brand-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={DOT_SPRING}
              style={{ display: 'inline-flex' }}
            >
              <NavDot />
            </motion.span>
          )}
          {dict.nav.solutions}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ display: 'inline-flex' }}
        >
          <LuChevronDown size={16} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-slate-200 pl-3">
              {NAV_SOLUTIONS.map(({ slug, icon, title }) => {
                const href = `/solutions/${slug}`;
                const Icon = SOLUTION_ICONS[icon];
                const active = router.pathname === href;
                return (
                  <Link
                    key={slug}
                    href={href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                      active
                        ? 'font-semibold text-brand-600'
                        : 'text-slate-500 hover:bg-neutral-100 hover:text-neutral-950'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.75} className="shrink-0" />
                    {title}
                  </Link>
                );
              })}
              <Link
                href="/solutions"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-neutral-100"
              >
                {dict.nav.viewAllSolutions}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { SolutionsDropdown, SolutionsMobileAccordion };
