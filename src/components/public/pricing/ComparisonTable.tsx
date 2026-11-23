import { motion } from 'framer-motion';
import React from 'react';

import { PRICING_TIERS } from '../../../constants/content';
import { SectionHeading } from '../../ui/SectionHeading';

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#0f0f0f" fillOpacity="0.1" />
    <path
      d="M4.5 9l3 3 6-6"
      stroke="#0f0f0f"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill="#f1f5f9" />
    <path
      d="M5.5 5.5l7 7M12.5 5.5l-7 7"
      stroke="#cbd5e1"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const FEATURE_ROWS = [
  'Invoices/month',
  'Connected setups',
  'Real-time MyInvois submission',
  'Dashboard & audit logs',
  'Support',
  'Multi-user access',
  'Priority support',
  'Custom ERP integration',
  'Dedicated account manager',
];

const CELL_VALUES: Record<string, string[]> = {
  'Invoices/month': ['500', '3,000', 'Unlimited', 'Unlimited'],
  'Connected setups': ['1', 'Up to 3', 'Unlimited', 'Unlimited'],
  'Real-time MyInvois submission': ['✓', '✓', '✓', '✓'],
  'Dashboard & audit logs': ['Basic', 'Full', 'Full', 'Full'],
  Support: ['Email', 'Email & chat', 'Priority', 'Dedicated'],
  'Multi-user access': ['1 seat', '5 seats', '20 seats', 'Unlimited'],
  'Priority support': ['—', '—', '✓', '✓'],
  'Custom ERP integration': ['—', '—', '✓', '✓'],
  'Dedicated account manager': ['—', '—', '—', '✓'],
};

const ComparisonTable = () => (
  <section className="bg-slate-50 py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-14 text-center">
        <SectionHeading
          eyebrow="Compare Plans"
          headline="Full Feature Breakdown"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"
      >
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-5 text-left font-semibold text-slate-600">
                Feature
              </th>
              {PRICING_TIERS.map((tier) => (
                <th
                  key={tier.name}
                  className={`px-4 py-5 text-center font-montserrat text-sm font-extrabold ${
                    tier.highlight ? 'text-neutral-950' : 'text-slate-900'
                  }`}
                >
                  {tier.name}
                  {tier.highlight && (
                    <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-950">
                      Popular
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURE_ROWS.map((row, i) => {
              const cells = CELL_VALUES[row] ?? [];
              return (
                <tr
                  key={row}
                  className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {row}
                  </td>
                  {cells.map((val, j) => {
                    let cellContent: React.ReactNode;
                    if (val === '✓') {
                      cellContent = (
                        <div className="flex justify-center">
                          <CheckIcon />
                        </div>
                      );
                    } else if (val === '—') {
                      cellContent = (
                        <div className="flex justify-center">
                          <CrossIcon />
                        </div>
                      );
                    } else {
                      cellContent = (
                        <span
                          className={`font-medium ${j === 1 ? 'text-neutral-950' : 'text-slate-700'}`}
                        >
                          {val}
                        </span>
                      );
                    }
                    return (
                      <td key={j} className="p-4 text-center">
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  </section>
);

export { ComparisonTable };
