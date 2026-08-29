// ─── Assets ───────────────────────────────────────────────────────────────────

export const ASSETS = {
  logo: {
    whiteLogo: '/assets/img/brand/logo/white-logo.png',
    whiteIconBg: '/assets/img/brand/logo/white-icon-bg.png',
    whiteLogoBg: '/assets/img/brand/logo/white-logo-bg.png',
    combinedWhite:
      '/assets/img/brand/logo/combined-logo/combined-logo-white.png',
    symbolWhite: '/assets/img/brand/logo/symbol/symbol-white.png',
    combinedColor:
      '/assets/img/brand/logo/combined-logo/combined-logo-color.png',
    symbolColor: '/assets/img/brand/logo/symbol/symbol-color.png',
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
  legalName: 'Recycling Hub Sdn. Bhd.',
  tagline: 'Certified E-Waste Collection & Disposal for Malaysia.',
  email: 'contact@recyclinghub.eco',
  phone: '+60 11-2850 3845',
  website: 'recyclinghub.eco',
  whatsapp:
    'https://wa.me/601128503845?text=Hi%20Recycling%20Hub%2C%20I%27m%20interested%20in%20your%20e-waste%20collection%20service.%20Could%20you%20please%20share%20more%20details%3F%20Thank%20you.',
  businessHours: 'Mon–Fri 9am–6pm · Sat 9am–1pm (MYT)',
  social: {
    linkedin: 'https://linkedin.com/company/recyclinghub',
    instagram: 'https://www.instagram.com/recyclinghub?utm_source=qr',
    facebook: 'https://www.facebook.com/share/1BoN37mHcY/?mibextid=wwXIfr',
  },
};

// ─── Page Heroes ──────────────────────────────────────────────────────────────
// Each hero now speaks directly to the reader's specific concern on that page, not a generic brand statement.

export const PAGE_HEROES = {
  about: {
    eyebrow: 'Who We Are',
    headline: 'Three Founders.',
    headlineAccent: 'One Mandate: Built for Malaysia.',
    description:
      'We are a team based in Klang Valley. We built Recycling Hub because Malaysian households and businesses deserved an e-waste collector that was registered, documented, and honest about what happens to your devices after pickup.',
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
// Body copy names Klang Valley — where the company operates, consistent with the Klang Valley-only pickup service area.
// Team bios rewritten to emphasise Recycling Hub-specific roles, not just academic credentials.

export const ABOUT = {
  eyebrow: 'Who We Are',
  headline:
    'Three Founders Building the E-Waste Collector Malaysia Actually Needs.',
  body: 'Recycling Hub is based in Klang Valley, Malaysia. We saw how much e-waste was ending up with informal scrap dealers, with no registration, no data destruction, and no paper trail, and built the alternative we always wished existed: DOE-registered, fully documented, and honest about what happens to your devices after we collect them.',
  team: [
    {
      name: 'Kedir Jabir',
      role: 'Co-Founder · Software Engineer',
      tagline: 'Backend Engineer · Systems & Operations',
      bio: 'ALX Software Engineering graduate with hands-on experience in production web systems. Leads backend architecture and operational systems at Recycling Hub.',
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
      bio: 'Specialises in backend web applications using Django and REST APIs. Leads data systems and booking infrastructure at Recycling Hub.',
      linkedin: 'https://www.linkedin.com/in/abderrahmanebouzemlal/',
      initials: 'AB',
    },
  ],
};

// Values: grounded in the same claims already established and evidenced under /services and
// /resources (DOE/SW110 status, certified data destruction, free individual pickup) — no new,
// unverifiable claims about the team's expertise or operations introduced here.

export const ABOUT_VALUES = [
  {
    title: 'Compliance-First',
    description:
      'Every collection — individual or bulk — is carried out under our DOE-registered status, with SW110 scheduled-waste compliance for business volumes. We do not run informal collection rounds.',
    icon: 'shield',
  },
  {
    title: 'Built for Malaysia',
    description:
      'We operate under Malaysian e-waste regulation, not a generic global playbook — DOE registration, SW110 classification, and DuitNow payment, built around how collection actually works here.',
    icon: 'map',
  },
  {
    title: 'Simplicity',
    description:
      'Free doorstep pickup for individuals in Klang Valley, no minimums, no paperwork. Transparent quoting for bulk and enterprise collection. We eliminate the uncertainty that makes disposal feel complicated.',
    icon: 'zap',
  },
  {
    title: 'Data Security',
    description:
      'Every data-bearing device goes through certified data destruction — physical, not a reversible software wipe — with a serialized certificate and full chain-of-custody tracking from collection to destruction.',
    icon: 'lock',
  },
];

// Timeline: milestones grounded only in facts already established elsewhere on the site (DOE
// registration, SW110 compliance, the platform itself existing). TODO: confirm exact founding
// year and milestone order against actual company history before treating this as final —
// carried over from the previous (unverified) timeline rather than newly invented here.

export const ABOUT_TIMELINE = [
  {
    year: '2024',
    title: 'Recycling Hub Founded',
    description:
      'Founded to give Malaysian households and businesses a properly registered, documented alternative to informal scrap collection — one that treats device data and compliance paperwork as seriously as the electronics themselves.',
  },
  {
    year: '2024',
    title: 'DOE Registration Secured',
    description:
      'Registered as a DOE e-waste collector, putting every collection — individual or bulk — under regulated, auditable status instead of an informal scrap channel.',
  },
  {
    year: '2025',
    title: 'SW110 Compliance Framework Built',
    description:
      'Built out the scheduled-waste compliance process for bulk and industrial collection — consignment notes, certified data destruction, and documentation ready for audit.',
  },
  {
    year: '2025',
    title: 'Recyclinghub.eco Launched',
    description:
      'Launched the platform for booking free individual pickup in Klang Valley, requesting bulk quotes, and retrieving collection certificates via Track & Trace.',
  },
];

// Who We Work With: categories mirror the market segments already established under /solutions
// (Individuals & Households, Corporate & Enterprise, Government/NGO) rather than inventing new
// customer types. "systems" replaced with accepted device categories — the accounting-software
// list made no sense once this section covers e-waste collection, not e-invoice integration.

export const ABOUT_WHO_WE_WORK_WITH = {
  eyebrow: 'Who We Work With',
  headline: 'Built for Malaysia at Every Scale',
  categories: [
    {
      label: 'Individuals & Households',
      description:
        'Anyone clearing out old phones, laptops, or a drawer of dead electronics in Klang Valley — free doorstep pickup, no minimums, instant DuitNow payment.',
    },
    {
      label: 'Corporate & Enterprise',
      description:
        'Offices, warehouses, and factories generating e-waste on an ongoing basis — recurring SW110-compliant collection, certified data destruction, and ESG reporting.',
    },
    {
      label: 'Government & NGOs',
      description:
        'Public sector agencies, GLCs, and registered non-profits that need procurement-ready compliance and transparent, auditable documentation.',
    },
  ],
  deviceCategories: [
    'Phones & Tablets',
    'Laptops & Computers',
    'Monitors & Displays',
    'Small Office IT Peripherals',
  ],
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
  eyebrow: 'What We Collect',
  items: [
    { name: 'Phones & Tablets' },
    { name: 'Laptops & Computers' },
    { name: 'Monitors & Displays' },
    { name: 'Office & IT Equipment' },
    { name: 'Storage Devices' },
  ],
  fallback: 'Not sure if we take it?',
  fallbackCta: {
    label: "Ask us — we'll confirm",
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
    {
      label: 'Bulk & Enterprise Collection',
      href: '/services/bulk-industrial-collection',
    },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Track & Trace / Certificates', href: '/track-trace' },
    { label: 'Request a Quote', href: '/request-quote' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Meet the Team', href: '/about#team' },
    { label: 'Services', href: '/services' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

// ─── Services Section ─────────────────────────────────────────────────────────
// Purely capability-focused (WHAT Recycling Hub does) — market-segment messaging
// (WHO it's for) belongs in /solutions instead, not here. Six services, each with
// its own sub-page under /services/<slug>, sharing one detail template.

export const SERVICES = [
  {
    slug: 'collection-pickup',
    icon: 'truck',
    title: 'E-Waste Collection & Pickup',
    summary:
      'Scheduled doorstep collection for individual devices and household quantities, free of charge.',
  },
  {
    slug: 'bulk-industrial-collection',
    icon: 'factory',
    title: 'Bulk & Industrial Collection',
    summary:
      'Recurring, volume-based collection for offices, warehouses, and factories — quoted and scheduled around your operations.',
  },
  {
    slug: 'certified-data-destruction',
    icon: 'shield',
    title: 'Certified Data Destruction',
    summary:
      'Physical destruction of data-bearing devices with a serialized certificate and full chain-of-custody tracking.',
  },
  {
    slug: 'esg-reporting',
    icon: 'leaf',
    title: 'ESG & Sustainability Reporting',
    summary:
      'Diversion and impact reporting — tonnage recycled, materials recovered, and estimated carbon impact — for your ESG disclosures.',
  },
  {
    slug: 'material-recovery',
    icon: 'recycle',
    title: 'Recycling & Material Recovery',
    summary:
      'Licensed downstream processing that recovers reusable materials and diverts the rest from landfill.',
  },
  {
    slug: 'compliance-documentation',
    icon: 'file-check',
    title: 'Compliance Documentation',
    summary:
      'Consignment notes and DOE-compliant paperwork issued for every collection, ready for audit.',
  },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]['slug'];

// ─── Resources Section ────────────────────────────────────────────────────────
// Educational guides grounded in facts already established under /services —
// each one expands on a single compliance/process topic (DOE, SW110, data
// destruction, ESG, pickup prep, certificates) rather than introducing new claims.
export const RESOURCES = [
  {
    slug: 'doe-registration-explained',
    icon: 'badge-check',
    title: 'What DOE Registration Means for You',
  },
  {
    slug: 'sw110-compliance-for-businesses',
    icon: 'factory',
    title: 'SW110 Compliance for Businesses',
  },
  {
    slug: 'certified-data-destruction-guide',
    icon: 'lock',
    title: 'How Certified Data Destruction Works',
  },
  {
    slug: 'esg-reporting-for-ewaste',
    icon: 'leaf',
    title: 'ESG & Sustainability Reporting for E-Waste',
  },
  {
    slug: 'preparing-devices-for-pickup',
    icon: 'truck',
    title: 'How to Prepare Your Devices for Pickup',
  },
  {
    slug: 'understanding-your-certificate',
    icon: 'file-check',
    title: 'Understanding Your Recycling Certificate',
  },
] as const;

export type ResourceSlug = (typeof RESOURCES)[number]['slug'];

// Structural-only per service: which trust-callout visual placeholder (if any)
// to render. The translatable copy (description, included bullets, trust
// text, and its TODO-flagged real-data gaps) lives in src/locales/{en,bm}.ts
// instead, keyed by the same slug.
export const SERVICE_DETAILS: Record<
  ServiceSlug,
  { visual?: 'certificate' | 'photos' }
> = {
  'collection-pickup': { visual: 'photos' },
  'bulk-industrial-collection': {},
  'certified-data-destruction': { visual: 'certificate' },
  'esg-reporting': {},
  'material-recovery': {},
  'compliance-documentation': {},
};

// ─── Solutions Section ────────────────────────────────────────────────────────
// Purely market-segment-focused (WHO Recycling Hub serves) — functional/capability
// messaging (WHAT the company does) belongs in /services instead. Six segments,
// each with its own sub-page under /solutions/<slug>, sharing one detail template.
// Corporate & Enterprise and Individuals & Households are the two active primary
// markets — `priority: true` on those drives the visual emphasis on the landing
// grid. The other four are built and live, just not surfaced in the navbar
// dropdown yet (see ServicesDropdown/SolutionsDropdown) until the business is
// ready to actively market to those segments.

export const SOLUTIONS = [
  {
    slug: 'corporate-enterprise',
    icon: 'building',
    title: 'Corporate & Enterprise',
    summary:
      'Recurring bulk collection, certified data destruction, and ESG reporting for offices, corporate IT, and manufacturing facilities.',
    priority: true,
  },
  {
    slug: 'individuals-households',
    icon: 'house',
    title: 'Individuals & Households',
    summary:
      'Free doorstep pickup and instant DuitNow payment for personal electronics — no minimums, no paperwork.',
    priority: true,
  },
  {
    slug: 'government-glc',
    icon: 'landmark',
    title: 'Government & GLC',
    summary:
      'Procurement-ready compliance and transparent documentation for public sector agencies and government-linked companies.',
    priority: false,
  },
  {
    slug: 'education',
    icon: 'graduation-cap',
    title: 'Education',
    summary:
      'Bulk collection for computer lab upgrades and campus-wide IT refresh cycles, with certified destruction of student and staff data.',
    priority: false,
  },
  {
    slug: 'healthcare',
    icon: 'stethoscope',
    title: 'Healthcare',
    summary:
      'Chain-of-custody-tracked collection and certified destruction for retired hospital and clinic IT equipment.',
    priority: false,
  },
  {
    slug: 'ngo',
    icon: 'heart',
    title: 'NGO & Non-Profit',
    summary:
      'Flexible, lower-volume collection at partnership rates for nonprofits and community organizations.',
    priority: false,
  },
] as const;

export type SolutionSlug = (typeof SOLUTIONS)[number]['slug'];

// Structural-only per segment: just the CTA destination. The translatable
// copy (framing, why-us bullets, CTA label, testimonial placeholder, and its
// TODO-flagged real-data gaps) lives in src/locales/{en,bm}.ts instead, keyed
// by the same slug.
export const SOLUTION_DETAILS: Record<SolutionSlug, { cta: { href: string } }> =
  {
    'corporate-enterprise': {
      cta: { href: '/request-quote?service=bulk-industrial-collection' },
    },
    'individuals-households': { cta: { href: BRAND.whatsapp } },
    'government-glc': { cta: { href: '/contact' } },
    education: {
      cta: { href: '/request-quote?service=bulk-industrial-collection' },
    },
    healthcare: {
      cta: { href: '/request-quote?service=certified-data-destruction' },
    },
    ngo: { cta: { href: '/contact' } },
  };
