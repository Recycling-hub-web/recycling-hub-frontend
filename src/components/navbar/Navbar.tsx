import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ASSETS, BRAND, NAV_LINKS } from '../../constants/content';
import { Button } from '../ui/buttons/Button';
import { ServicesDropdown, ServicesMobileAccordion } from './ServicesDropdown';
import {
  SolutionsDropdown,
  SolutionsMobileAccordion,
} from './SolutionsDropdown';

type NavbarProps = {
  variant?: 'dark' | 'light';
};

const NavLinkIcon = () => (
  <svg width="7" height="7" viewBox="0 0 7 7" fill="currentColor">
    <circle cx="3.5" cy="3.5" r="3.5" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const slideDown = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.22, ease: 'easeInOut' as const },
};

const ICON_SPRING = { type: 'spring', stiffness: 600, damping: 25 } as const;

const Navbar = ({ variant = 'dark' }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const router = useRouter();

  const isDark = variant === 'dark';
  const light = scrolled || !isDark;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    return href === '/'
      ? router.pathname === '/'
      : router.pathname.startsWith(href);
  };

  const getNavBg = () => {
    if (scrolled) return 'bg-white shadow-md border-b border-slate-100';
    return isDark
      ? 'bg-transparent'
      : 'bg-white border-b border-slate-100 shadow-sm';
  };

  const getLinkActiveCls = () => (light ? 'text-brand-600' : 'text-white');
  const getLinkCls = () =>
    light
      ? 'text-slate-500 hover:text-neutral-950'
      : 'text-white/75 hover:text-white';
  const getToggleCls = () =>
    light
      ? 'text-slate-600 hover:bg-neutral-100 hover:text-neutral-950'
      : 'text-white hover:bg-white/10';
  const getWhatsappVariant = () =>
    (light ? 'secondary' : 'outline-white') as 'secondary' | 'outline-white';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${getNavBg()}`}
    >
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-6 px-5 md:h-[80px] md:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          {light ? (
            <>
              <Image
                src={ASSETS.logo.combinedColor}
                alt="Recycling Hub"
                width={3100}
                height={700}
                className="hidden h-8 w-auto object-contain sm:block"
                priority
              />
              <Image
                src={ASSETS.logo.symbolColor}
                alt="Recycling Hub"
                width={560}
                height={565}
                className="size-8 object-contain sm:hidden"
                priority
              />
            </>
          ) : (
            <>
              <Image
                src={ASSETS.logo.combinedWhite}
                alt="Recycling Hub"
                width={3100}
                height={700}
                className="hidden h-8 w-auto object-contain sm:block"
                priority
              />
              <Image
                src={ASSETS.logo.symbolWhite}
                alt="Recycling Hub"
                width={560}
                height={565}
                className="size-8 object-contain sm:hidden"
                priority
              />
            </>
          )}
        </Link>

        {/* Desktop nav */}
        <div
          className="hidden flex-1 items-center justify-center gap-1 md:flex lg:gap-1"
          onMouseLeave={() => setHoveredHref(null)}
        >
          {NAV_LINKS.slice(0, 1).map((link) => {
            const active = isActive(link.href);
            const hovered = hoveredHref === link.href;
            const showDot = active || hovered;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredHref(link.href)}
                className={`group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200 lg:text-sm ${
                  active ? getLinkActiveCls() : getLinkCls()
                }`}
              >
                <motion.span
                  className="shrink-0"
                  initial={false}
                  animate={{ scale: showDot ? 1 : 0, opacity: showDot ? 1 : 0 }}
                  whileHover={{ scale: 1.5 }}
                  transition={ICON_SPRING}
                  style={{ display: 'inline-flex' }}
                >
                  <NavLinkIcon />
                </motion.span>
                {link.label}
              </Link>
            );
          })}

          <ServicesDropdown light={light} />
          <SolutionsDropdown light={light} />

          {NAV_LINKS.slice(1).map((link) => {
            const active = isActive(link.href);
            const hovered = hoveredHref === link.href;
            const showDot = active || hovered;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredHref(link.href)}
                className={`group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200 lg:text-sm ${
                  active ? getLinkActiveCls() : getLinkCls()
                }`}
              >
                <motion.span
                  className="shrink-0"
                  initial={false}
                  animate={{ scale: showDot ? 1 : 0, opacity: showDot ? 1 : 0 }}
                  whileHover={{ scale: 1.5 }}
                  transition={ICON_SPRING}
                  style={{ display: 'inline-flex' }}
                >
                  <NavLinkIcon />
                </motion.span>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA — desktop only */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Button
            href={BRAND.whatsapp}
            variant={getWhatsappVariant()}
            className="hidden lg:inline-flex"
          >
            WhatsApp Us
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
          className={`flex size-9 items-center justify-center rounded-lg transition-colors duration-150 md:hidden ${getToggleCls()}`}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            {...slideDown}
            className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.slice(0, 1).map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      active
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-slate-500 hover:bg-neutral-100 hover:text-neutral-950'
                    }`}
                  >
                    {active && (
                      <motion.span
                        className="shrink-0 text-brand-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={ICON_SPRING}
                        style={{ display: 'inline-flex' }}
                      >
                        <NavLinkIcon />
                      </motion.span>
                    )}
                    {link.label}
                  </Link>
                );
              })}

              <ServicesMobileAccordion />
              <SolutionsMobileAccordion />

              {NAV_LINKS.slice(1).map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      active
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-slate-500 hover:bg-neutral-100 hover:text-neutral-950'
                    }`}
                  >
                    {active && (
                      <motion.span
                        className="shrink-0 text-brand-600"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={ICON_SPRING}
                        style={{ display: 'inline-flex' }}
                      >
                        <NavLinkIcon />
                      </motion.span>
                    )}
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3">
                <Button
                  href={BRAND.whatsapp}
                  variant="secondary"
                  className="w-full"
                >
                  WhatsApp Us
                </Button>
                <Button
                  href="/request-quote"
                  variant="primary"
                  className="w-full"
                >
                  Request a Quote
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
