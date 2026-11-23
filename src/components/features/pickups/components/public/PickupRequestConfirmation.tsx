import { useEffect, useRef } from 'react';
import { LuCircleCheck } from 'react-icons/lu';

import { useDictionary } from '../../../../../hooks/useDictionary';
import { Button } from '../../../../ui/buttons/Button';

type Props = {
  kind: 'callback' | 'business';
  receipt: { reference: string; phone: string };
  onAnother: () => void;
};

/** Only rendered after the server accepts a request, never for a message draft. */
export const PickupRequestConfirmation = ({
  kind,
  receipt,
  onAnother,
}: Props) => {
  const {
    pickupRequest: { confirmation: copy },
  } = useDictionary();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.scrollIntoView({ block: 'center' });
    heading.current?.focus({ preventScroll: true });
  }, []);
  return (
    <section
      className="mx-auto mb-16 max-w-2xl px-5 md:px-8"
      aria-label={kind === 'callback' ? copy.callbackTitle : copy.businessTitle}
    >
      <div className="rounded-3xl border border-brand-200 bg-brand-50 p-6 md:p-8">
        <LuCircleCheck className="mb-4 size-9 text-brand-700" aria-hidden />
        <h2
          ref={heading}
          tabIndex={-1}
          className="text-2xl font-bold text-neutral-950 focus:outline-none"
        >
          {kind === 'callback' ? copy.callbackTitle : copy.businessTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {kind === 'callback' ? copy.callbackNext : copy.businessNext}
        </p>
        <dl className="my-5 space-y-4 rounded-2xl border border-brand-200 bg-white p-4 text-sm">
          <div>
            <dt className="text-slate-600">{copy.reference}</dt>
            <dd className="mt-1 break-all font-mono font-semibold text-neutral-950">
              {receipt.reference}
            </dd>
          </div>
          <div>
            <dt className="text-slate-600">{copy.phone}</dt>
            <dd className="mt-1 font-semibold text-neutral-950">
              •••• {receipt.phone.replace(/\D/g, '').slice(-4)}
            </dd>
          </div>
        </dl>
        <p className="mb-5 text-sm text-slate-700">{copy.keepReference}</p>
        <Button onClick={onAnother} variant="secondary">
          {copy.another}
        </Button>
      </div>
    </section>
  );
};
