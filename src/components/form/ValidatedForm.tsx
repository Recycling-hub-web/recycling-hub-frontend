'use client';

import type { FormHTMLAttributes } from 'react';
import { useState } from 'react';

import { validatePhoneNumber } from '../../constants/dialCodes';
import { usePortalLocale } from '../../contexts/PortalLocaleContext';
import { fieldLimit, validatePhoneText, validateText } from './validation';

type ValidatedFormProps = FormHTMLAttributes<HTMLFormElement> & {
  validationMode?: 'native' | 'external';
  fieldErrors?: Record<string, string>;
  errorSummaryLabel?: string;
};

/** Native guardrails by default; step forms may supply their own domain validation. */
export const ValidatedForm = ({
  children,
  onSubmitCapture,
  onInputCapture,
  validationMode = 'native',
  fieldErrors = {},
  errorSummaryLabel = 'Check the following fields.',
  ...props
}: ValidatedFormProps) => {
  const { t, locale } = usePortalLocale();
  const [error, setError] = useState('');
  return (
    <form
      {...props}
      noValidate
      onInputCapture={(event) => {
        const control = event.target;
        if (
          control instanceof HTMLInputElement ||
          control instanceof HTMLTextAreaElement ||
          control instanceof HTMLSelectElement
        ) {
          control.setCustomValidity('');
          control.removeAttribute('aria-invalid');
        }
        setError('');
        onInputCapture?.(event);
      }}
      onSubmitCapture={(event) => {
        if (validationMode === 'external') {
          onSubmitCapture?.(event);
          return;
        }
        const form = event.currentTarget;
        let firstInvalid:
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | undefined;
        Array.from(form.elements).forEach((element) => {
          if (
            !(
              element instanceof HTMLInputElement ||
              element instanceof HTMLTextAreaElement ||
              element instanceof HTMLSelectElement
            ) ||
            !element.willValidate
          )
            return;
          element.setCustomValidity('');
          if (
            element instanceof HTMLTextAreaElement ||
            (element instanceof HTMLInputElement &&
              ['text', 'email', 'tel', 'url', 'search'].includes(
                element.type,
              ) &&
              !element.name.includes('password'))
          ) {
            element.setCustomValidity(
              validateText(
                element.value,
                element.required,
                element.maxLength > 0
                  ? element.maxLength
                  : fieldLimit(
                      element.name || element.id,
                      element instanceof HTMLTextAreaElement,
                    ),
              ),
            );
          }
          if (
            element instanceof HTMLInputElement &&
            element.type === 'url' &&
            element.value &&
            !/^https?:\/\//i.test(element.value)
          ) {
            element.setCustomValidity(
              'Enter a website URL starting with https:// or http://.',
            );
          }
          if (element instanceof HTMLInputElement && element.type === 'tel') {
            const dialCode = element
              .closest('[data-dial-code]')
              ?.getAttribute('data-dial-code');
            if (dialCode) {
              element.setCustomValidity(
                validatePhoneNumber(dialCode, element.value, {
                  required: element.required,
                }),
              );
            } else if (element.value.trim()) {
              element.setCustomValidity(validatePhoneText(element.value));
            }
          }
          if (
            element instanceof HTMLInputElement &&
            element.type === 'number' &&
            element.value &&
            !/^-?\d+(?:\.\d+)?$/.test(element.value)
          ) {
            element.setCustomValidity('Enter a valid decimal number.');
          }
          if (locale === 'bm') {
            if (element.validity.valueMissing)
              element.setCustomValidity(t('This field is required.'));
            else if (
              element.validity.typeMismatch &&
              element instanceof HTMLInputElement &&
              element.type === 'email'
            )
              element.setCustomValidity(t('Enter a valid email address.'));
            else if (element.validity.customError)
              element.setCustomValidity(t(element.validationMessage));
          }
          if (!element.validity.valid) {
            element.setAttribute('aria-invalid', 'true');
            firstInvalid ??= element;
          } else element.removeAttribute('aria-invalid');
        });
        if (firstInvalid) {
          event.preventDefault();
          event.stopPropagation();
          const label =
            firstInvalid.labels?.[0]?.textContent?.replace('*', '').trim() ||
            firstInvalid.getAttribute('aria-label') ||
            'Field';
          setError(`${label}: ${firstInvalid.validationMessage}`);
          firstInvalid.focus();
          firstInvalid.reportValidity();
          return;
        }
        setError('');
        onSubmitCapture?.(event);
      }}
    >
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {Object.values(fieldErrors).some(Boolean) && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="font-semibold">{t(errorSummaryLabel)}</p>
          <ul className="mt-2 space-y-1">
            {Object.entries(fieldErrors)
              .filter(([, message]) => message)
              .map(([field, message]) => (
                <li key={field}>
                  <button
                    type="button"
                    className="min-h-9 rounded text-left underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700"
                    onClick={(event) => {
                      const form = event.currentTarget.closest('form');
                      const control = Array.from(
                        form?.querySelectorAll<HTMLElement>(
                          '[name], [data-field]',
                        ) ?? [],
                      ).find(
                        (element) =>
                          element.getAttribute('name') === field ||
                          element.dataset.field === field,
                      );
                      (control?.matches('input, select, textarea')
                        ? control
                        : control?.querySelector<HTMLElement>(
                            'input, select, textarea, button',
                          )
                      )?.focus();
                    }}
                  >
                    {message}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
      {children}
    </form>
  );
};
