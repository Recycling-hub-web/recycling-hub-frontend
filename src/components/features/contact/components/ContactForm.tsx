'use client';

import { type FormEvent, useState } from 'react';

import { useDictionary } from '../../../../hooks/useDictionary';
import { ApiError } from '../../../../lib/api';
import { FadeIn } from '../../../ui/FadeIn';
import { submitContactMessage } from '../services/contactService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public /contact page's submission form — posts straight to the real
 * ContactMessage endpoint (skipAuth, anonymous) so it lands in the same
 * inbox the admin/staff Contact feature reads from, unlike request-quote's
 * client-only mock. */
const ContactForm = () => {
  const {
    contact: { form: content },
  } = useDictionary();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError(content.errorNameRequired);
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError(content.errorEmailInvalid);
      return;
    }
    if (!subject.trim()) {
      setError(content.errorSubjectRequired);
      return;
    }
    if (!message.trim()) {
      setError(content.errorMessageRequired);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await submitContactMessage({
        full_name: fullName.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : content.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const buttonLabel = () => {
    if (submitted) return content.submittedButton;
    if (submitting) return content.submittingButton;
    return content.submitButton;
  };

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <FadeIn>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              {content.heading}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{content.subheading}</p>
          </div>

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
                  {content.fullName}
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
                  placeholder={content.fullNamePlaceholder}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {content.email}
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
                  placeholder={content.emailPlaceholder}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="subject"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {content.subject}
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={submitted}
                  placeholder={content.subjectPlaceholder}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {content.message}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={submitted}
                  rows={5}
                  placeholder={content.messagePlaceholder}
                  className="resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
            {submitted && (
              <p className="mt-4 text-sm font-medium text-brand-600">
                {content.successMessage}
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={submitting || submitted}
                className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white ring-2 ring-brand-600 ring-offset-2 transition-all duration-300 ease-out hover:bg-brand-700 hover:ring-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {buttonLabel()}
              </button>
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
};

export { ContactForm };
