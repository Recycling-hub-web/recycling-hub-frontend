import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { ASSETS } from '../../../constants/content';
import { SectionHeading } from '../../ui/SectionHeading';

const ease = [0.22, 1, 0.36, 1] as const;

const VW = 800;
const VH = 520;
const PH = 38;
const PR = 19;
const CX = 400;
const CY = 435;
const CR = 82;

type Pill = { name: string; x: number; y: number; w: number; color: string };

const PILLS: Pill[] = [
  // Row 1 — who hands devices over
  { name: 'Households', x: 119, y: 54, w: 138, color: '#3b82f6' },
  { name: 'Offices', x: 307, y: 54, w: 138, color: '#8b5cf6' },
  { name: 'Factories', x: 495, y: 54, w: 138, color: '#06b6d4' },
  { name: 'Retailers', x: 683, y: 54, w: 138, color: '#10b981' },
  // Row 2 — what the hub delivers
  { name: 'Certified Destruction', x: 88, y: 148, w: 168, color: '#f59e0b' },
  { name: 'DOE Compliance', x: 255, y: 148, w: 138, color: '#ef4444' },
  { name: 'ESG Reporting', x: 400, y: 148, w: 128, color: '#6366f1' },
  { name: 'Instant Payment', x: 545, y: 148, w: 140, color: '#14b8a6' },
  { name: 'Chain of Custody', x: 700, y: 148, w: 150, color: '#f97316' },
];

const iconTop = CY - CR;

const curvePath = (pill: Pill): string => {
  const sy = pill.y + PH / 2;
  const cpy = sy + (iconTop - sy) * 0.55;
  return `M ${pill.x} ${sy} C ${pill.x} ${cpy} ${CX} ${cpy} ${CX} ${iconTop}`;
};

const HubDiagram = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for center circle */}
        <linearGradient id="hub-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#008a3e" />
          <stop offset="100%" stopColor="#0a3d2e" />
        </linearGradient>

        {/* Drop shadow for center icon */}
        <filter id="hub-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="16"
            floodColor="#0a3d2e"
            floodOpacity="0.2"
          />
        </filter>

        {/* Subtle shadow for pills */}
        <filter id="pill-shadow" x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="#000000"
            floodOpacity="0.06"
          />
        </filter>
      </defs>

      {/* Curved connecting lines */}
      {PILLS.map((pill, i) => (
        <path
          key={`line-${pill.name}`}
          d={curvePath(pill)}
          stroke={activeIndex === i ? pill.color : '#e2e6ec'}
          strokeWidth={activeIndex === i ? 1.2 : 0.8}
          style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
        />
      ))}

      {/* Pills */}
      {PILLS.map((pill, i) => {
        const isActive = activeIndex === i;
        return (
          <g
            key={pill.name}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{ cursor: 'default' }}
          >
            <rect
              x={pill.x - pill.w / 2}
              y={pill.y - PH / 2}
              width={pill.w}
              height={PH}
              rx={PR}
              fill="white"
              stroke={isActive ? pill.color : '#e2e6ec'}
              strokeWidth={isActive ? 1.2 : 0.8}
              filter="url(#pill-shadow)"
              style={{
                transition: 'stroke 0.25s ease, stroke-width 0.25s ease',
              }}
            />
            <text
              x={pill.x}
              y={pill.y + 5}
              textAnchor="middle"
              fontSize="13"
              fontFamily="Inter, system-ui, -apple-system, sans-serif"
              fontWeight="400"
              fill="#334155"
            >
              {pill.name}
            </text>
          </g>
        );
      })}

      {/* Outer glow ring */}
      <circle cx={CX} cy={CY} r={CR + 14} fill="#008a3e" fillOpacity="0.08" />

      {/* Center circle — gradient */}
      <circle
        cx={CX}
        cy={CY}
        r={CR}
        fill="url(#hub-grad)"
        filter="url(#hub-shadow)"
      />

      {/* White logo */}
      <image
        href={ASSETS.logo.symbolWhite}
        x={CX - 44}
        y={CY - 44}
        width={88}
        height={88}
      />
    </svg>
  );
};

const SupportedSystems = () => (
  <section id="supported-systems" className="bg-white py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="mb-14 text-center">
        <SectionHeading
          eyebrow="Who We Collect From"
          headline="Works Whether It's One Phone or a Whole Warehouse"
          subtext="Households, offices, factories, and retailers — we run the same licensed, documented process around whoever's handing over the devices."
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto max-w-3xl overflow-x-auto"
      >
        <div className="min-w-[560px]">
          <HubDiagram />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4, ease }}
        className="mt-2 text-center text-sm text-slate-400"
      >
        Not sure if your volume counts as &ldquo;bulk&rdquo;?{' '}
        <Link
          href="/contact"
          className="font-semibold text-neutral-950 hover:underline"
        >
          Talk to us
        </Link>{' '}
        — we&apos;ll tell you honestly.
      </motion.p>
    </div>
  </section>
);

export { SupportedSystems };
