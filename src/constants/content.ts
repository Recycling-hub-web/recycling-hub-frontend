// ─── Assets ───────────────────────────────────────────────────────────────────

export const ASSETS = {
  logo: {
    whiteLogo: '/assets/img/brand/logo/white-logo.png',
    whiteIconBg: '/assets/img/brand/logo/white-icon-bg.png',
    whiteLogoBg: '/assets/img/brand/logo/white-logo-bg.png',
  },
  background: {
    blur: '/assets/background/blur-img-bg-1.png',
    blurAlt: '/assets/background/blur-img-bg.png',
  },
};

// ─── Brand ───────────────────────────────────────────────────────────────────
// Tagline: leads with the customer's biggest fear (having to change software) and the main benefit (speed).

export const BRAND = {
  name: 'Recycling Hub',
  tagline: 'Certified E-Waste Collection & Disposal for Malaysia.',
  email: 'contact@recyclinghub.eco',
  phone: '+60 11-6080 3604',
  website: 'recyclinghub.eco',
  whatsapp:
    'https://wa.me/601160803604?text=Hi%20Recycling%20Hub%2C%20I%27m%20interested%20in%20your%20e-waste%20collection%20service.%20Could%20you%20please%20share%20more%20details%3F%20Thank%20you.',
  calendly: 'https://calendly.com/recyclinghub',
  ssm: 'SSM: Pending registration',
  businessHours: 'Mon–Fri 9am–6pm · Sat 9am–1pm (MYT)',
  social: {
    linkedin: 'https://linkedin.com/company/recyclinghub',
    instagram: 'https://www.instagram.com/recyclinghub?utm_source=qr',
    facebook: 'https://www.facebook.com/share/1BoN37mHcY/?mibextid=wwXIfr',
  },
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
// Labels kept functional. "Services" could become "How It Works" for benefit-forward UX — consider A/B testing.

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// ─── Page Heroes ──────────────────────────────────────────────────────────────
// Each hero now speaks directly to the reader's specific concern on that page, not a generic brand statement.

export const PAGE_HEROES = {
  services: {
    eyebrow: 'What We Do',
    headline: 'One Call,',
    headlineAccent: 'Certified Disposal Handled End to End.',
    description:
      'Individual pickup or enterprise bulk collection — Recycling Hub handles licensed collection, certified data destruction, and full compliance documentation. Free for individuals. Custom-quoted for businesses.',
  },
  about: {
    eyebrow: 'Who We Are',
    headline: 'Three Engineers.',
    headlineAccent: 'One Mandate. Built for Malaysia.',
    description:
      'We are a software agency based in Alor Setar and Petaling Jaya. We built Recycling Hub because Malaysian businesses deserved an e-invoice integration partner that was local, technically honest, and priced fairly.',
  },
  contact: {
    eyebrow: 'Get In Touch',
    headline: 'Not Sure If You Need This?',
    headlineAccent: "Let's Find Out.",
    description:
      "Book a free 15-minute call, or just WhatsApp us. We'll help you figure out whether individual pickup or bulk collection fits your situation — and get you a quote if you need one. No commitment, no pressure.",
  },
  pricing: {
    eyebrow: 'Pricing',
    headline: 'Fixed Price. No Retainers.',
    headlineAccent: 'No Lock-In.',
    description:
      'You know the full cost before we start. You own the source code when we finish. No long-term contracts — just compliance, delivered.',
  },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
// B2B-weighted per business priority: primary CTA is the enterprise quote request, secondary is
// the consumer pickup flow. Badge/trustItems reference DOE + SW110 status — TODO: swap in the real
// DOE (JAS) registration number once issued; do not ship a fabricated one.

export const HERO = {
  badge: '🇲🇾 DOE-Registered E-Waste Collector', // TODO: append real reg. no., e.g. "DOE (JAS) Reg. No. B20XX/XXX"
  headline: 'Certified E-Waste Disposal',
  headlineAccent: 'Your Compliance Team Can Sign Off On.',
  subheadline:
    'Recycling Hub handles DOE- and SW110-compliant bulk collection, certified data destruction, and full ESG reporting for Malaysian businesses — plus free, instantly-paid pickup for individuals clearing out old devices.',
  ctaPrimary: 'Request Bulk Quote',
  ctaSecondary: 'Recycle & Get Paid',
  urgency:
    'Improperly disposed e-waste is a compliance and data-security risk — not just an environmental one. We close both gaps in one collection.',
  trustItems: [
    'Free doorstep pickup',
    'Instant DuitNow payment',
    'DOE & SW110 compliant',
  ],
};

// ─── Problem ──────────────────────────────────────────────────────────────────
// Stats are capability/process commitments (things Recycling Hub controls and guarantees), not
// market statistics — deliberately avoiding invented industry figures (e.g. national e-waste
// tonnage) that can't be verified. Same caution as TRUST_STRIP.

export const PROBLEM = {
  eyebrow: 'The Risk',
  headline: 'Where Do Your Old Electronics Actually End Up?',
  stats: [
    { value: 'DOE', label: 'Licensed Collection & Disposal' },
    { value: '0', label: 'Devices Sent to Landfill' },
    { value: '100%', label: 'Certified Data Destruction' },
  ],
  body: "Scrap dealers, storage rooms, and the regular bin keep old electronics out of sight — but none of them wipe your data, document where the device went, or keep it out of a landfill. For a business, that's a compliance and data-security gap. For anyone, it's a device that's still recoverable sitting with someone who has no obligation to destroy it properly. Recycling Hub replaces that uncertainty with a licensed, documented, certificate-backed collection.",
  warning:
    'E-waste volumes in Malaysia are growing every year, and regulatory and ESG expectations around proper disposal are tightening with them. Getting a compliant process in place now costs less than explaining an uncontrolled one later.',
};

// ─── How It Works ─────────────────────────────────────────────────────────────
// Kept to 3 steps deliberately — this is the consumer/individual pickup flow, mirroring the
// simple "book → collect → paid" pattern used by again.eco and erth.app. The deeper enterprise
// process lives in B2B_SECTION instead, since bundling both here would bury the simple path.

export const HOW_IT_WORKS = {
  eyebrow: 'The Process',
  headline: 'Recycle in 3 Simple Steps',
  steps: [
    {
      number: '01',
      title: 'Book a Pickup',
      description:
        'Schedule a free collection online or over WhatsApp — takes under a minute.',
    },
    {
      number: '02',
      title: 'We Collect',
      description:
        // TODO: confirm minimum device count/value (if any) and actual service coverage area
        'Our team retrieves your devices at your doorstep, free of charge.',
    },
    {
      number: '03',
      title: 'Get Paid',
      description:
        'Receive instant DuitNow payment the moment your devices are collected.',
    },
  ],
};

// ─── About ────────────────────────────────────────────────────────────────────
// Headline names the team size (three engineers) — human and honest for a startup.
// Body copy names the specific cities (Alor Setar, Petaling Jaya) — local credibility matters to Malaysian SMEs.
// Team bios rewritten to emphasise Recycling Hub-specific roles, not just academic credentials.

export const ABOUT = {
  eyebrow: 'Who We Are',
  headline:
    'Three Engineers Building the Integration Agency Malaysian Businesses Actually Need.',
  body: 'Recycling Hub is a software agency based in Malaysia — Alor Setar and Petaling Jaya. We are engineers who saw the confusion around the MyInvois mandate and built the service we always wished existed: fixed price, honest timelines, full source code handover, and no disappearing act after go-live.',
  team: [
    {
      name: 'Kedir Jabir',
      role: 'Co-Founder · Software Engineer',
      tagline: 'Backend Engineer · LHDN API Integration',
      bio: 'Based in Alor Setar, Kedah. ALX Software Engineering graduate with hands-on experience in production web systems. Leads backend architecture and LHDN MyInvois API integration at Recycling Hub.',
      linkedin: 'https://www.linkedin.com/in/ibnu-jabir/',
      initials: 'IJ',
    },
    {
      name: 'Adnan Madi',
      role: 'Co-Founder · Frontend Developer',
      tagline: 'Frontend Engineer · MSc candidate at Universiti Malaya',
      bio: 'Software engineer specialising in web systems and UI engineering. Based in Petaling Jaya, Selangor. Leads product and frontend development at Recycling Hub.',
      linkedin: 'https://www.linkedin.com/in/adnan-madi417/',
      initials: 'AM',
    },
    {
      name: 'Abderrahmane Bouzemlal',
      role: 'Co-Founder · Software Engineering',
      tagline: 'Backend Engineer · Django & REST APIs',
      bio: 'Based in Alor Setar, Kedah. Specialises in backend web applications using Django and REST APIs. Leads data integration and pipeline engineering at Recycling Hub.',
      linkedin: 'https://www.linkedin.com/in/abderrahmanebouzemlal/',
      initials: 'AB',
    },
  ],
};

// Mission: quote rewritten to name the actual problem that existed before Recycling Hub — makes it
// specific and believable. Body reframes the offer in terms of what the reader escapes from.

export const ABOUT_MISSION = {
  eyebrow: 'Our Mission',
  quote:
    'We built Recycling Hub because when the MyInvois mandate landed, Malaysian SMEs had three options: pay an expensive ERP vendor, wade through cryptic LHDN documentation, or submit manually and hope for the best. None of those is good enough.',
  body: 'The e-invoice mandate is real, the fines are real, and the technical gap between your existing accounting software and LHDN MyInvois is real. We close that gap — in 7 to 14 days, at a fixed price, with full source code handover. No month-long vendor negotiations. No vague project scopes. No lock-in.',
};

// Values: descriptions sharpened to be concrete and specific — "we never cut corners" is generic,
// naming the 55 mandatory fields makes the same claim credible.

export const ABOUT_VALUES = [
  {
    title: 'Compliance-First',
    description:
      'Every integration we ship is fully validated against the LHDN MyInvois sandbox before a single live invoice is submitted. We do not cut corners on the 55 mandatory fields.',
    icon: 'shield',
  },
  {
    title: 'Local Expertise',
    description:
      'We know Malaysian accounting software, SST treatment, and LHDN API behaviour from the inside. You will not spend time explaining the basics — we already know them.',
    icon: 'map',
  },
  {
    title: 'Simplicity',
    description:
      'Fixed price. Fixed timeline. Source code yours on go-live. We eliminate every form of uncertainty that makes integration projects painful.',
    icon: 'zap',
  },
  {
    title: 'Security',
    description:
      'Your invoice data is transmitted through encrypted API bridges with zero retention on our side. The code lives in your infrastructure — not ours.',
    icon: 'lock',
  },
];

// Timeline: removed fabricated "First Integration Shipped" entry (pre-revenue startup, no paying clients yet).
// Replaced with honest product milestones — architecture built, sandbox validated, SaaS in development.

export const ABOUT_TIMELINE = [
  {
    year: '2024',
    title: 'Recycling Hub Founded',
    description:
      'Three engineers based in Malaysia set out to solve one problem: making the MyInvois mandate achievable for SMEs without massive cost or vendor lock-in.',
  },
  {
    year: '2024',
    title: 'Integration Architecture Built',
    description:
      'Completed the core setup architecture and began full LHDN MyInvois sandbox testing across spreadsheets, common accounting systems, and manual workflows.',
  },
  {
    year: '2025',
    title: 'Phase 4 Sandbox Ready',
    description:
      "All 55 mandatory MyInvois fields validated across all supported accounting systems. Integration suite stress-tested against LHDN's live sandbox environment.",
  },
  {
    year: '2025',
    title: 'Recycling Hub Connect in Development',
    description:
      'Began development of Recycling Hub Connect — our self-serve SaaS platform designed for businesses that want plug-and-play MyInvois compliance without a custom build.',
  },
];

// Who We Work With: headline updated (not "trusted by" for a pre-revenue startup).
// NGO category: removed MyCare, MAPIM, Hulwan, Aqsa Syarif — warm leads, not confirmed clients.

export const ABOUT_WHO_WE_WORK_WITH = {
  eyebrow: 'Who We Work With',
  headline: 'Built for Malaysian Businesses at Every Scale',
  categories: [
    {
      label: 'SMEs',
      description:
        'Small and medium enterprises across retail, trading, services, and manufacturing — navigating the e-invoice mandate and looking for a simple path to compliance.',
    },
    {
      label: 'Accounting Firms',
      description:
        'Firms managing compliance for multiple clients who need a single, reliable integration partner to handle the technical side across their entire portfolio.',
    },
    {
      label: 'NGOs & Non-Profits',
      description:
        'Registered societies, charitable foundations, and religious organisations above RM 1M annual revenue that must comply with the MyInvois mandate like any other entity.',
    },
  ],
  systems: [
    'Spreadsheets',
    'Wave',
    'Manual Bookkeeping',
    'AutoCount / Xero / QuickBooks',
    'Custom ERP',
  ],
};

// ─── Book Demo ────────────────────────────────────────────────────────────────
// Headline reframed from "see it in action" (product-centric) to "get clarity" (benefit-centric).
// Bullets rewritten to be specific deliverables the prospect walks away with — not vague activities.

export const BOOK_DEMO = {
  eyebrow: 'Talk to Us',
  headline:
    'Get a Straight Answer on Your Bulk Collection — Free 15-Minute Call',
  bullets: [
    'We ask about your device types, volume, and site location — no assumptions',
    'You get a clear scope: what gets collected, when, and what documentation you receive',
    'You receive a quote and proposed collection timeline within 24 hours of the call',
    "No obligation, no pressure — if bulk collection isn't the right fit yet, we'll tell you honestly",
  ],
  ctaPrimary: 'Book a Free Call',
  ctaSecondary: 'WhatsApp Us Directly',
  trustNote:
    'No commitment required · Quote within 24 hours · Available on Zoom, Google Meet, or WhatsApp',
};

// ─── Trust Strip ──────────────────────────────────────────────────────────────
// Deliberately capability-based, not fabricated social proof — no invented review counts or
// customer totals. TODO: once real numbers exist (Google rating, customer count, DOE reg. no.),
// replace these with actual figures; that's a stronger trust signal than any of the lines below.

export const TRUST_STRIP = {
  label: 'Why Malaysian households and businesses choose Recycling Hub',
  stats: [
    { value: 'DOE', label: 'Registered E-Waste Collector' },
    { value: 'Free', label: 'Doorstep Pickup for Individuals' },
    { value: 'Instant', label: 'DuitNow Payment on Collection' },
    { value: 'SW110', label: 'Compliant Enterprise Collection' },
  ],
};

// ─── Connectors Strip ─────────────────────────────────────────────────────────

export const CONNECTORS = {
  eyebrow: 'Built for the Tools You Already Use',
  items: [
    { name: 'Spreadsheets' },
    { name: 'Wave' },
    { name: 'Manual Bookkeeping' },
    { name: 'No System at All' },
  ],
  fallback: 'Already on AutoCount, Xero, or QuickBooks?',
  fallbackCta: {
    label: "Those usually cover this already — ask us if you're unsure",
    href: '/contact',
  },
};

// ─── Delivery Models ──────────────────────────────────────────────────────────
// Dual-track split (individual vs. business), matching the again.eco / erth.app homepage pattern.
// Business card is `highlight: true` since B2B is the primary strategic focus — visually it should
// read as the more prominent offer, not an equal-weight alternative to the consumer path.

export const DELIVERY_MODELS = {
  eyebrow: 'How to Recycle With Us',
  headline: 'Two Paths. One Compliant Recycling Partner.',
  models: [
    {
      badge: 'For Individuals',
      name: 'Recycle & Get Paid',
      price: 'Free',
      period: 'pickup + instant payout',
      description:
        'Clearing out old phones, laptops, or gadgets? Book a free doorstep pickup and get paid instantly via DuitNow — no minimums, no paperwork.',
      features: [
        'Free doorstep pickup',
        'Instant DuitNow payment',
        'All personal devices accepted',
        'No account or contract needed',
      ],
      cta: 'Recycle & Get Paid',
      ctaHref: '/contact',
      highlight: false,
    },
    {
      badge: 'For Businesses',
      name: 'Compliant Bulk Collection',
      price: 'Custom Quote',
      period: 'based on volume',
      description:
        'DOE- and SW110-compliant collection for offices, warehouses, and factories — with certified data destruction and ESG-ready reporting your compliance team can rely on.',
      features: [
        'DOE/SW110-compliant bulk collection',
        'Certified data destruction with serialized certificates',
        'ESG & sustainability reporting included',
        'Scheduled around your operations',
      ],
      cta: 'Request Bulk Quote',
      ctaHref: '/contact',
      highlight: true,
    },
  ],
};

// ─── B2B Section ──────────────────────────────────────────────────────────────
// Deliberately centered on compliance risk reduction, certified destruction, and ESG reporting
// value — not price or convenience — per instruction that B2B messaging should sell risk
// reduction, not cost. `note` intentionally describes who this is FOR (an ICP statement), not a
// social-proof claim — do not swap in named clients/industries unless they're real.

export const B2B_SECTION = {
  eyebrow: 'For Businesses',
  headline: 'Turn E-Waste Into Verified Compliance, Not Audit Risk.',
  subheadline:
    "Improperly disposed electronics create data-breach exposure and compliance gaps your board doesn't want to explain. Recycling Hub closes that gap with licensed collection, certificate-backed destruction, and reporting your sustainability team can drop straight into an ESG disclosure.",
  pillars: [
    {
      title: 'Compliant Bulk Collection',
      description:
        'SW110-licensed logistics for offices, warehouses, and factories, scheduled around your operations — not ours.',
      icon: 'truck',
    },
    {
      title: 'Certified Data Destruction',
      description:
        'On-site or facility shredding with a serialized certificate of destruction for every asset, satisfying PDPA and internal audit requirements.',
      icon: 'shield',
    },
    {
      title: 'ESG & Sustainability Reporting',
      description:
        'Tonnage recycled, landfill diverted, and estimated carbon impact — delivered in a format your sustainability team can cite directly.',
      icon: 'chart',
    },
  ],
  cta: 'Request Bulk Quote',
  ctaHref: '/contact',
  note: 'Built for finance, procurement, and sustainability teams that need paperwork they can hand straight to an auditor.',
};

// ─── Final CTA ────────────────────────────────────────────────────────────────
// Headline rewritten to name the deadline, the setup time, and the logical conclusion —
// this creates urgency with arithmetic, not empty pressure.

export const FINAL_CTA = {
  eyebrow: 'Ready When You Are',
  headline: 'Keep Your Tools. Let Us Handle MyInvois.',
  subtext:
    "Guided setup, fixed price, and full support — with plenty of runway before your organization's compliance deadline arrives. Book a free discovery call and get your proposal within 24 hours.",
  cta: 'Book a Free Discovery Call',
  ctaHref: '/contact',
  note: 'No commitment required · Fixed-price proposal within 24 hours · Setup handled end-to-end',
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
// Answers rewritten to be direct and conversion-focused — each one removes a specific objection
// or de-risks the next step. The sandbox pass rate guarantee (fix at no cost if it's our fault)
// is added to Q8 — a meaningful commitment that competitors won't make.

export const FAQ = {
  headline: 'Frequently Asked',
  headlineAccent: 'Questions',
  items: [
    {
      question: 'Is there a minimum number of devices for a free pickup?',
      answer:
        "No — whether it's a single old phone or a drawer full of devices, individual pickup is free and comes with instant DuitNow payment. There's no account or contract required.",
    },
    {
      question: 'What happens to my data before a device is recycled?',
      answer:
        "Any data-bearing device — phones, laptops, hard drives, servers — goes through certified destruction before it's recycled. For individuals, that's included in every pickup. For businesses, you receive a serialized certificate of destruction per asset, so you have proof it happened.",
    },
    {
      question: 'How do I get paid for my old devices?',
      answer:
        'Individual pickups are paid instantly via DuitNow, at the moment your devices are collected — no waiting period, no manual payout request. Bulk and enterprise collection is quote-based rather than paid, since the focus there is compliant disposal and documentation.',
    },
    {
      question:
        "What's the difference between individual and business collection?",
      answer:
        "Individual pickup is for households clearing out personal devices — it's free, with instant payment, no minimums. Business or bulk collection is for offices, warehouses, and factories, and is scheduled around your operations with a custom quote based on volume and device types. Both are collected under the same DOE-registered, SW110-compliant process.",
    },
    {
      question:
        'What documentation do we get for compliance or audit purposes?',
      answer:
        'Business and bulk collections come with full chain-of-custody records, a serialized certificate of destruction for every data-bearing asset, and an ESG-ready diversion report covering tonnage recycled and landfill diverted — all retrievable on request.',
    },
    {
      question: 'Is Recycling Hub actually licensed to handle e-waste?',
      answer:
        'Yes — collection and processing is carried out under a registered DOE license and SW110 scheduled-waste compliance, not an informal or unlicensed setup.',
    },
    {
      question: 'What devices do you accept?',
      answer:
        "Phones, tablets, laptops, desktops, monitors, and office IT equipment like servers, printers, and routers, plus hard drives, SSDs, and other storage devices. Get in touch if you're unsure whether a specific item — especially large appliances — is covered.",
    },
    {
      question: 'Do you charge for bulk or enterprise collection?',
      answer:
        "Individual pickup is always free. Bulk and enterprise collection is quoted based on volume and device types — request a quote and we'll confirm pricing before anything is scheduled.",
    },
  ],
};

// ─── Pricing Page ─────────────────────────────────────────────────────────────
// Taglines rewritten to describe the specific customer situation, not the product feature —
// a reader should see their own circumstance in one sentence and stop scrolling.

export const PRICING_TIERS = [
  {
    name: 'Starter',
    tagline:
      'You issue fewer than 500 invoices a month and need reliable MyInvois submission without the complexity.',
    monthlyPrice: 'RM 150',
    annualPrice: 'RM 125',
    annualNote: 'billed RM 1,500/year',
    cta: 'Join the Waitlist',
    highlight: false,
    enterprise: false,
    features: [
      { label: '500 invoices/month', included: true },
      { label: '1 connected setup', included: true },
      { label: 'Real-time MyInvois submission', included: true },
      { label: 'Basic dashboard', included: true },
      { label: 'Email support', included: true },
      { label: 'Multi-user access', included: false },
      { label: 'Priority support', included: false },
      { label: 'Custom ERP integration', included: false },
      { label: 'Dedicated account manager', included: false },
    ],
  },
  {
    name: 'Growth',
    tagline:
      'Your invoice volume is growing and you cannot afford missed submissions or manual workarounds.',
    monthlyPrice: 'RM 350',
    annualPrice: 'RM 290',
    annualNote: 'billed RM 3,480/year',
    cta: 'Join the Waitlist',
    highlight: true,
    enterprise: false,
    features: [
      { label: '3,000 invoices/month', included: true },
      { label: 'Up to 3 connected setups', included: true },
      { label: 'Real-time MyInvois submission', included: true },
      { label: 'Full dashboard & audit logs', included: true },
      { label: 'Priority email & chat support', included: true },
      { label: 'Multi-user access (5 seats)', included: true },
      { label: 'Priority support', included: false },
      { label: 'Custom ERP integration', included: false },
      { label: 'Dedicated account manager', included: false },
    ],
  },
  {
    name: 'Business',
    tagline:
      'You run multiple locations, systems, or entities — and need everything compliant under one roof.',
    monthlyPrice: 'RM 700',
    annualPrice: 'RM 580',
    annualNote: 'billed RM 6,960/year',
    cta: 'Join the Waitlist',
    highlight: false,
    enterprise: false,
    features: [
      { label: 'Unlimited invoices', included: true },
      { label: 'Unlimited connected setups', included: true },
      { label: 'Real-time MyInvois submission', included: true },
      { label: 'Full dashboard & audit logs', included: true },
      { label: 'Priority email & chat support', included: true },
      { label: 'Multi-user access (20 seats)', included: true },
      { label: 'Priority support', included: true },
      { label: 'Custom ERP integration', included: true },
      { label: 'Dedicated account manager', included: false },
    ],
  },
  {
    name: 'Enterprise',
    tagline:
      'Your compliance needs are large-scale, multi-entity, or require commercial SLAs we build around you.',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    annualNote: 'tailored to your needs',
    cta: 'Talk to Sales',
    highlight: false,
    enterprise: true,
    features: [
      { label: 'Unlimited invoices', included: true },
      { label: 'Unlimited connected setups', included: true },
      { label: 'Real-time MyInvois submission', included: true },
      { label: 'Full dashboard & audit logs', included: true },
      { label: 'Priority email & chat support', included: true },
      { label: 'Unlimited seats', included: true },
      { label: 'Priority support', included: true },
      { label: 'Custom ERP integration', included: true },
      { label: 'Dedicated account manager', included: true },
    ],
  },
];

// Add-on descriptions made more concrete — "dedicated engineer" and "founding member SLA"
// are more trustworthy than vague service labels.

export const PRICING_ADDONS = [
  {
    title: 'Extra Integration',
    description:
      'Connect one additional accounting system or data source to MyInvois, outside your plan allocation.',
    price: 'From RM 80/month',
  },
  {
    title: 'Priority Onboarding',
    description:
      'A dedicated Recycling Hub engineer handles your full setup and gets you live within 3 working days of signing.',
    price: 'RM 500 one-time',
  },
  {
    title: 'Custom Training',
    description:
      'A live walkthrough for your finance team covering the full MyInvois submission workflow — remote or on-site in KL.',
    price: 'RM 300 per session',
  },
  {
    title: 'Extended Support',
    description:
      'Phone and WhatsApp support with a guaranteed 2-hour response window, backed by a formal SLA.',
    price: 'RM 200/month',
  },
];

// Pricing FAQ answers made more direct — the free trial answer turns the absence of a trial
// into a credibility move ("a better safety net than a limited-feature trial").

export const PRICING_FAQ = [
  {
    question: 'Is there a setup fee?',
    answer:
      'No. Every plan includes onboarding at no extra cost. You pay the subscription price only — we handle the connection and get you live within 7 working days.',
  },
  {
    question: 'Can I upgrade or downgrade anytime?',
    answer:
      'Yes. Upgrades take effect immediately. Downgrades apply from the start of your next billing cycle. No penalties, no long-term contracts.',
  },
  {
    question: 'What happens if I exceed my invoice limit?',
    answer:
      'On Starter and Growth plans, invoices above your monthly limit are billed at RM 0.08 each. We send an alert when you reach 80% of your limit — no surprise charges.',
  },
  {
    question: 'Do you offer annual discounts?',
    answer:
      'Yes. Annual billing is equivalent to roughly 2 months free compared to paying monthly. Toggle to annual on the pricing cards above to see the per-month rate.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'No free trial — but the discovery call is free, covers your full technical setup, and results in a fixed-price proposal before you pay anything. That is a better safety net than a limited-feature trial.',
  },
  {
    question: 'Which accounting systems are supported on each plan?',
    answer:
      "Starter connects 1 setup — whether that's a spreadsheet, Wave, or a system like AutoCount, Xero, or QuickBooks. Growth connects up to 3. Business and Enterprise support unlimited systems, including fully custom ERP connections.",
  },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FOOTER = {
  services: [
    { label: 'Recycle & Get Paid', href: '/contact' },
    { label: 'Bulk & Enterprise Collection', href: '/services' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Request a Quote', href: '/contact' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Meet the Team', href: '/about#team' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};
