import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuArrowUpRight } from 'react-icons/lu';

import { useDictionary } from '../../hooks/useDictionary';

const SCROLL_THRESHOLD = 700;

const StickyRecycleCTA = () => {
  const { pathname } = useRouter();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const { nav } = useDictionary();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (
    !mounted ||
    pathname === '/request-pickup' ||
    pathname === '/request-quote' ||
    pathname === '/contact'
  ) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-x-0 bottom-5 z-40 hidden justify-center sm:bottom-6 sm:flex"
        >
          <Link
            href="/request-pickup"
            className="group pointer-events-auto inline-flex items-center gap-3 rounded-full bg-brand-600 py-3 pl-5 pr-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,138,62,0.35)] transition-colors hover:bg-brand-700"
          >
            {nav.requestPickup}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 transition-transform group-hover:translate-x-0.5">
              <LuArrowUpRight size={16} />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export { StickyRecycleCTA };
