import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { ReusableHero } from '../components/ui/hero';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-slate-100 py-10 first:pt-0">
    <h2 className="mb-4 text-lg font-semibold text-neutral-950">{title}</h2>
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600">
      {children}
    </div>
  </div>
);

const PrivacyPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Privacy Policy — Recycling Hub"
      description="How Recycling Hub collects, uses, and protects your personal data in accordance with Malaysia's Personal Data Protection Act 2010."
    />

    <ReusableHero
      eyebrow="Legal"
      headline="Privacy Policy"
      description="How we collect, use, and protect your information."
    />

    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="mb-10 text-xs text-slate-400">
          Last updated: 3 July 2026 · Effective date: 3 July 2026
        </p>

        <Section title="1. Who We Are">
          <p>
            Recycling Hub (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a
            software company based in Malaysia that builds e-invoice integration
            services connecting businesses to LHDN MyInvois. Our registered
            contact email is{' '}
            <a
              href="mailto:contact@recyclinghub.eco"
              className="font-medium text-neutral-950 underline underline-offset-2"
            >
              contact@recyclinghub.eco
            </a>
            .
          </p>
          <p>
            This Privacy Policy explains how we handle personal data collected
            through our website (recyclinghub.eco), our integration services,
            and any communications with us. We are committed to complying with
            Malaysia&apos;s Personal Data Protection Act 2010 (PDPA).
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information in the following ways:</p>
          <p>
            <span className="font-medium text-neutral-800">
              Information you provide directly
            </span>{' '}
            — your name, company name, email address, phone number, and business
            details when you fill in our contact form, book a call, or engage
            our services.
          </p>
          <p>
            <span className="font-medium text-neutral-800">
              Business and invoice data
            </span>{' '}
            — to perform e-invoice integrations, we may access invoice records,
            accounting data, and system credentials provided by you. This data
            is used solely to build and test your integration.
          </p>
          <p>
            <span className="font-medium text-neutral-800">Usage data</span> —
            standard web analytics such as page views, browser type, and
            referral source collected via anonymised analytics tools. No
            personally identifiable information is collected at this layer.
          </p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
            <li>Deliver and support your e-invoice integration project</li>
            <li>Respond to enquiries and schedule discovery calls</li>
            <li>Send project updates, proposals, and invoices</li>
            <li>
              Notify you of LHDN API changes that may affect your integration
            </li>
            <li>Improve our services and website experience</li>
            <li>
              Comply with legal and regulatory obligations under Malaysian law
            </li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal data to third parties
            for marketing purposes.
          </p>
        </Section>

        <Section title="4. Data Retention">
          <p>
            We retain your personal data for as long as is necessary to fulfil
            the purposes outlined in this policy, or as required by law. Project
            data (code, credentials, and integration configurations) is deleted
            or returned to you upon project completion or contract termination,
            whichever is sooner.
          </p>
          <p>
            Contact and communication records are retained for up to 3 years for
            legitimate business and legal purposes.
          </p>
        </Section>

        <Section title="5. Data Security">
          <p>
            We implement appropriate technical and organisational measures to
            protect your data against unauthorised access, disclosure,
            alteration, or destruction. API credentials and sensitive business
            data are handled over encrypted channels and are never stored beyond
            the active project period.
          </p>
          <p>
            No method of transmission over the internet is 100% secure. While we
            take every reasonable precaution, we cannot guarantee absolute
            security.
          </p>
        </Section>

        <Section title="6. Sharing of Information">
          <p>
            We only share your information with third parties in the following
            limited circumstances:
          </p>
          <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
            <li>
              <span className="font-medium text-neutral-800">
                Service providers
              </span>{' '}
              — tools we use to run our business (e.g. email, scheduling,
              project management) under strict confidentiality agreements.
            </li>
            <li>
              <span className="font-medium text-neutral-800">
                Legal requirement
              </span>{' '}
              — if required by law, court order, or government authority.
            </li>
            <li>
              <span className="font-medium text-neutral-800">
                Business transfers
              </span>{' '}
              — in the event of a merger or acquisition, your data may be
              transferred as part of that transaction.
            </li>
          </ul>
        </Section>

        <Section title="7. Your Rights Under PDPA">
          <p>
            Under Malaysia&apos;s Personal Data Protection Act 2010, you have
            the right to:
          </p>
          <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
            <li>Request access to the personal data we hold about you</li>
            <li>
              Request correction of inaccurate or incomplete personal data
            </li>
            <li>
              Withdraw consent for us to process your data (where consent is the
              basis for processing)
            </li>
            <li>Request deletion of your data, subject to legal obligations</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a
              href="mailto:contact@recyclinghub.eco"
              className="font-medium text-neutral-950 underline underline-offset-2"
            >
              contact@recyclinghub.eco
            </a>
            . We will respond within 21 days.
          </p>
        </Section>

        <Section title="8. Cookies">
          <p>
            Our website uses minimal cookies required for basic functionality
            and anonymous analytics. We do not use advertising or tracking
            cookies. You may disable cookies in your browser settings, though
            some website features may not function as intended.
          </p>
        </Section>

        <Section title="9. Links to Third-Party Sites">
          <p>
            Our website may contain links to external websites (e.g. LHDN
            MyInvois portal, LinkedIn). We are not responsible for the privacy
            practices or content of those sites and encourage you to review
            their privacy policies independently.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will revise the &quot;Last updated&quot; date at the top of this
            page. Continued use of our services after changes are posted
            constitutes your acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            If you have any questions about this Privacy Policy or how we handle
            your data, please contact us:
          </p>
          <p>
            Email:{' '}
            <a
              href="mailto:contact@recyclinghub.eco"
              className="font-medium text-neutral-950 underline underline-offset-2"
            >
              contact@recyclinghub.eco
            </a>
            <br />
            WhatsApp: +60 11-6080 3604
            <br />
            Website: recyclinghub.eco
          </p>
        </Section>
      </div>
    </section>
  </>
);

PrivacyPage.getLayout = (page: ReactElement) => (
  <PublicLayout>{page}</PublicLayout>
);

export default PrivacyPage;
