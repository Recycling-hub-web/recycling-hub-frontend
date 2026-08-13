interface Column {
  label: string;
  headline: string;
  bullets: string[];
}

interface BeforeAfterComparisonProps {
  eyebrow?: string;
  left: Column;
  right: Column;
}

const XMark = () => (
  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M2 2l6 6M8 2l-6 6"
        stroke="#dc2626"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

const CheckMark = () => (
  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M1.5 5l2.5 2.5 4.5-4.5"
        stroke="#16a34a"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const BeforeAfterComparison = ({
  eyebrow = 'The Reality',
  left,
  right,
}: BeforeAfterComparisonProps) => (
  <section className="bg-neutral-50 py-16">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
        {eyebrow}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left — without Recycling Hub */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <span className="mb-4 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
            {left.label}
          </span>
          <h3 className="font-montserrat text-xl font-bold text-neutral-950">
            {left.headline}
          </h3>
          <ul className="mt-6 flex flex-col gap-3">
            {left.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-sm leading-relaxed text-slate-600"
              >
                <XMark />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — with Recycling Hub */}
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
          <span className="mb-4 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {right.label}
          </span>
          <h3 className="font-montserrat text-xl font-bold text-neutral-950">
            {right.headline}
          </h3>
          <ul className="mt-6 flex flex-col gap-3">
            {right.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-sm leading-relaxed text-slate-600"
              >
                <CheckMark />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export { BeforeAfterComparison };
