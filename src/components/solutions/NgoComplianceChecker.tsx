import Link from 'next/link';

const GOOD_FIT = [
  'Clearing out donated electronics that no longer work',
  'Decommissioning an old computer lab or office setup',
  'Need certificates for your own donor or ESG reporting',
  'Handling more devices than a single pickup covers',
];

const TALK_TO_US_FIRST = [
  'Just one or two personal devices (individual pickup covers this)',
  'Not sure whether it counts as "bulk"',
  'Need collection timed around an event or move-out date',
];

const NgoComplianceChecker = () => (
  <section className="border-b border-slate-100 bg-white py-10 md:py-12">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h3 className="mb-6 font-montserrat text-lg font-bold text-neutral-950 md:text-xl">
          Does bulk collection make sense for your organisation?
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Good fit */}
          <div>
            <p className="mb-3 text-sm font-semibold text-green-700">
              Likely a good fit ✓
            </p>
            <ul className="flex flex-col gap-2.5">
              {GOOD_FIT.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-0.5 shrink-0 text-green-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Talk to us first */}
          <div>
            <p className="mb-3 text-sm font-semibold text-yellow-600">
              Talk to us first ◦
            </p>
            <ul className="flex flex-col gap-2.5">
              {TALK_TO_US_FIRST.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="mt-0.5 shrink-0 text-yellow-500">◦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 border-t border-slate-100 pt-5 text-sm text-slate-500">
          Not sure?{' '}
          <Link
            href="/contact"
            className="font-medium text-brand-600 hover:underline"
          >
            Book a free 15-minute call
          </Link>{' '}
          — we&apos;ll help you figure out the right path, individual or bulk.
        </p>
      </div>
    </div>
  </section>
);

export { NgoComplianceChecker };
