import Link from 'next/link';
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
      description="The terms and conditions governing your use of Recycling Hub's e-waste collection and disposal services."
    />

    <ReusableHero
      eyebrow="Legal"
      headline="Terms of Service"
      description="The terms that govern your use of Recycling Hub's collection and disposal services."
    />

    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="mb-10 text-xs text-slate-400">
          Last updated: 15 August 2026 · Effective date: 15 August 2026
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing our website (recyclinghub.eco), booking a pickup, or
            otherwise engaging Recycling Hub (&quot;we&quot;, &quot;us&quot;,
            &quot;our&quot;) for any service, you agree to be bound by these
            Terms of Service. If you do not agree, please do not use our website
            or services.
          </p>
          <p>
            These terms apply to individuals booking a personal pickup and to
            businesses engaging us for bulk or enterprise collection. We may
            update these terms from time to time; continued use of our services
            after changes are posted constitutes acceptance of the revised
            terms.
          </p>
        </Section>

        <Section title="2. Description of Services">
          <p>Recycling Hub provides licensed e-waste collection, including:</p>
          <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
            <li>
              Free doorstep pickup of personal electronic devices from
              individuals, with instant payment for eligible devices
            </li>
            <li>
              Scheduled bulk and enterprise collection for businesses, quoted
              according to device types and volume
            </li>
            <li>
              Certified data destruction for any data-bearing device collected,
              whether from an individual or a business
            </li>
            <li>
              ESG and sustainability diversion reporting for bulk and enterprise
              clients
            </li>
          </ul>
          <p>
            For bulk and enterprise collections, the exact scope, pricing, and
            schedule are confirmed in a quote provided to you before collection
            is scheduled.
          </p>
        </Section>

        <Section title="3. Accepted Devices and Exclusions">
          <p>
            We accept phones and tablets, laptops and computers, monitors and
            displays, office and IT equipment, and data storage devices. If you
            are unsure whether an item is covered, contact us before booking and
            we will confirm.
          </p>
          <p>
            We may decline to collect an item that is not electronic waste, that
            contains hazardous material outside the scope of our licence, or
            that was not disclosed accurately at the time of booking. Declining
            an item does not entitle you to any payment for that item.
          </p>
        </Section>

        <Section title="4. Your Responsibilities">
          <p>
            To help us complete your collection safely and correctly, you agree
            to:
          </p>
          <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
            <li>
              Provide accurate information about the devices you are
              surrendering, including quantity, type, and condition
            </li>
            <li>
              Confirm that you are the lawful owner of each device, or are
              otherwise authorised to surrender it for recycling
            </li>
            <li>
              Make devices reasonably accessible at the agreed pickup location
              and time
            </li>
            <li>
              Where practical, remove or back up any data you wish to keep
              before collection — while we perform certified destruction on
              data-bearing devices, we are not responsible for data you did not
              remove beforehand
            </li>
            <li>
              For business and enterprise collections, provide an accurate
              device inventory to support the quote and, where applicable, the
              certificate of destruction
            </li>
          </ul>
        </Section>

        <Section title="5. Payment for Individual Pickups">
          <p>
            Individual pickups are free of charge, and eligible devices are paid
            for instantly via DuitNow at the time of collection. Payment amounts
            are based on our assessment of the device&apos;s type and condition
            at the point of collection, which may differ from any estimate given
            at the time of booking if the device&apos;s actual condition differs
            from what was described.
          </p>
          <p>
            Some devices have no resale or material value and are collected and
            recycled at no cost to you, with no payment made in return. We will
            always confirm this before completing collection where reasonably
            possible.
          </p>
        </Section>

        <Section title="6. Payment for Bulk and Enterprise Collection">
          <p>
            Bulk and enterprise collection is quoted individually based on
            device types, volume, and site requirements. Where a service fee
            applies, payment terms — including amount, currency, and due date —
            are set out in the quote or service agreement provided to you before
            collection is scheduled. All prices are in Malaysian Ringgit (MYR)
            and exclude applicable taxes unless stated otherwise.
          </p>
        </Section>

        <Section title="7. Scheduling and Collection">
          <p>
            Collection windows are agreed at the time of booking. We will
            contact you if we need to reschedule. If you are not available at
            the agreed time and location without prior notice, we may need to
            rebook the collection for a later date.
          </p>
        </Section>

        <Section title="8. Ownership and Certified Data Destruction">
          <p>
            Ownership of a device transfers to Recycling Hub once it is
            collected. Any data-bearing device we collect is processed through
            certified destruction, whether wiped or physically destroyed
            depending on the device and condition.
          </p>
          <p>
            For business and enterprise collections, a certificate of
            destruction covering the assets collected is available on request.
            Individual pickups do not automatically receive a certificate, but
            one can be requested through our{' '}
            <Link
              href="/track-trace"
              className="font-medium text-neutral-950 underline underline-offset-2"
            >
              certificate request page
            </Link>
            .
          </p>
        </Section>

        <Section title="9. Environmental Compliance Disclaimer">
          <p>
            Recycling Hub is a DOE-registered e-waste collector, and our
            collection and processing activities are carried out under
            applicable scheduled waste requirements, including the SW110
            classification, under Malaysia&apos;s Environmental Quality Act 1974
            and its subsidiary regulations.
          </p>
          <p>
            While we take reasonable care to ensure our operations remain
            compliant, we are not responsible for the accuracy of information
            you provide about a device, or for any regulatory obligation you may
            have that is separate from our own licensed activities.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the maximum extent permitted by Malaysian law, Recycling Hub
            shall not be liable for any indirect, incidental, or consequential
            damages arising from your use of our services, including but not
            limited to loss of data that was not removed prior to collection, or
            loss arising from an inaccurate device description provided by you.
          </p>
          <p>
            Our total liability for any claim arising from our services shall
            not exceed the total amount paid by you to us (or, for individual
            pickups where we paid you, the value of that payment) in the 3
            months preceding the event giving rise to the claim.
          </p>
        </Section>

        <Section title="11. Cancellation">
          <p>
            You may cancel or reschedule a booked pickup at no charge by
            contacting us before the scheduled collection window. For bulk and
            enterprise collections, cancellation terms may be specified in your
            service agreement where a deposit or scheduling fee applies.
          </p>
        </Section>

        <Section title="12. Confidentiality">
          <p>
            For business and enterprise clients, we treat your device
            inventories, site information, and any business data shared with us
            as confidential, and will not disclose it to third parties except as
            required to complete the collection, issue certificates, or comply
            with the law.
          </p>
        </Section>

        <Section title="13. Governing Law">
          <p>
            These Terms of Service are governed by and construed in accordance
            with the laws of Malaysia. Any disputes arising from these terms or
            our services shall be subject to the exclusive jurisdiction of the
            courts of Malaysia.
          </p>
        </Section>

        <Section title="14. Contact Us">
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
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default TermsPage;
