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
// "Services" is rendered as its own dropdown (ServicesDropdown), not a plain
// link, so it's deliberately left out of this list.

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// ─── Page Heroes ──────────────────────────────────────────────────────────────
// Each hero now speaks directly to the reader's specific concern on that page, not a generic brand statement.

export const PAGE_HEROES = {
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

// ─── Final CTA ────────────────────────────────────────────────────────────────

export const FINAL_CTA = {
  eyebrow: 'Ready When You Are',
  headline: 'Free Pickup for You. Certified Disposal for Your Business.',
  subtext:
    "Whether it's one old phone or a warehouse of retired equipment, Recycling Hub handles the collection, the certificates, and the paperwork. Request a bulk quote or book a free call — either way, you'll have an answer within 24 hours.",
  cta: 'Request Bulk Quote',
  ctaHref: '/contact',
  note: 'No commitment required · Quote within 24 hours · Individual pickup always free',
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

// ─── FAQ Page ─────────────────────────────────────────────────────────────────
// A fuller, categorized version of FAQ for the dedicated /faq page. Reuses the
// same original answers as FAQ where they overlap, plus a few new questions
// covering booking, service area, and certificate requests — no new facts
// invented beyond what's already established elsewhere on the site.

export const FAQ_PAGE = {
  eyebrow: 'FAQ',
  headline: 'Questions, Answered',
  subtext:
    "Everything we're asked most — from booking a free pickup to requesting a certificate for a past collection. Can't find what you need? Reach out and we'll answer directly.",
  categories: [
    {
      name: 'Getting Started',
      items: [
        {
          question: 'What devices do you accept?',
          answer:
            "Phones, tablets, laptops, desktops, monitors, and office IT equipment like servers, printers, and routers, plus hard drives, SSDs, and other storage devices. Get in touch if you're unsure whether a specific item — especially large appliances — is covered.",
        },
        {
          question: 'How do I book a pickup?',
          answer:
            'Book online or over WhatsApp — it takes under a minute. Tell us roughly what you have and where, and we confirm a collection time.',
        },
        {
          question: 'Which areas do you serve?',
          answer:
            "Get in touch via WhatsApp or our contact form with your location and we'll confirm whether it's covered before you book anything.",
        },
        {
          question:
            "What's the difference between individual and business collection?",
          answer:
            "Individual pickup is for households clearing out personal devices — it's free, with instant payment, no minimums. Business or bulk collection is for offices, warehouses, and factories, and is scheduled around your operations with a custom quote based on volume and device types. Both are collected under the same DOE-registered, SW110-compliant process.",
        },
      ],
    },
    {
      name: 'Individual Pickup',
      items: [
        {
          question: 'Is there a minimum number of devices for a free pickup?',
          answer:
            "No — whether it's a single old phone or a drawer full of devices, individual pickup is free and comes with instant DuitNow payment. There's no account or contract required.",
        },
        {
          question: 'How do I get paid for my old devices?',
          answer:
            'Individual pickups are paid instantly via DuitNow, at the moment your devices are collected — no waiting period, no manual payout request.',
        },
      ],
    },
    {
      name: 'Business & Bulk Collection',
      items: [
        {
          question: 'Do you charge for bulk or enterprise collection?',
          answer:
            "Individual pickup is always free. Bulk and enterprise collection is quoted based on volume and device types — request a quote and we'll confirm pricing before anything is scheduled.",
        },
        {
          question:
            'What documentation do we get for compliance or audit purposes?',
          answer:
            'Business and bulk collections come with full chain-of-custody records, a serialized certificate of destruction for every data-bearing asset, and an ESG-ready diversion report covering tonnage recycled and landfill diverted — all retrievable on request.',
        },
      ],
    },
    {
      name: 'Data, Certificates & Compliance',
      items: [
        {
          question: 'What happens to my data before a device is recycled?',
          answer:
            "Any data-bearing device — phones, laptops, hard drives, servers — goes through certified destruction before it's recycled. For individuals, that's included in every pickup. For businesses, you receive a serialized certificate of destruction per asset, so you have proof it happened.",
        },
        {
          question: 'Is Recycling Hub actually licensed to handle e-waste?',
          answer:
            'Yes — collection and processing is carried out under a registered DOE license and SW110 scheduled-waste compliance, not an informal or unlicensed setup.',
        },
        {
          question:
            'How do I request a certificate or check my collection status?',
          answer:
            "Use our Track & Trace / Certificate Request page — submit your booking reference if you have one, or just describe the collection, and we'll email you what you need.",
        },
      ],
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

export const SERVICES_HERO = {
  eyebrow: 'What We Do',
  headline: 'Every Stage of the E-Waste Lifecycle,',
  headlineAccent: 'Handled Under One License.',
  description:
    'From the moment a device leaves your hands to the certificate that proves it was destroyed and recycled responsibly, Recycling Hub manages collection, certified destruction, material recovery, and compliance reporting — end to end.',
};

// TODO: replace with the actual DOE (JAS) registration number once issued —
// do not ship a fabricated one.
export const SERVICES_TRUST_BAR = [
  'DOE-Registered E-Waste Collector',
  `${BRAND.legalName} · ${BRAND.ssm}`,
  'Certified Data Destruction on Every Collection',
];

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

// Each entry follows one template: description, "what's included" bullets, and a
// compliance/trust callout. Bullets are kept concrete — device categories, named
// documents, specific mechanisms — rather than vague marketing language. Anywhere
// a real figure, code, or turnaround time is still needed, it's flagged inline
// below rather than invented.
export const SERVICE_DETAILS: Record<
  ServiceSlug,
  {
    description: string;
    included: string[];
    trust: { title: string; description: string };
    visual?: 'certificate' | 'photos';
  }
> = {
  'collection-pickup': {
    description:
      'Recycling Hub collects end-of-life phones, laptops, tablets, monitors, and small IT peripherals directly from your home or office. Every pickup is scheduled in advance and confirmed before our team arrives, so collection happens on your terms, not as an unannounced drop-in.',
    included: [
      'Doorstep collection for individual and household electronics — no minimum device count',
      'Accepted categories: phones & tablets, laptops & computers, monitors & displays, and small office IT peripherals',
      // TODO: publish the exact list of serviced states/cities once the service area is finalized
      'Service area confirmed by address before your booking is finalized',
      'Standard pickup is sized for individual and household quantities — higher-volume collection is handled under Bulk & Industrial Collection instead',
      'Instant DuitNow payment for eligible personal devices at the point of collection',
    ],
    trust: {
      title: 'DOE-Registered Collection',
      description:
        'Every pickup — individual or bulk — is carried out under our registered DOE e-waste collector status, not an informal collection round.',
    },
    visual: 'photos',
  },
  'bulk-industrial-collection': {
    description:
      'For offices, warehouses, and factories generating e-waste on an ongoing basis, Recycling Hub runs scheduled, recurring collection rather than one-off pickups. Logistics are built around your operating hours and volume, not the other way around.',
    included: [
      // TODO: confirm the actual cadence/volume tiers offered (e.g. monthly vs. quarterly minimums)
      'Recurring collection scheduled on a cadence that matches your volume',
      'Dedicated logistics for multi-unit collections — a single site or multiple branches/warehouses under one engagement',
      'Volume-based quoting by device type and count, confirmed before any collection is scheduled',
      'Same certified data destruction and compliance documentation as every other collection tier',
      'Distinct from individual pickup — built for recurring, scheduled volume rather than a one-off drawer of devices',
    ],
    trust: {
      title: 'SW110 Scheduled Waste Compliance',
      description:
        "Bulk and industrial collection is carried out under SW110 scheduled-waste classification, under Malaysia's Environmental Quality Act 1974 and its subsidiary regulations.",
      // TODO: confirm whether additional SW sub-codes apply to specific material
      // streams collected (e.g. batteries, CRT glass) before publishing.
    },
  },
  'certified-data-destruction': {
    description:
      'Any data-bearing device we collect — phones, laptops, hard drives, servers — goes through certified destruction before it is recycled. We do not resell or refurbish devices that still hold your data, and every destruction event is logged and certified.',
    included: [
      // TODO: confirm exact destruction method(s) and standard referenced
      // (e.g. physical shredding, degaussing, NIST 800-88) before publishing
      'Physical destruction of storage media, not a reversible software wipe',
      'Serialized certificate of destruction issued per asset or per batch',
      'Chain-of-custody tracking from collection to destruction, so no device sits unaccounted for in between',
      'Available as a standalone request for a specific device or batch, or bundled into any collection',
      'Certificates retrievable on request via Track & Trace',
    ],
    trust: {
      title: 'Certificate of Destruction',
      description:
        'Every certificate is serialized and tied to the specific assets destroyed — not a generic batch statement.',
      // TODO: attach a redacted sample certificate image once the template is finalized
    },
    visual: 'certificate',
  },
  'esg-reporting': {
    description:
      'Businesses collecting under Recycling Hub receive a diversion report summarizing what was collected and what happened to it — formatted so your sustainability or compliance team can use it directly in ESG disclosures, without reformatting.',
    included: [
      'Total weight collected and recycled, by device category',
      // TODO: confirm the exact recovery-rate methodology/data source before
      // publishing specific recovery percentages
      'Materials-recovered vs. landfill-diverted breakdown',
      // TODO: confirm the carbon-estimation methodology/emission factors used
      'Estimated carbon impact of the collection',
      'Delivered per collection, or aggregated over a reporting period (e.g. quarterly, annually) on request',
      'Formatted for direct use in ESG audits and sustainability disclosures',
    ],
    trust: {
      title: 'ESG-Ready Reporting',
      description:
        'Every bulk and enterprise collection is eligible for a diversion report — request one with your next quote.',
    },
  },
  'material-recovery': {
    description:
      "Once collected, e-waste is processed through licensed downstream partners who recover reusable materials — metals, plastics, and components — and ensure anything unrecoverable is disposed of in compliance with Malaysia's scheduled-waste regulations, not sent to landfill.",
    included: [
      'Sorting and dismantling of collected devices by material stream',
      // TODO: name the actual licensed downstream processing partner(s) once
      // confirmed for public disclosure
      'Recoverable materials — metals, plastics, glass, circuit-board components — routed to licensed processors',
      'Non-recoverable residual waste disposed of under SW110 scheduled-waste compliance, never landfilled untreated',
      'No unlicensed scrap dealers or informal recyclers in the chain at any stage',
      'Processing outcomes reflected in your ESG diversion report if you’re a business client',
    ],
    trust: {
      title: 'Licensed Downstream Processing',
      description:
        'Material recovery is carried out only through licensed processors — never informal or unregistered scrap channels.',
      // TODO: reference the specific processor license/registration number
      // once confirmed for disclosure
    },
  },
  'compliance-documentation': {
    description:
      'Every collection — individual or business — generates a paper trail. For businesses, that means consignment notes and DOE-compliant documentation you can hand straight to an auditor, without having to chase us for records afterward.',
    included: [
      // TODO: confirm the consignment note numbering/format convention used
      'Consignment note issued for every scheduled waste collection',
      'DOE-compliant collection and disposal paperwork retained for your records',
      'Certificate of destruction included for any data-bearing assets in the collection',
      // TODO: confirm the actual standard delivery turnaround (e.g. within N business days)
      'Documentation delivered at the time of collection or shortly after',
      'Past documentation retrievable anytime via Track & Trace',
    ],
    trust: {
      title: 'Audit-Ready Paperwork',
      description:
        'Documentation is issued per collection, not batched at year-end, so your records stay current throughout the year.',
    },
  },
};

// ─── Request a Quote ──────────────────────────────────────────────────────────
// Shared quote-request form linked to from every service sub-page's CTA.

export const REQUEST_QUOTE_PAGE = {
  eyebrow: 'Get a Quote',
  headline: 'Request a',
  headlineAccent: 'Quote.',
  description:
    'Tell us what you need collected and we’ll confirm pricing and a collection window — usually within 24 hours.',
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

export const SOLUTIONS_HERO = {
  eyebrow: 'Who We Serve',
  headline: 'Tailored E-Waste Solutions,',
  headlineAccent: 'Sector by Sector.',
  description:
    'From a single household clearing out old devices to an enterprise retiring a data center, Recycling Hub adapts the same DOE-registered, certified process to what each sector actually needs.',
};

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

// Each entry follows one template: a framing paragraph naming that segment's
// actual pain point, "why us" bullets connecting existing services to that
// pain point, and a segment-specific CTA. Framing and bullets are written per
// segment, not templated with the name swapped in. Testimonial/case-study
// placeholders are flagged, not invented — no fabricated quotes or client names.
export const SOLUTION_DETAILS: Record<
  SolutionSlug,
  {
    framing: string;
    whyUs: string[];
    cta: { label: string; href: string };
    testimonialNote: string;
  }
> = {
  'corporate-enterprise': {
    framing:
      'Corporate offices, IT departments, and manufacturing facilities generate e-waste on an ongoing basis — and every device that leaves without proper documentation is a compliance and data-security question your board will eventually ask. Recycling Hub replaces that uncertainty with scheduled bulk collection, certified destruction, and audit-ready reporting built into every pickup.',
    whyUs: [
      'Recurring bulk collection scheduled around your operations, not ours',
      'Certified data destruction with a serialized certificate for every data-bearing asset retired',
      'ESG diversion reports formatted for direct use in sustainability disclosures and audits',
      'Compliance documentation — consignment notes, DOE-compliant paperwork — issued per collection, not batched at year-end',
    ],
    cta: {
      label: 'Request a Bulk Quote',
      href: '/request-quote?service=bulk-industrial-collection',
    },
    testimonialNote:
      'Corporate case study/testimonial — to be added once a client reference is available. Do not publish without real client sign-off.',
  },
  'individuals-households': {
    framing:
      "Clearing out an old phone, laptop, or a drawer full of dead chargers shouldn't take more effort than throwing it in the bin — but the bin isn't where it should go. Recycling Hub picks up your old electronics for free, wherever you are, and pays you instantly the moment they're collected.",
    whyUs: [
      'Free doorstep pickup — no minimum device count, no account or contract needed',
      'Instant DuitNow payment the moment your devices are collected',
      'All personal devices accepted — phones, laptops, tablets, monitors, and more',
      'Certified data destruction included on every data-bearing device, with no extra step for you',
    ],
    cta: {
      label: 'Book a Pickup',
      href: BRAND.whatsapp,
    },
    testimonialNote:
      'Household testimonial — to be added once real customer feedback is available. Do not publish an invented quote.',
  },
  'government-glc': {
    framing:
      'Public sector agencies and government-linked companies need a vendor who can withstand procurement scrutiny — full regulatory compliance, transparent documentation, and a paper trail that holds up in a tender review, not just a collection receipt.',
    whyUs: [
      'DOE-registered collection and SW110 scheduled-waste compliance, ready for procurement due diligence',
      'Transparent, per-collection documentation — consignment notes and compliance paperwork, not summarized after the fact',
      'Certified data destruction with chain-of-custody tracking, for agencies handling sensitive records',
      // TODO: confirm whether we formally support tender/RFP submissions and
      // standard government payment terms before publishing this claim
      'Bulk collection scheduled to fit standard procurement and budgeting cycles',
    ],
    cta: {
      label: 'Request Vendor Information',
      href: '/contact',
    },
    testimonialNote:
      'Government/GLC case study or reference — to be added once available and cleared for public disclosure.',
  },
  education: {
    framing:
      'Computer lab upgrades and campus-wide equipment turnover generate e-waste in batches, not one device at a time — and retired student and staff devices often still hold personal data a school has a duty to protect. Recycling Hub handles both the volume and the data.',
    whyUs: [
      // TODO: confirm scheduling flexibility around semester breaks/academic
      // calendars before publishing this as a standing commitment
      'Bulk collection that can be scheduled around semester breaks and refresh cycles',
      'Certified data destruction on every retired device, protecting student and staff data before resale or recycling',
      'Documentation covering the full batch collected, useful for asset write-off and inventory records',
      'Same DOE-registered, SW110-compliant process used for any other bulk collection',
    ],
    cta: {
      label: 'Request a Campus Collection Quote',
      href: '/request-quote?service=bulk-industrial-collection',
    },
    testimonialNote:
      'School/university case study or testimonial — to be added once a client reference is available.',
  },
  healthcare: {
    framing:
      "Retired hospital and clinic IT equipment — workstations, servers, imaging systems, storage drives — can carry patient data long after it's taken out of service. Recycling Hub treats every healthcare collection as a chain-of-custody event, not just a pickup.",
    whyUs: [
      'Certified data destruction for any device that may have held patient or clinical records',
      // TODO: confirm any healthcare-specific data regulation (e.g. Ministry of
      // Health guidelines) we explicitly comply with before publishing
      'Documented chain-of-custody from collection through destruction, for internal audit and compliance review',
      'Collection scheduled around facility operating hours, not a walk-in pickup',
      'Serialized certificate of destruction issued per asset, not a generic batch statement',
    ],
    cta: {
      label: 'Request a Healthcare Solutions Quote',
      href: '/request-quote?service=certified-data-destruction',
    },
    testimonialNote:
      'Healthcare facility case study or testimonial — to be added once a client reference is available and cleared for disclosure.',
  },
  ngo: {
    framing:
      "Nonprofits and community groups don't always generate e-waste on a predictable schedule or in bulk quantities — and budget is almost always a real constraint. Recycling Hub scales down to fit, without treating a smaller organization as a lower priority.",
    whyUs: [
      'Flexible collection sized to lower, irregular volumes — no bulk minimum required',
      // TODO: confirm the actual partnership/CSR discount structure (if any)
      // before publishing a specific pricing claim
      'Partnership-rate pricing available for registered nonprofits — ask when you get in touch',
      'Certified data destruction and compliance documentation included, same as any other collection',
      'ESG diversion reporting available on request, for donor or grant reporting',
    ],
    cta: {
      label: 'Contact Us About Partnership Rates',
      href: '/contact',
    },
    testimonialNote:
      'Nonprofit partner case study or testimonial — to be added once available and cleared for public use.',
  },
};
