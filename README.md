# Recycling Hub — E-Invoice Integration Service

Multi-page marketing website for **Recycling Hub**, a Malaysian e-invoicing middleware that connects businesses to LHDN's MyInvois API. Built front-end first — full-stack (auth, client portal, admin panel) is the next phase.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 — Pages Router |
| Styling | Tailwind CSS v3 with custom brand tokens |
| Animations | Framer Motion |
| Language | TypeScript (strict) |
| Linting | ESLint (Airbnb + Next.js) + Prettier |
| Git hooks | Husky + lint-staged (ESLint, Prettier, tsc on every commit) |
| Deployment | Vercel (auto-deploy from `master`) |

---

## Pages

| Route | File | Sections |
|---|---|---|
| `/` | `pages/index.tsx` | Hero, Trust stats, Connectors, Comparison (sticky scroll), Why Recycling Hub, How It Works, Delivery Models, FAQ, CTA |
| `/services` | `pages/services.tsx` | Hero, Service Overview (flow), Product Features, Supported Systems, Process, Packages, Compliance & Security, FAQ, Book Demo |
| `/pricing` | `pages/pricing.tsx` | Hero, Trust bar, Tiers (monthly/annual toggle), Comparison table, Add-ons, FAQ, CTA |
| `/about` | `pages/about.tsx` | Hero, Mission Statement, Our Values, Meet the Team, Who We Work With, Book Demo |
| `/contact` | `pages/contact.tsx` | Hero, Contact Options (email/WhatsApp/website), Book Demo, FAQ, Social links |

---

## Project Structure

```
src/
│
├── pages/                        # Thin view wrappers — one import + one return
│   ├── index.tsx                 # /
│   ├── services.tsx              # /services
│   ├── pricing.tsx               # /pricing
│   ├── about.tsx                 # /about
│   ├── contact.tsx               # /contact
│   ├── _app.tsx                  # getLayout pattern + Lenis smooth scroll
│   └── _document.tsx
│
├── layouts/
│   └── PublicLayout.tsx          # Navbar + main + Footer
│
├── components/
│   ├── navbar/
│   │   └── Navbar.tsx            # Fixed, scroll-aware, dark/light variant, page icons
│   │
│   ├── layout/
│   │   ├── Footer.tsx            # 4-column: brand + services + company + legal
│   │   └── Meta.tsx
│   │
│   ├── public/
│   │   ├── home/                 # HeroSection, ComparisonSection (sticky scroll),
│   │   │                         # TrustStrip, ConnectorsStrip, ProblemStrip,
│   │   │                         # WhyRecyclingHub, DeliveryModels, FinalCTA
│   │   ├── about/                # MissionStatement, OurValues, TeamSection,
│   │   │                         # WhoWeWorkWith
│   │   ├── services/             # ServiceOverview, ProductFeatures, SupportedSystems,
│   │   │                         # ServiceProcess, ComplianceSecurity
│   │   ├── pricing/              # PricingTiers, ComparisonTable, AddOns,
│   │   │                         # PricingFaq, PricingCTA, PricingTrustBar
│   │   ├── contact/              # ContactOptions, ContactFaq, SocialLinks
│   │   └── shared/               # BookDemo, FaqSection, HowItWorks,
│   │                             # ServicePackages, PageHero, CtaBanner
│   │
│   └── ui/                       # Generic reusable UI
│       ├── Background.tsx        # variant: gradient|blur|white|…
│       ├── SectionHeading.tsx    # eyebrow + headline + optional description
│       ├── FadeIn.tsx            # whileInView wrapper
│       ├── SplitText.tsx         # Word-level stagger animation
│       ├── hero/
│       │   └── ReusableHero.tsx  # Dark navy hero for inner pages
│       └── buttons/
│           ├── Button.tsx
│           └── ArrowButton.tsx
│
├── constants/
│   └── content.ts                # Single source of truth — BRAND, ASSETS, NAV_LINKS,
│                                 # PAGE_HEROES, FOOTER, ABOUT_*, PRICING_*, …
│
├── types/
│   └── next.ts                   # NextPageWithLayout
│
└── styles/
    └── global.css

public/
  assets/
    background/
    brand/
      logo/                       # icon.png  white-icon-bg.png  dark-bg.png
      favicon_io/
```

---

## Key Conventions

**Pages are thin wrappers**
```tsx
const ServicesPage: NextPageWithLayout = () => (
  <>
    <Meta title="..." description="..." />
    <PageHero eyebrow="..." headline="..." description="..." />
    <Features />
    <Pricing />
    <BookDemo />
  </>
);
ServicesPage.getLayout = (page) => <PublicLayout>{page}</PublicLayout>;
export default ServicesPage;
```

**Asset paths — always from ASSETS, never hardcoded**
```ts
import { ASSETS } from '../constants/content';
// ASSETS.logo.whiteIconBg  →  '/assets/brand/logo/white-icon-bg.png'
// ASSETS.background.blur   →  '/assets/background/blur-img-bg-1.png'
```

**Background component**
```tsx
<Background variant="blur" position="top" className="relative z-10">
  <Hero />
</Background>

// Renders as a semantic element:
<Background as="footer" variant="blur" className="rounded-xl">
```

**Zero inline styles** — everything is Tailwind, including arbitrary values:
`bg-[url('/...')]` · `tracking-[-0.02em]` · `shadow-[0_0_0_2px_#05395920]` · `backdrop-blur-[14px]`

**Brand tokens** (`tailwind.config.js`)

| Token | Value | Usage |
|---|---|---|
| `brand-500` | `#053959` | Primary text, borders, icons |
| `brand-900` | `#021724` | Dark backgrounds |
| `brand-100` | `#e8eff4` | Eyebrow badges, icon backgrounds |
| `font-montserrat` | Montserrat | Headings, prices, step numbers |

**Hero backgrounds** (ReusableHero / inner pages):
`linear-gradient(160deg, #020a14 0%, #053959 100%)` with a 40px line grid overlay (`rgba(255,255,255,0.06)`).

---

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint check
npm run format       # ESLint --fix + Prettier
npm run check-types  # TypeScript (no emit)
npm run clean        # Delete .next .swc out
npm run build-prod   # clean + build
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. Never commit `.env.local`.

```bash
# Current (front-end only)
NEXT_PUBLIC_SITE_URL=https://www.recyclinghub.eco
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/recyclinghub
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/601112345678

# Phase 1 — Lead capture
NEXT_PUBLIC_API_URL=http://localhost:3000

# Phase 2 — Auth + Database
DATABASE_URL=
DIRECT_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
RESEND_API_KEY=

# Phase 3 — LHDN MyInvois
LHDN_CLIENT_ID=
LHDN_CLIENT_SECRET=
LHDN_BASE_URL=
```

---

## Full-Stack Roadmap

### Phase 1 — Lead capture
- [ ] Book Demo / Contact form → `api/leads` → Supabase `leads` table
- [ ] Email notification on new lead (Resend)
- [ ] `components/features/leads/` — service + hook + form component

### Phase 2 — Client portal
- [ ] Auth: NextAuth v5 + Supabase
- [ ] `layouts/AuthLayout.tsx` — login / register pages
- [ ] `/dashboard` — project status, invoice logs, billing
- [ ] `components/features/integrations/` · `features/invoices/`

### Phase 3 — Admin panel
- [ ] `layouts/AdminLayout.tsx` — sidebar shell
- [ ] `/admin` — leads pipeline, client onboarding, project management
- [ ] LHDN MyInvois webhook receiver + status sync
- [ ] `components/features/leads/` · `features/clients/` · `features/staff/`

### Database schema (Supabase + Prisma)

```
leads          id, name, email, phone, company, system, message, status, createdAt
clients        id, company, contactEmail, plan, createdAt
integrations   id, clientId, system, status, goLiveDate, notes
invoices       id, integrationId, lhdnRef, status, submittedAt, errorLog
```

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `master` | Production — auto-deployed to Vercel |
| `release/1.0.0` | Current release candidate |
| `feature/*` | Feature branches off `master` |

---

## License

ISC © 2026 Recycling Hub Sdn Bhd
