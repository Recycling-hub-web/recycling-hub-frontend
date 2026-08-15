import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { LuArrowUpRight, LuSparkles } from 'react-icons/lu';

const ease = [0.22, 1, 0.36, 1] as const;

// TODO: swap in real photography once available — these are the provided
// E-Wast-Recycler stock photos, standing in for real facility/collection shots.
const PHOTOS = {
  motherboard: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-4.png',
  copperWire: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-6.png',
  tangledCables: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-5.png',
  phonesPile: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-1.png',
  tvShelf: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-7.png',
  crtPile: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-3.png',
  radioShop: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-8.png',
};

// Organic "blob" corner-radius presets (asymmetric per-corner ellipses) —
// rotated across image slots so nothing reads as a plain rectangle.
const BLOB_SHAPES = [
  '60% 40% 30% 70% / 60% 30% 70% 40%',
  '30% 70% 70% 30% / 30% 30% 70% 70%',
  '70% 30% 50% 50% / 50% 50% 30% 70%',
  '40% 60% 60% 40% / 60% 40% 60% 40%',
  '50% 50% 30% 70% / 60% 40% 60% 40%',
];

type CircleAccentProps = {
  src: string;
  size: number;
  className: string;
  delay: number;
};

const CircleAccent = ({ src, size, className, delay }: CircleAccentProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease }}
    className={`pointer-events-none absolute overflow-hidden rounded-full ring-4 ring-white ${className}`}
    style={{ width: size, height: size }}
  >
    <Image src={src} alt="" fill sizes="120px" className="object-cover" />
  </motion.div>
);

const SquigglyArrow = () => (
  <svg
    viewBox="0 0 120 90"
    className="pointer-events-none absolute -bottom-2 right-[8%] hidden w-24 text-slate-300 md:block lg:right-[14%]"
    fill="none"
  >
    <path
      d="M4 6c18 8 22 30 8 40-16 12-8 34 14 32 18-1.5 30-14 34-28"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="1 8"
    />
    <path
      d="M48 40l12 10-4 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type BlobPhotoProps = {
  src: string;
  shapeIndex: number;
  className?: string;
};

const BlobPhoto = ({ src, shapeIndex, className = '' }: BlobPhotoProps) => (
  <div
    className={`relative w-full overflow-hidden ${className}`}
    style={{ borderRadius: BLOB_SHAPES[shapeIndex % BLOB_SHAPES.length] }}
  >
    <Image
      src={src}
      alt=""
      fill
      sizes="(min-width: 768px) 20vw, 40vw"
      className="object-cover"
    />
  </div>
);

const StatCard = () => (
  <div
    className="flex aspect-square w-full flex-col justify-between bg-brand-600 px-5 py-6 text-white sm:px-6 sm:py-7"
    style={{ borderRadius: BLOB_SHAPES[4] }}
  >
    {/* TODO: replace with a real figure once available, e.g. "2,400 kg recycled" or "DOE registered since 2024" */}
    <p className="text-[11px] font-medium uppercase tracking-wide text-white/70 sm:text-xs">
      Coming soon
    </p>
    <div className="flex items-end justify-between gap-2">
      <span className="text-lg font-extrabold leading-none sm:text-2xl">
        Real stat
      </span>
      <LuArrowUpRight className="shrink-0" size={20} />
    </div>
  </div>
);

const GradientCard = () => (
  <div
    className="flex aspect-square w-full flex-col justify-between bg-gradient-to-br from-brand-500 to-brand-900 px-5 py-6 text-white sm:px-6 sm:py-7"
    style={{ borderRadius: BLOB_SHAPES[3] }}
  >
    <LuSparkles size={20} />
    {/* TODO: replace with a real credential, e.g. "SW110 compliant" */}
    <span className="text-sm font-bold leading-snug sm:text-base">
      Certified disposal
    </span>
  </div>
);

const HeroBlobSection = () => (
  <section className="relative overflow-hidden bg-white py-20 md:py-28">
    <div className="relative mx-auto max-w-5xl px-5 md:px-8">
      {/* Scattered circular photo accents */}
      <CircleAccent
        src={PHOTOS.motherboard}
        size={96}
        className="left-[2%] top-2 hidden sm:block"
        delay={0.1}
      />
      <CircleAccent
        src={PHOTOS.copperWire}
        size={84}
        className="right-[4%] top-10 hidden sm:block"
        delay={0.2}
      />
      <CircleAccent
        src={PHOTOS.tangledCables}
        size={56}
        className="bottom-4 left-[10%] hidden md:block"
        delay={0.3}
      />
      <CircleAccent
        src={PHOTOS.phonesPile}
        size={64}
        className="bottom-0 right-[12%] hidden md:block"
        delay={0.4}
      />

      {/* Sparkle doodle */}
      <motion.span
        initial={{ opacity: 0, rotate: -10 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="pointer-events-none absolute left-[20%] top-0 hidden text-brand-400 md:block"
      >
        <LuSparkles size={22} />
      </motion.span>

      {/* Dashed squiggly arrow pointing at the CTA */}
      <SquigglyArrow />

      {/* Headline + copy + CTA */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="font-montserrat text-4xl font-extrabold leading-[1.15] tracking-tight text-neutral-950 sm:text-5xl md:text-6xl"
        >
          Registered{' '}
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1 text-brand-700">
            E-Waste
          </span>{' '}
          Recycling Services You Can Trust
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mx-auto mt-6 max-w-md text-base leading-relaxed text-slate-500 md:text-lg"
        >
          Recycling Hub picks up old electronics for free, wherever you are —
          for households clearing out a drawer of devices and for businesses
          decommissioning a whole office. Every collection is DOE-registered and
          fully documented.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="relative mt-9 inline-flex"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-slate-200 transition-shadow hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)]"
          >
            <span className="text-sm font-semibold text-neutral-950 md:text-base">
              Book Pickup
            </span>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors group-hover:bg-brand-700">
              <LuArrowUpRight size={20} />
            </span>
          </Link>
        </motion.div>
      </div>
    </div>

    {/* Bottom image collage row */}
    <div className="relative z-10 mx-auto mt-16 max-w-5xl px-5 md:mt-24 md:px-8">
      <div className="grid grid-cols-2 items-end gap-4 sm:grid-cols-3 md:grid-cols-5">
        <StatCard />

        <BlobPhoto
          src={PHOTOS.tvShelf}
          shapeIndex={1}
          className="aspect-square"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="col-span-2 sm:col-span-1 md:-translate-y-6"
        >
          <BlobPhoto
            src={PHOTOS.crtPile}
            shapeIndex={2}
            className="aspect-[4/5] md:aspect-[3/4]"
          />
        </motion.div>

        <BlobPhoto
          src={PHOTOS.radioShop}
          shapeIndex={3}
          className="aspect-square"
        />

        <GradientCard />
      </div>
    </div>
  </section>
);

export { HeroBlobSection };
