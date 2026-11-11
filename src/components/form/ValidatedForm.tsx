'use client';

import type { FormHTMLAttributes } from 'react';
import { useState } from 'react';

import { validatePhoneNumber } from '../../constants/dialCodes';
import { fieldLimit, validatePhoneText, validateText } from './validation';

/** Runs even in modal forms using noValidate and preserves their submit handlers. */
export const ValidatedForm = ({
  children,
  onSubmitCapture,
  onInputCapture,
  ...props
}: FormHTMLAttributes<HTMLFormElement>) => {
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
      {children}
    </form>
  );
};
