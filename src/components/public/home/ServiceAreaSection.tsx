import Link from 'next/link';

import { useDictionary } from '../../../hooks/useDictionary';

const ServiceAreaSection = () => {
  const {
    home: { serviceArea },
  } = useDictionary();
  return (
    <section className="bg-brand-50 px-5 py-14 md:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-neutral-950">
          {serviceArea.heading}
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600">
          {serviceArea.description}
        </p>
        <div className="mt-6 flex flex-col gap-4 text-brand-700 underline underline-offset-4">
          <Link href="/services/collection-pickup">
            {serviceArea.householdLink}
          </Link>
          <Link href="/services/bulk-industrial-collection">
            {serviceArea.businessLink}
          </Link>
          <Link href="/request-quote">{serviceArea.quoteLink}</Link>
        </div>
      </div>
    </section>
  );
};

export { ServiceAreaSection };
