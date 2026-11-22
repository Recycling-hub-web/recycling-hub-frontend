import { useEffect, useState } from 'react';

import { BRAND } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';

/** Preparing a draft never implies that WhatsApp or email delivered it. */
export const openWhatsAppDraft = (message: string) => {
  window.open(
    `https://wa.me/${BRAND.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener,noreferrer',
  );
};

export const MessageHandoff = ({
  message,
  subject,
}: {
  message: string;
  subject: string;
}) => {
  const { messageHandoff: copy } = useDictionary();
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => {
    setCopyStatus('');
  }, [message]);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus(copy.copied);
    } catch {
      setCopyStatus(copy.copyFailed);
    }
  };

  return (
    <div className="mt-5 space-y-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
      <p role="status" className="text-sm font-medium text-brand-800">
        {copy.notice}
      </p>
      <label className="block text-sm font-medium text-slate-900">
        {copy.preview}
        <textarea
          readOnly
          value={message}
          rows={5}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700 focus:outline focus:outline-2 focus:outline-brand-700"
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copyMessage}
          className="min-h-11 rounded-full border border-brand-700 bg-white px-4 text-sm font-semibold text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          {copy.copy}
        </button>
        <a
          href={`mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
          className="inline-flex min-h-11 items-center rounded text-sm font-semibold text-brand-800 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
        >
          {copy.email}
        </a>
      </div>
      <p className="text-xs text-slate-600">{copy.emailNote}</p>
      <p role="status" className="text-sm text-slate-700">
        {copyStatus}
      </p>
    </div>
  );
};
