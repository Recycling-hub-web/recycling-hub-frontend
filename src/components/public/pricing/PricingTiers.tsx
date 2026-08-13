'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { PRICING_TIERS } from '../../../constants/content';
import { Button } from '../../ui/buttons/Button';

const ease = [0.22, 1, 0.36, 1] as const;

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="7" fill="#0f0f0f" fillOpacity="0.12" />
    <path
      d="M3.5 7l2.5 2.5 4.5-4.5"
      stroke="#0f0f0f"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="7" fill="#f1f5f9" />
    <path
      d="M4.5 4.5l5 5M9.5 4.5l-5 5"
      stroke="#cbd5e1"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const PricingTiers = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Coming soon notice */}
        <div className="mx-auto mb-10 max-w-2xl rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
          <p className="text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-neutral-950">
              Coming Soon —
            </span>{' '}
            these are early-access prices for Recycling Hub Connect, our
            self-serve platform, currently in development. Need MyInvois
            compliance now?{' '}
            <Link
              href="/services#pricing"
              className="font-semibold text-neutral-950 underline-offset-2 hover:underline"
            >
              See our guided setup pricing
            </Link>
            .
          </p>
        </div>

        {/* Toggle */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <span
            className={`text-sm font-medium ${!annual ? 'text-slate-900' : 'text-slate-400'}`}
          >
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
              annual ? 'bg-neutral-950' : 'bg-slate-200'
            }`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                annual ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${annual ? 'text-slate-900' : 'text-slate-400'}`}
          >
            Annual
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              Save ~17%
            </span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease }}
              className={`relative flex flex-col rounded-2xl border p-6 md:p-7 ${
                tier.highlight
                  ? 'border-neutral-950 shadow-[0_0_0_3px_rgba(15,23,42,0.08)]'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-neutral-950 px-4 py-0.5 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="font-montserrat text-base font-extrabold text-slate-900">
                  {tier.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {tier.tagline}
                </p>

                <div className="mt-5">
                  {tier.enterprise ? (
                    <span className="font-montserrat text-3xl font-extrabold text-neutral-950">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="font-montserrat text-3xl font-extrabold text-neutral-950">
                        {annual ? tier.annualPrice : tier.monthlyPrice}
                      </span>
                      <span className="ml-1 text-sm text-slate-400">
                        /month
                      </span>
                    </>
                  )}
                  {annual && !tier.enterprise && (
                    <p className="mt-1 text-xs text-slate-400">
                      {tier.annualNote}
                    </p>
                  )}
                </div>
              </div>

              <ul className="mb-8 flex flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5">
                    {f.included ? <CheckIcon /> : <CrossIcon />}
                    <span
                      className={`text-sm ${f.included ? 'text-slate-700' : 'text-slate-300'}`}
                    >
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  href="/contact"
                  variant={tier.highlight ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { PricingTiers };
