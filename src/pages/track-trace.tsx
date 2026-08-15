import { type FormEvent, type ReactElement, useState } from 'react';
import {
  LuClipboardCheck,
  LuFileCheck,
  LuLeaf,
  LuSearch,
} from 'react-icons/lu';

import { Meta } from '../components/layout/Meta';
import { FadeIn } from '../components/ui/FadeIn';
import { ReusableHero } from '../components/ui/hero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUEST_TYPES = [
  'Certificate of Destruction',
  'ESG Diversion Report',
  'Collection Status Update',
] as const;

const REQUEST_INFO = [
  {
    Icon: LuFileCheck,
    title: 'Certificate of Destruction',
    description:
      'Serialized proof that a data-bearing device was destroyed to a certified standard — available for bulk and enterprise collections, and on request for individual pickups.',
  },
  {
    Icon: LuLeaf,
    title: 'ESG Diversion Report',
    description:
      'Tonnage recycled and landfill diverted for a collection, formatted for your sustainability or donor reporting.',
  },
  {
    Icon: LuSearch,
    title: 'Collection Status Update',
    description:
      "Not sure where things stand on a booked or recent pickup? Send us your reference and we'll confirm.",
  },
];

const TrackTracePage: NextPageWithLayout = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState<
    (typeof REQUEST_TYPES)[number]
  >(REQUEST_TYPES[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    // TODO: wire this up to a real ticketing/records system (e.g. a helpdesk
    // inbox, CRM, or internal collections database). This only simulates
    // success client-side — no request is actually stored or routed yet.
    setSubmitted(true);
  };

  return (
    <>
      <Meta
        title="Track & Trace / Certificate Request — Recycling Hub"
        description="Request a certificate of destruction, an ESG diversion report, or a status update on your e-waste collection."
      />

      <ReusableHero
        eyebrow="Track & Trace"
        headline="Request Your"
        headlineAccent="Certificate or Status."
        description="Look up a collection or request documentation — a certificate of destruction, an ESG diversion report, or a status update — and we'll get back to you."
      />

      {/* What you can request */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 text-center">
            <SectionHeading
              eyebrow="What You Can Request"
              headline="Documentation for Any Collection"
              subtext="Whether it was a free individual pickup or a bulk enterprise collection, you can request the paperwork that goes with it."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {REQUEST_INFO.map(({ Icon, title, description }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-neutral-50 p-6 md:p-8">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-montserrat text-base font-extrabold text-neutral-950">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Request form */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <FadeIn>
            <div className="mb-10 text-center">
              <SectionHeading
                eyebrow="Submit a Request"
                headline="Tell Us What You Need"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="fullName"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={submitted}
                    placeholder="Your name"
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    disabled={submitted}
                    placeholder="you@example.com"
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitted}
                    placeholder="+60 1x-xxx xxxx"
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="requestType"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    What do you need?
                  </label>
                  <select
                    id="requestType"
                    value={requestType}
                    onChange={(e) =>
                      setRequestType(
                        e.target.value as (typeof REQUEST_TYPES)[number],
                      )
                    }
                    disabled={submitted}
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {REQUEST_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="reference"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Booking or collection reference (optional)
                  </label>
                  <input
                    id="reference"
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    disabled={submitted}
                    placeholder="Don't have one? Leave this blank and add details in the notes below"
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={submitted}
                    rows={3}
                    placeholder="Approximate pickup date, address, or anything else that helps us find your collection"
                    className="resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
              {submitted && (
                <p className="mt-4 text-sm font-medium text-brand-600">
                  Request received — we&apos;ll email your{' '}
                  {requestType.toLowerCase()} within 2 business days.
                </p>
              )}

              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <p className="text-xs text-slate-400">
                  Prefer to talk it through? WhatsApp us instead.
                </p>
                <button
                  type="submit"
                  disabled={submitted}
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white ring-2 ring-brand-600 ring-offset-2 transition-all duration-300 ease-out hover:bg-brand-700 hover:ring-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {submitted ? 'Request Sent' : 'Submit Request'}
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* Closing note */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-5 text-center md:px-8">
          <div className="mb-4 flex justify-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <LuClipboardCheck size={20} />
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Requests are handled by our team, not an automated system — if your
            reference number is hard to find, just describe the collection as
            best you can and we&apos;ll match it on our end.
          </p>
        </div>
      </section>
    </>
  );
};

TrackTracePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default TrackTracePage;
