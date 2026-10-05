'use client';

import { LuBuilding2, LuChevronRight, LuSmartphone } from 'react-icons/lu';

import { useDictionary } from '../../../../hooks/useDictionary';
import { FadeIn } from '../../../ui/FadeIn';
import type { PickupRequestType } from '../types';

type PickupTypeSelectorProps = {
  onSelect: (type: PickupRequestType) => void;
  onSelectQuick: () => void;
};

/** Fork shown before the real form — both options now submit through the
 * same CollectionRequest form on this same page (see request-pickup.tsx),
 * tagged via `request_type` at submit. Neither card navigates away, so
 * picking one is reversible (the form step has its own "change type"
 * link back to this selector). A third, lower-key option below skips
 * straight to QuickPickupRequestForm (type + phone only, linked for
 * staff follow-up — see PickupQuickRequest). */
const PickupTypeSelector = ({
  onSelect,
  onSelectQuick,
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
            <button
              type="button"
              onClick={() => onSelect('individual')}
              className="group flex w-full items-center gap-4 border-b border-slate-100 p-6 text-left transition hover:bg-slate-50"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <LuSmartphone size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-neutral-950">
                  {content.individual.title}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  {content.individual.description}
                </span>
              </span>
              <LuChevronRight className="size-5 shrink-0 text-slate-300 transition group-hover:text-brand-600" />
            </button>

            <button
              type="button"
              onClick={() => onSelect('business')}
              className="group flex w-full items-center gap-4 p-6 text-left transition hover:bg-slate-50"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <LuBuilding2 size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-neutral-950">
                  {content.business.title}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  {content.business.description}
                </span>
              </span>
              <LuChevronRight className="size-5 shrink-0 text-slate-300 transition group-hover:text-brand-600" />
            </button>
          </div>

          <button
            type="button"
            onClick={onSelectQuick}
            className="mt-4 text-sm font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700"
          >
            {content.quickLinkText}
          </button>
        </FadeIn>
      </div>
    </section>
  );
};

export { PickupTypeSelector };
