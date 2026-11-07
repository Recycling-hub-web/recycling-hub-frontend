import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useId, useRef, useState } from 'react';
import { LuArrowRight, LuChevronDown } from 'react-icons/lu';

import { SERVICE_GROUPS } from '../../constants/content';
import { useDictionary } from '../../hooks/useDictionary';
import { SERVICE_ICONS } from '../public/services/ServicesGrid';

const ServiceMenuLinks = ({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate: () => void;
}) => {
  const dict = useDictionary();
  const { pathname } = useRouter();
  return (
    <>
      {SERVICE_GROUPS.filter(({ key }) => key === 'main').map(
        ({ key, items }) => (
          <div
            key={key}
            className={
              key === 'support' ? 'mt-2 border-t border-slate-100 pt-3' : ''
            }
          >
            <p className="px-3 pb-2 pt-1 text-xs font-semibold text-slate-500">
              {key === 'main'
                ? dict.nav.serviceGroupMain
                : dict.nav.serviceGroupSupport}
            </p>
            <div
              className={
                compact ? 'flex flex-col gap-1' : 'grid grid-cols-2 gap-1'
              }
            >
              {items.map(({ slug, icon }) => {
                const href = `/services/${slug}`;
                const active = pathname === href;
                const Icon = SERVICE_ICONS[icon];
                const { title, summary } = dict.services.cards[slug];
                return (
                  <Link
                    key={slug}
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-11 items-start gap-3 rounded-xl p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 ${active ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50 hover:text-brand-700'}`}
                  >
                    <Icon
                      size={18}
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {title}
                      </span>
                      {!compact && (
                        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-500">
                          {summary}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ),
      )}
      <Link
        href="/services"
        onClick={onNavigate}
        className="mt-3 flex min-h-11 items-center justify-between rounded-xl border-t border-slate-100 p-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
      >
        {dict.nav.viewAllServices}
        <LuArrowRight size={16} aria-hidden="true" />
      </Link>
      <Link
        href="/solutions"
        onClick={onNavigate}
        className="flex min-h-11 items-center justify-between rounded-xl p-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
      >
        {dict.nav.whoWeHelp}
        <LuArrowRight size={16} aria-hidden="true" />
      </Link>
    </>
  );
};

const ServicesDropdown = ({ light }: { light: boolean }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const { pathname, locale } = useRouter();
  const dict = useDictionary();
  const active = pathname.startsWith('/services');
  let triggerColor = 'text-white hover:text-white/80';
  if (light) {
    triggerColor = active
      ? 'text-brand-700'
      : 'text-slate-600 hover:text-neutral-950';
  }
  useEffect(() => {
    setOpen(false);
  }, [pathname, locale]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() =>
              wrapperRef.current?.querySelector('a')?.focus(),
            );
          }
        }}
        className={`flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 ${triggerColor}`}
      >
        {dict.nav.services}
        <LuChevronDown
          size={14}
          aria-hidden="true"
          className={
            open ? 'rotate-180 transition-transform' : 'transition-transform'
          }
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 w-[38rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-2"
          >
            <div className="max-h-[calc(100dvh-110px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <ServiceMenuLinks onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServicesMobileAccordion = () => {
  const [open, setOpen] = useState(false);
  const { pathname, locale } = useRouter();
  const dict = useDictionary();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname, locale]);
  return (
    <div
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium ${pathname.startsWith('/services') ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
      >
        {dict.nav.services}
        <LuChevronDown
          size={16}
          aria-hidden="true"
          className={
            open ? 'rotate-180 transition-transform' : 'transition-transform'
          }
        />
      </button>
      {open && (
        <div id={panelId} className="ml-3 border-l border-slate-200 pl-2">
          <ServiceMenuLinks compact onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

export { ServicesDropdown, ServicesMobileAccordion };
