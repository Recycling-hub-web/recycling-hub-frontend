'use client';

import { type FormEvent, useState } from 'react';
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
import { useToast } from '../../../ui/toast/ToastContext';
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
  const toast = useToast();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Untyped `string` field, not `keyof FormState` — InputField/
  // TextareaField's updateFormData contract is generic across every
  // form they're used in, this feature's form included.
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Validated on submit, not proactively on every keystroke — the submit
  // button stays enabled the whole time (only disabled while the request
  // is actually in flight) and errors surface inline once someone tries
  // to send. See the post-submit navigation rule: create actions never
  // pre-emptively disable on validity.
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
    // On validation error: never navigate away, keep the entered values,
    // show inline field errors — exactly what returning early here does.
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
      // Create action, likely to be submitted more than once in a row
      // (a visitor sending a second, unrelated question) — stay on the
      // page and reset the form in place rather than navigating or
      // freezing it in a "sent" state. The toast is the confirmation;
      // nothing about staying put implies success on its own.
      setFormData(INITIAL_STATE);
      setErrors({});
      toast.success(content.successMessage);
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
                    disabled={submitting}
                  />
                  <InputField
                    label={content.lastName}
                    field="lastName"
                    placeholder={content.lastNamePlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitting}
                  />
                  <InputField
                    label={content.email}
                    field="email"
                    type="email"
                    placeholder={content.emailPlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitting}
                  />
                  <InputField
                    label={content.phone}
                    field="phone"
                    type="tel"
                    placeholder={content.phonePlaceholder}
                    formData={formData}
                    errors={errors}
                    updateFormData={updateField}
                    disabled={submitting}
                  />
                  <div className="sm:col-span-2">
                    <InputField
                      label={content.subject}
                      field="subject"
                      placeholder={content.subjectPlaceholder}
                      formData={formData}
                      errors={errors}
                      updateFormData={updateField}
                      disabled={submitting}
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

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white ring-2 ring-brand-600 ring-offset-2 transition-all duration-300 ease-out hover:bg-brand-700 hover:ring-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {submitting
                      ? content.submittingButton
                      : content.submitButton}
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
