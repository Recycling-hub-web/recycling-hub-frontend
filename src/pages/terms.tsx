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

const TermsPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Terms of Service — Recycling Hub"
      description="The terms and conditions governing your use of Recycling Hub's e-invoice integration services."
    />

    <ReusableHero
      eyebrow="Legal"
      headline="Terms of Service"
      description="The terms that govern your use of Recycling Hub's services."
    />

    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="mb-10 text-xs text-slate-400">
          Last updated: 3 July 2026 · Effective date: 3 July 2026
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing our website (recyclinghub.eco) or engaging Recycling
            Hub (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) for any
            services, you agree to be bound by these Terms of Service. If you do
            not agree, please do not use our website or services.
          </p>
          <p>
            These terms apply to all visitors, clients, and others who access or
            use our services. We reserve the right to update these terms at any
            time. Continued use of our services after changes are posted
            constitutes acceptance.
          </p>
        </Section>

        <Section title="2. Description of Services">
          <p>
            Recycling Hub provides e-invoice integration services that connect
            your existing accounting software or ERP system to Malaysia&apos;s
            LHDN MyInvois portal. Our services include:
          </p>
          <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
            <li>Integration project delivery (fixed-price, one-time builds)</li>
            <li>Monthly maintenance and LHDN API update management</li>
            <li>
              Recycling Hub Connect SaaS — a self-serve middleware platform for
              standard accounting software
            </li>
            <li>
              Consulting and discovery calls related to MyInvois compliance
            </li>
          </ul>
          <p>
            The exact scope, deliverables, and timeline for any engagement are
            specified in a separate proposal or service agreement provided to
            you prior to project commencement.
          </p>
        </Section>

        <Section title="3. Client Responsibilities">
          <p>To enable us to deliver our services, you agree to:</p>
          <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
            <li>
              Provide accurate, complete, and timely information about your
              accounting system, invoice data, and business registration details
            </li>
            <li>
              Grant necessary access to your accounting software, database, or
              APIs as required for the integration
            </li>
            <li>
              Ensure your business is correctly registered with LHDN and
              eligible to use MyInvois
            </li>
            <li>
              Review and approve integration deliverables within agreed
              timelines
            </li>
            <li>
              Not use our services for any unlawful purpose or in violation of
              Malaysian law
            </li>
          </ul>
        </Section>

        <Section title="4. Payment Terms">
          <p>
            All prices are quoted in Malaysian Ringgit (MYR) and exclude SST
            unless stated otherwise. Payment terms are as follows:
          </p>
          <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
            <li>
              <span className="font-medium text-neutral-800">
                Integration projects
              </span>{' '}
              — 50% deposit upon project acceptance, 50% upon go-live or 30 days
              after build completion, whichever is earlier.
            </li>
            <li>
              <span className="font-medium text-neutral-800">
                Monthly maintenance and SaaS plans
              </span>{' '}
              — billed monthly or annually in advance. Subscriptions auto-renew
              unless cancelled before the next billing date.
            </li>
          </ul>
          <p>
            Invoices are due within 14 days of issuance. Late payments may incur
            a 1.5% monthly interest charge. We reserve the right to suspend
            services for accounts overdue by more than 30 days.
          </p>
        </Section>

        <Section title="5. Delivery and Go-Live">
          <p>
            Estimated delivery timelines (7–14 days for standard integrations)
            are provided in good faith and are contingent on timely client
            cooperation, system access, and data availability. Recycling Hub is
            not liable for delays caused by incomplete information, restricted
            access, or changes to LHDN MyInvois requirements outside our
            control.
          </p>
          <p>
            Go-live is defined as the successful validation of your integration
            against the LHDN MyInvois production environment. All integrations
            undergo full sandbox testing before go-live.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            For fixed-price integration projects, upon receipt of full payment,
            you own the source code of the integration built specifically for
            your system. General frameworks, utilities, and proprietary
            middleware components developed by Recycling Hub remain our
            intellectual property.
          </p>
          <p>
            All website content, branding, and materials on recyclinghub.eco are
            owned by Recycling Hub and may not be reproduced without written
            permission.
          </p>
        </Section>

        <Section title="7. LHDN Compliance Disclaimer">
          <p>
            Recycling Hub builds integrations to the official LHDN MyInvois API
            specification and runs full sandbox validation prior to go-live.
            However, final approval and acceptance of e-invoices by LHDN is
            subject to the accuracy of your business data, your LHDN
            registration status, and LHDN&apos;s own systems.
          </p>
          <p>
            We are not affiliated with LHDN (Inland Revenue Board of Malaysia)
            and cannot guarantee LHDN&apos;s decisions regarding your
            submissions. Any fines, penalties, or enforcement actions by LHDN
            arising from your business operations or non-compliance prior to
            engaging Recycling Hub are solely your responsibility.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by Malaysian law, Recycling Hub
            shall not be liable for any indirect, incidental, consequential, or
            punitive damages arising from your use of our services, including
            but not limited to loss of business, revenue, data, or LHDN
            penalties.
          </p>
          <p>
            Our total liability for any claim arising from our services shall
            not exceed the total fees paid by you to Recycling Hub in the 3
            months preceding the event giving rise to the claim.
          </p>
        </Section>

        <Section title="9. Termination">
          <p>
            Either party may terminate an engagement by providing 14 days&apos;
            written notice. For monthly subscriptions, cancellation takes effect
            at the end of the current billing period. No refunds are issued for
            partial months.
          </p>
          <p>
            We reserve the right to terminate access immediately if you breach
            these terms, fail to pay outstanding invoices, or engage in conduct
            that we deem harmful to our business or other clients.
          </p>
        </Section>

        <Section title="10. Confidentiality">
          <p>
            Both parties agree to keep confidential any proprietary or sensitive
            information exchanged during the course of the engagement. This
            includes your business data, invoice records, system credentials,
            and our proprietary integration methodologies. This obligation
            survives termination of the engagement.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms of Service are governed by and construed in accordance
            with the laws of Malaysia. Any disputes arising from these terms or
            our services shall be subject to the exclusive jurisdiction of the
            courts of Malaysia.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            If you have any questions about these Terms of Service, please
            contact us:
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

TermsPage.getLayout = (page: ReactElement) => (
  <PublicLayout>{page}</PublicLayout>
);

export default TermsPage;
