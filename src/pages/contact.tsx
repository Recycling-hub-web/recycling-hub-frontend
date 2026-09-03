import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { ContactFaq } from '../components/public/contact/ContactFaq';
import { ContactForm } from '../components/public/contact/ContactForm';
import { ContactOptions } from '../components/public/contact/ContactOptions';
import { SocialLinks } from '../components/public/contact/SocialLinks';
import { ReusableHero } from '../components/ui/hero';
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const ContactPage: NextPageWithLayout = () => {
  const {
    contact: { hero },
  } = useDictionary();

  return (
    <>
      <Meta
        title="Contact — Recycling Hub E-Waste Collection"
        description="Have a question about e-waste collection or bulk disposal? We're here to help. Reach us by email or WhatsApp."
      />
      <ReusableHero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        headlineAccent={hero.headlineAccent}
        description={hero.description}
      />
      <ContactOptions />
      <ContactForm />
      <ContactFaq />
      <SocialLinks />
    </>
  );
};

ContactPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ContactPage;
