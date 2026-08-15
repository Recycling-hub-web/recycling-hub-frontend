import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa6';
import {
  LuArrowUpRight,
  LuShieldCheck,
  LuSparkles,
  LuTruck,
} from 'react-icons/lu';

import { ASSETS, BRAND } from '../../constants/content';
import { Meta } from '../layout/Meta';

const ease = [0.22, 1, 0.36, 1] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIALS = [
  { label: 'Instagram', href: BRAND.social.instagram, Icon: FaInstagram },
  { label: 'Facebook', href: BRAND.social.facebook, Icon: FaFacebook },
  { label: 'LinkedIn', href: BRAND.social.linkedin, Icon: FaLinkedin },
  // TODO: swap in a real TikTok profile URL once the account exists
  { label: 'TikTok', href: '#', Icon: FaTiktok },
];

// Same stock photography and organic-blob styling as the homepage
// HeroBlobSection, so the coming-soon page reads as the same brand.
const PHOTOS = {
  motherboardMacro: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-2.png',
  tvShelf: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-7.png',
  radioShop: '/assets/img/E-Wast-Recycler/E-Wast-Recycler-8.png',
};

const BLOB_SHAPES = [
  '60% 40% 30% 70% / 60% 30% 70% 40%',
  '30% 70% 70% 30% / 30% 30% 70% 70%',
  '70% 30% 50% 50% / 50% 50% 30% 70%',
];

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
      sizes="(min-width: 768px) 22vw, 45vw"
      className="object-cover"
    />
  </div>
);

const LaunchCard = () => (
  <div className="flex aspect-square w-full flex-col justify-between rounded-[28px] bg-brand-600 p-5 text-white sm:p-6">
    <LuSparkles size={18} />
    <span className="text-sm font-bold leading-snug sm:text-base">
      Launching soon
    </span>
  </div>
);

const ComingSoon = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError(true);
      return;
    }
    setError(false);
    // TODO: wire this up to a real email capture service (e.g. Mailchimp, SendGrid,
    // or a serverless endpoint that stores the address). This only simulates success.
    setSubmitted(true);
  };

  return (
    <>
      <Meta
        title="Coming Soon — Recycling Hub"
        description="Recycling Hub's certified e-waste collection service is launching soon in Malaysia."
      />

      <main className="relative min-h-screen overflow-hidden bg-white px-6 py-8 sm:p-10">
        {/* Grid line texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
          {/* Top bar */}
          <Link href="/" className="inline-flex w-fit">
            <Image
              src={ASSETS.logo.combinedColor}
              alt="Recycling Hub"
              width={140}
              height={40}
              className="h-7 w-auto object-contain"
            />
          </Link>

          {/* Main content */}
          <div className="grid flex-1 items-center gap-12 py-16 md:grid-cols-2">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="font-montserrat text-4xl font-extrabold leading-[1.1] tracking-tight text-neutral-950 sm:text-5xl md:text-6xl"
              >
                Something{' '}
                <span className="inline-block rounded-full bg-brand-50 px-4 py-1 text-brand-700">
                  Green
                </span>{' '}
                Is Coming
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
                className="mt-6 max-w-sm text-base leading-relaxed text-slate-500"
              >
                Registered e-waste collection and recycling for homes and
                businesses across Malaysia. Launching soon.
              </motion.p>

              {/* Email capture */}
              <motion.form
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 w-full max-w-[380px]"
              >
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(false);
                    }}
                    disabled={submitted}
                    placeholder="Enter your email"
                    aria-label="Email address"
                    aria-invalid={error}
                    className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-neutral-950 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={submitted}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 py-2.5 pl-5 pr-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
                  >
                    Notify me
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                      <LuArrowUpRight size={14} />
                    </span>
                  </button>
                </div>

                {error && (
                  <p className="mt-2 text-xs text-red-500">
                    Enter a valid email address
                  </p>
                )}
                {submitted && (
                  <p className="mt-2 text-xs font-medium text-brand-600">
                    You&apos;re on the list
                  </p>
                )}
              </motion.form>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
                className="mt-6 flex flex-wrap gap-2.5"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
                  <LuShieldCheck size={14} />
                  DOE registered
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
                  <LuTruck size={14} />
                  Free doorstep pickup
                </span>
              </motion.div>
            </div>

            {/* Photo collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="mx-auto grid w-full max-w-sm grid-cols-2 gap-4 sm:max-w-md"
            >
              <BlobPhoto
                src={PHOTOS.motherboardMacro}
                shapeIndex={0}
                className="aspect-square"
              />

              <div className="flex flex-col gap-4">
                <BlobPhoto
                  src={PHOTOS.tvShelf}
                  shapeIndex={1}
                  className="aspect-[4/3]"
                />
                <LaunchCard />
              </div>

              <BlobPhoto
                src={PHOTOS.radioShop}
                shapeIndex={2}
                className="col-span-2 aspect-[16/9]"
              />
            </motion.div>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4 border-t border-slate-100 pt-6">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-brand-600"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export { ComingSoon };
