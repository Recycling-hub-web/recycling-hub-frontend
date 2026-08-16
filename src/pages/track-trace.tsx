import { type FormEvent, type ReactElement, useEffect, useState } from 'react';
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
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUEST_ICONS = [LuFileCheck, LuLeaf, LuSearch];

const TrackTracePage: NextPageWithLayout = () => {
  const { trackTrace: content } = useDictionary();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState(content.requestTypes[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reset the select's value when the locale (and therefore the translated
  // option strings) changes, so it doesn't hold a stale string from the
  // previous language.
  useEffect(() => {
    setRequestType(content.requestTypes[0]);
  }, [content.requestTypes]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError(content.form.errorNameRequired);
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError(content.form.errorEmailInvalid);
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
        eyebrow={content.hero.eyebrow}
        headline={content.hero.headline}
        headlineAccent={content.hero.headlineAccent}
        description={content.hero.description}
      />

      {/* What you can request */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-14 text-center">
            <SectionHeading
              eyebrow={content.sectionHeading1.eyebrow}
              headline={content.sectionHeading1.headline}
              subtext={content.sectionHeading1.subtext}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {content.requestInfo.map(({ title, description }, i) => {
              const Icon = REQUEST_ICONS[i]!;
              return (
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Request form */}
      <section className="bg-neutral-50 py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <FadeIn>
            <div className="mb-10 text-center">
              <SectionHeading
                eyebrow={content.sectionHeading2.eyebrow}
                headline={content.sectionHeading2.headline}
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
                    {content.form.fullName}
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
                    placeholder={content.form.fullNamePlaceholder}
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {content.form.email}
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
                    {content.form.phone}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitted}
                    placeholder={content.form.phonePlaceholder}
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="requestType"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {content.form.requestTypeLabel}
                  </label>
                  <select
                    id="requestType"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    disabled={submitted}
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    {content.requestTypes.map((type) => (
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
                    {content.form.referenceLabel}
                  </label>
                  <input
                    id="reference"
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    disabled={submitted}
                    placeholder={content.form.referencePlaceholder}
                    className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {content.form.notesLabel}
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={submitted}
                    rows={3}
                    placeholder={content.form.notesPlaceholder}
                    className="resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
              {submitted && (
                <p className="mt-4 text-sm font-medium text-brand-600">
                  {content.form.successPrefix}
                  {requestType}
                  {content.form.successSuffix}
                </p>
              )}

              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <p className="text-xs text-slate-400">
                  {content.form.whatsappNote}
                </p>
                <button
                  type="submit"
                  disabled={submitted}
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white ring-2 ring-brand-600 ring-offset-2 transition-all duration-300 ease-out hover:bg-brand-700 hover:ring-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {submitted
                    ? content.form.submittedButton
                    : content.form.submitButton}
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
            {content.closingNote}
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
