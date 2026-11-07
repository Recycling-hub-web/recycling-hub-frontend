'use client';

import type { ReactNode } from 'react';
import { LuBuilding2, LuChevronRight, LuPhoneCall } from 'react-icons/lu';

import { useDictionary } from '../../../../../hooks/useDictionary';
import { FadeIn } from '../../../../ui/FadeIn';

type PickupTypeSelectorProps = {
  onSelectCallback: () => void;
  onSelectBusiness: () => void;
};

type OptionProps = {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
};

const Option = ({
  icon,
  title,
  description,
  onClick,
  className = '',
}: OptionProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex w-full items-center gap-4 p-6 text-left transition hover:bg-slate-50 ${className}`}
  >
    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block font-semibold text-neutral-950">{title}</span>
      <span className="mt-0.5 block text-sm text-slate-500">{description}</span>
    </span>
    <LuChevronRight className="size-5 shrink-0 text-slate-300 transition group-hover:text-brand-600" />
  </button>
);

/** Fork shown before a form, on this same page (see request-pickup.tsx):
 * a callback (phone number only — QuickPickupRequestForm, followed up by
 * staff) or a business/bulk request (the full PublicPickupRequestForm).
 * There's no individual/household option on the public site. Neither
 * card navigates away, so picking one is reversible. */
const PickupTypeSelector = ({
  onSelectCallback,
  onSelectBusiness,
}: PickupTypeSelectorProps) => {
  const {
    pickupRequest: { typeSelector: content },
  } = useDictionary();

  return (
    <section className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-2xl px-5 text-center md:px-8">
        <FadeIn>
          <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
            {content.heading}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{content.subheading}</p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <Option
              icon={<LuPhoneCall size={20} />}
              title={content.callback.title}
              description={content.callback.description}
              onClick={onSelectCallback}
              className="border-b border-slate-100"
            />
            <Option
              icon={<LuBuilding2 size={20} />}
              title={content.business.title}
              description={content.business.description}
              onClick={onSelectBusiness}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export { PickupTypeSelector };
