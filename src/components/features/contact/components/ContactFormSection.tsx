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
import { InputField } from '../../../form/fields/InputField';
import { TextareaField } from '../../../form/fields/TextareaField';
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
 * design calls for — light form on the left, a brand-green (bg-brand-700,
 * not a dark/neutral fill) contact-methods + socials panel on the right.
 * Posts straight to the real ContactMessage endpoint (skipAuth,
 * anonymous), same as before the merge. */
const ContactFormSection = () => {
  const {
    contact: { form: content },
  } = useDictionary();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Untyped `string` field, not `keyof FormState` — InputField/
  // TextareaField's updateFormData contract is generic across every
  // form they're used in, this feature's form included.
  const updateField = (field: string, value: string) => {
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
      <div className="mx-auto max-w-6xl px-5 md:px-8">
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
                <div className="grid gap-x-4 sm:grid-cols-2">
                  <InputField
                    label={content.firstName}
                    field="firstName"
                    placeholder={content.firstNamePlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitted}
                  />
                  <InputField
                    label={content.lastName}
                    field="lastName"
                    placeholder={content.lastNamePlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitted}
                  />
                  <InputField
                    label={content.email}
                    field="email"
                    type="email"
                    placeholder={content.emailPlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitted}
                  />
                  <InputField
                    label={content.phone}
                    field="phone"
                    type="tel"
                    placeholder={content.phonePlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitted}
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      label={content.subject}
                      field="subject"
                      placeholder={content.subjectPlaceholder}
                      formData={formData}
                      errors={errors}
                      updateFormData={updateField}
                      disabled={submitted}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <TextareaField
                      label={content.message}
                      field="message"
                      placeholder={content.messagePlaceholder}
                      formData={formData}
                      errors={errors}
                      updateFormData={updateField}
                    />
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

            {/* Right — how to reach us, brand-green panel. Outer div is
             * the actual grid item (md:col-span-2) and just supplies the
             * gutter; the green box is the inner div so it reads as an
             * inset card, not a fill flush against the outer card's
             * edge. */}
            <div className="p-4 md:col-span-2 md:p-6">
              <div className="flex h-full flex-col justify-between gap-6 rounded-2xl bg-brand-700 p-6 text-white md:p-8">
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

                <div className="border-t border-white/10 pt-6">
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
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { ContactFormSection };
