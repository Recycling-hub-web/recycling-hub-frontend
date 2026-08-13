import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { ContactFaq } from '../components/public/contact/ContactFaq';
import { ContactOptions } from '../components/public/contact/ContactOptions';
import { SocialLinks } from '../components/public/contact/SocialLinks';
import { BookDemo } from '../components/public/shared/BookDemo';
import { ReusableHero } from '../components/ui/hero';
import { PAGE_HEROES } from '../constants/content';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const ContactPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Contact — Recycling Hub E-Waste Collection"
      description="Have a question about e-waste collection or bulk disposal? We're here to help. Email, WhatsApp, or book a free call."
    />
    <ReusableHero
      eyebrow={PAGE_HEROES.contact.eyebrow}
      headline={PAGE_HEROES.contact.headline}
      headlineAccent={PAGE_HEROES.contact.headlineAccent}
      description={PAGE_HEROES.contact.description}
    />
    <ContactOptions />
    <BookDemo />
    <ContactFaq />
    <SocialLinks />
  </>
);

ContactPage.getLayout = (page: ReactElement) => (
  <PublicLayout>{page}</PublicLayout>
);

export default ContactPage;
