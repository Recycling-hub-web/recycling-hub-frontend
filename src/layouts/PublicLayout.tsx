import type { ReactNode } from 'react';

import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/navbar';
import { StickyRecycleCTA } from '../components/ui/StickyRecycleCTA';
import { WhatsAppFloatingButton } from '../components/ui/WhatsAppFloatingButton';

type PublicLayoutProps = {
  children: ReactNode;
  navVariant?: 'dark' | 'light';
};

const PublicLayout = ({ children, navVariant = 'dark' }: PublicLayoutProps) => (
  <div className="relative antialiased">
    <Navbar variant={navVariant} />
    <main>{children}</main>
    <Footer />
    <WhatsAppFloatingButton />
    <StickyRecycleCTA />
  </div>
);

export { PublicLayout };
