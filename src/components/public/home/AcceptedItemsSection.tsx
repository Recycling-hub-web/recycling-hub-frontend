import { FaWhatsapp } from 'react-icons/fa6';
import {
  LuCheck,
  LuLaptop,
  LuMonitor,
  LuPrinter,
  LuSmartphone,
} from 'react-icons/lu';

import { BRAND } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import { PublicButton } from '../../ui/buttons/PublicButton';
import { SectionHeading } from '../../ui/SectionHeading';

// One icon per category, in the dictionary's category order.
const CATEGORY_ICONS = [LuSmartphone, LuLaptop, LuMonitor, LuPrinter];

/** "What can I recycle?" — the device types we take, the items to ask about
 * first (with a send-a-photo WhatsApp link), and the household pickup
 * rules in one line, so a visitor knows before booking. */
const AcceptedItemsSection = () => {
  const {
    home: { accepted },
  } = useDictionary();
  return (
    <section
      id="what-we-accept"
      aria-labelledby="what-we-accept-heading"
      className="bg-white px-5 py-16 md:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div id="what-we-accept-heading">
          <SectionHeading
            eyebrow={accepted.eyebrow}
            headline={accepted.headline}
            subtext={accepted.subtext}
          />
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {accepted.facts.map((fact) => (
            <li
              key={fact}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800"
            >
              <LuCheck className="size-4" aria-hidden />
              {fact}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {accepted.categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[index] ?? LuCheck;
            return (
              <div
                key={category.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold text-neutral-950">
                  {category.title}
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  {category.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <LuCheck
                        className="mt-0.5 size-4 shrink-0 text-brand-600"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-neutral-950">
              {accepted.askFirst.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {accepted.askFirst.body}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <PublicButton href={BRAND.whatsapp} variant="secondary">
              <FaWhatsapp className="mr-2 size-4" aria-hidden />
              {accepted.askFirst.cta}
            </PublicButton>
            <PublicButton href="/request-pickup">
              {accepted.requestPickup}
            </PublicButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export { AcceptedItemsSection };
