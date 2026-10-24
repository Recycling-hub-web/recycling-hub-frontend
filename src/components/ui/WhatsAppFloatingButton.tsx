import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaWhatsapp } from 'react-icons/fa6';

import { BRAND } from '../../constants/content';

const WhatsAppFloatingButton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <motion.a
      href={BRAND.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-[0_8px_24px_rgba(0,138,62,0.35)] transition-colors hover:bg-brand-700 sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp size={28} />
    </motion.a>,
    document.body,
  );
};

export { WhatsAppFloatingButton };
