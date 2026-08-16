import { useRouter } from 'next/router';
import { type FormEvent, type ReactElement, useEffect, useState } from 'react';

import { Meta } from '../components/layout/Meta';
import { FadeIn } from '../components/ui/FadeIn';
import { ReusableHero } from '../components/ui/hero';
import { BRAND, REQUEST_QUOTE_PAGE, SERVICES } from '../constants/content';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RequestQuotePage: NextPageWithLayout = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState<string>(SERVICES[0].slug);
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const requested = router.query.service;
    if (
      typeof requested === 'string' &&
      SERVICES.some((s) => s.slug === requested)
    ) {
      setService(requested);
    }
  }, [router.query.service]);

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
    // TODO: wire this up to a real CRM/quoting workflow (e.g. a helpdesk inbox
    // or internal sales pipeline). This only simulates success client-side —
    // no request is actually stored or routed yet.
    setSubmitted(true);
  };

  return (
    <>
      <Meta
        title="Request a Quote — Recycling Hub"
        description="Request a quote for bulk or industrial e-waste collection, certified data destruction, or compliance reporting."
      />

      <ReusableHero
        eyebrow={REQUEST_QUOTE_PAGE.eyebrow}
        headline={REQUEST_QUOTE_PAGE.headline}
        headlineAccent={REQUEST_QUOTE_PAGE.headlineAccent}
        description={REQUEST_QUOTE_PAGE.description}
      />

      <section className="bg-white pb-16 md:pb-20">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <FadeIn>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl border border-slate-200 bg-neutral-50 p-6 sm:p-8"
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
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
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
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitted}
                    placeholder="+60 1x-xxx xxxx"
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="company"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Company (if applicable)
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={submitted}
                    placeholder="Optional"
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="service"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Service you&apos;re interested in
                  </label>
                  <select
                    id="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    disabled={submitted}
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="details"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Device types & estimated volume
                  </label>
                  <textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    disabled={submitted}
                    rows={4}
                    placeholder="E.g. ~40 desktops and monitors from a single office, one-off decommission"
                    className="resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
              {submitted && (
                <p className="mt-4 text-sm font-medium text-brand-600">
                  Request received — we&apos;ll confirm pricing and a collection
                  window within 24 hours.
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

          <FadeIn delay={0.1}>
            <p className="mt-6 text-center text-xs text-slate-400">
              Individual pickup is always free and doesn&apos;t need a quote —{' '}
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-600 underline underline-offset-2"
              >
                book it directly via WhatsApp
              </a>
              .
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
};

RequestQuotePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default RequestQuotePage;
