import { type FormEvent, useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa6';
import { LuLeaf, LuShieldCheck, LuTruck } from 'react-icons/lu';

import { BRAND } from '../../constants/content';
import { Meta } from '../layout/Meta';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIALS = [
  { label: 'Instagram', href: BRAND.social.instagram, Icon: FaInstagram },
  { label: 'Facebook', href: BRAND.social.facebook, Icon: FaFacebook },
  { label: 'LinkedIn', href: BRAND.social.linkedin, Icon: FaLinkedin },
  // TODO: swap in a real TikTok profile URL once the account exists
  { label: 'TikTok', href: '#', Icon: FaTiktok },
];

type CubeProps = {
  cx: number;
  cy: number;
  s: number;
};

// Isometric cube: three rhombus faces (top / left / right) shaded to fake a
// light source from the top-left, drawn in our own brand greens.
const IsoCube = ({ cx, cy, s }: CubeProps) => {
  const dx = s * 0.87;
  const dy = s * 0.5;
  return (
    <g>
      <polygon
        points={`${cx},${cy - s} ${cx + dx},${cy - dy} ${cx},${cy} ${cx - dx},${cy - dy}`}
        fill="#80c59f"
      />
      <polygon
        points={`${cx - dx},${cy - dy} ${cx},${cy} ${cx},${cy + s} ${cx - dx},${cy + dy}`}
        fill="#269c5b"
      />
      <polygon
        points={`${cx + dx},${cy - dy} ${cx},${cy} ${cx},${cy + s} ${cx + dx},${cy + dy}`}
        fill="#007535"
      />
    </g>
  );
};

const CubeIllustration = () => (
  <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-sm">
    {/* Scattered dot accents */}
    <circle cx="340" cy="70" r="7" fill="#52af7c" opacity="0.8" />
    <circle cx="60" cy="120" r="4" fill="#52af7c" opacity="0.5" />
    <circle cx="90" cy="300" r="5" fill="#52af7c" opacity="0.6" />
    <circle cx="330" cy="290" r="4" fill="#52af7c" opacity="0.4" />
    <circle cx="230" cy="60" r="3" fill="#80c59f" opacity="0.6" />

    <IsoCube cx={230} cy={190} s={90} />
    <IsoCube cx={120} cy={290} s={44} />
  </svg>
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
          <div className="flex items-center gap-1.5">
            <LuLeaf size={16} className="text-brand-600" />
            <span className="text-sm font-semibold text-neutral-950">
              recycling hub
              <span className="text-slate-400"> .eco</span>
            </span>
          </div>

          {/* Main content */}
          <div className="grid flex-1 items-center gap-12 py-16 md:grid-cols-2">
            <div>
              <h1 className="font-montserrat text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-950 sm:text-5xl md:text-6xl">
                Something green is coming
              </h1>

              <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-500">
                Registered e-waste collection and recycling for homes and
                businesses across Malaysia. Launching soon.
              </p>

              {/* Email capture */}
              <form
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
                    className="shrink-0 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
                  >
                    Notify me
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
              </form>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
                  <LuShieldCheck size={14} />
                  DOE registered
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
                  <LuTruck size={14} />
                  Free doorstep pickup
                </span>
              </div>
            </div>

            {/* Illustration */}
            <div>
              <CubeIllustration />
            </div>
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
