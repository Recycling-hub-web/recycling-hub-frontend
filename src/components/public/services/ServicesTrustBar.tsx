import { LuShieldCheck } from 'react-icons/lu';

import { BRAND } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';

const ServicesTrustBar = () => {
  const { services } = useDictionary();
  const items = [services.trustBar[0], BRAND.legalName, services.trustBar[1]];

  return (
    <section className="border-y border-slate-100 bg-neutral-50 py-6">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
            >
              <LuShieldCheck size={14} className="shrink-0 text-brand-600" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export { ServicesTrustBar };
