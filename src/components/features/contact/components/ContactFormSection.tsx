'use client';

import { type FormEvent, useMemo, useState } from 'react';
import {
  LuFacebook,
  LuHeadset,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuMessageCircle,
} from 'react-icons/lu';

import { BRAND } from '../../../../constants/content';
import { useDictionary } from '../../../../hooks/useDictionary';
import { ApiError } from '../../../../lib/api';
import { FadeIn } from '../../../ui/FadeIn';
import { submitContactMessage } from '../services/contactService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

/** Merges what used to be two separate sections (the submission form and
 * the "how to reach us" cards) into the one two-column card this page's
 * design calls for — light form on the left, dark contact-methods +
 * socials panel on the right. Posts straight to the real ContactMessage
 * endpoint (skipAuth, anonymous), same as before the merge. */
const ContactFormSection = () => {
  const {
    contact: { form: content },
  } = useDictionary();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Every field is required — drives both the inline error messages on
  // submit and the submit button's disabled state (recomputed on every
  // keystroke so the button flips the instant the form becomes valid,
  // not just after a failed submit attempt).
  const isValid = useMemo(
    () =>
      Boolean(formData.firstName.trim()) &&
      Boolean(formData.lastName.trim()) &&
      EMAIL_PATTERN.test(formData.email) &&
      Boolean(formData.phone.trim()) &&
      Boolean(formData.subject.trim()) &&
      Boolean(formData.message.trim()),
    [formData],
  );

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.firstName.trim())
      nextErrors.firstName = content.errorFirstNameRequired;
    if (!formData.lastName.trim())
      nextErrors.lastName = content.errorLastNameRequired;
    if (!EMAIL_PATTERN.test(formData.email))
      nextErrors.email = content.errorEmailInvalid;
    if (!formData.phone.trim()) nextErrors.phone = content.errorPhoneRequired;
    if (!formData.subject.trim())
      nextErrors.subject = content.errorSubjectRequired;
    if (!formData.message.trim())
      nextErrors.message = content.errorMessageRequired;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitContactMessage({
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone_number: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : content.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400';
  const errorInputClass =
    'border-red-400 focus:border-red-500 focus:ring-red-500/20';

  const CONTACT_CARDS = [
    {
      icon: <LuHeadset className="size-5" />,
      label: content.sidePanel.hotlineLabel,
      value: BRAND.phone,
      href: `tel:${BRAND.phone.replace(/\s+/g, '')}`,
    },
    {
      icon: <LuMessageCircle className="size-5" />,
      label: content.sidePanel.whatsappLabel,
      value: BRAND.phone,
      href: BRAND.whatsapp,
    },
    {
      icon: <LuMail className="size-5" />,
      label: content.sidePanel.emailLabel,
      value: BRAND.email,
      href: `mailto:${BRAND.email}`,
    },
  ];

  const SOCIALS = [
    { icon: <LuFacebook className="size-5" />, href: BRAND.social.facebook },
    { icon: <LuInstagram className="size-5" />, href: BRAND.social.instagram },
    { icon: <LuLinkedin className="size-5" />, href: BRAND.social.linkedin },
  ];

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <FadeIn>
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm md:grid md:grid-cols-5">
            {/* Left — the form */}
            <div className="p-6 md:col-span-3 md:p-10">
              <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                {content.heading}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {content.subheading}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="firstName"
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {content.firstName}
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      disabled={submitted}
                      placeholder={content.firstNamePlaceholder}
                      className={`${inputClass} ${errors.firstName ? errorInputClass : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="lastName"
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {content.lastName}
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      disabled={submitted}
                      placeholder={content.lastNamePlaceholder}
                      className={`${inputClass} ${errors.lastName ? errorInputClass : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500">{errors.lastName}</p>
                    )}
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
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      disabled={submitted}
                      placeholder={content.emailPlaceholder}
                      className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="phone"
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {content.phone}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      disabled={submitted}
                      placeholder={content.phonePlaceholder}
                      className={`${inputClass} ${errors.phone ? errorInputClass : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
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
                      value={formData.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      disabled={submitted}
                      placeholder={content.subjectPlaceholder}
                      className={`${inputClass} ${errors.subject ? errorInputClass : ''}`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500">{errors.subject}</p>
                    )}
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
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      disabled={submitted}
                      rows={4}
                      placeholder={content.messagePlaceholder}
                      className={`resize-none rounded-3xl ${inputClass} ${errors.message ? errorInputClass : ''}`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500">{errors.message}</p>
                    )}
                  </div>
                </div>

                {apiError && (
                  <p className="mt-4 text-sm text-red-500">{apiError}</p>
                )}
                {submitted && (
                  <p className="mt-4 text-sm font-medium text-brand-600">
                    {content.successMessage}
                  </p>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || submitted || !isValid}
                    className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white ring-2 ring-brand-600 ring-offset-2 transition-all duration-300 ease-out hover:bg-brand-700 hover:ring-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {submitted && content.submittedButton}
                    {!submitted && submitting && content.submittingButton}
                    {!submitted && !submitting && content.submitButton}
                  </button>
                </div>
              </form>
            </div>

            {/* Right — how to reach us, dark panel */}
            <div className="flex flex-col justify-between bg-neutral-950 p-6 text-white md:col-span-2 md:p-8">
              <div>
                <h3 className="text-lg font-bold">
                  {content.sidePanel.heading}
                </h3>

                <div className="mt-6 flex flex-col gap-3">
                  {CONTACT_CARDS.map((card) => (
                    <a
                      key={card.label}
                      href={card.href}
                      target={
                        card.href.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        card.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/15"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                        {card.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-white/70">
                          {card.label}
                        </span>
                        <span className="block truncate text-sm font-medium">
                          {card.value}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  {content.sidePanel.connectHeading}
                </p>
                <div className="mt-3 flex gap-2.5">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { ContactFormSection };
