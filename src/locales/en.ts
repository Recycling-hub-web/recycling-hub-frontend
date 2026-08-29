// English dictionary — canonical source of truth for shape. `bm.ts` is typed
// against `Dictionary` (derived below) so a missing translation key fails to
// compile rather than silently falling back.
//
// Scope (Phase 4 adds Terms/Privacy): navbar/footer chrome, the full
// homepage, Services, Solutions, Contact, FAQ, Track & Trace, Request a
// Quote, and now the legal pages are bilingual. About and Pricing are
// deliberately NOT included yet — those pages still carry pre-rebrand
// invoicing-era copy (see their Meta descriptions) that needs a content fix
// regardless of translation, so translating them now would just double the
// cleanup work later.
//
// TODO: LEGAL REVIEW REQUIRED before the `legal.terms`/`legal.privacy`
// Bahasa Melayu text (src/locales/bm.ts) is relied upon as a binding legal
// document. It was AI-translated, not reviewed by a Malaysian-qualified
// lawyer — the PDPA 2010 / DOE-SW110 references, liability limitation, and
// governing-law clauses especially need verification. The English text
// remains authoritative until that review happens.
//
// Structural/functional fields — hrefs, slugs, icon keys, which testimonial
// visual to show — stay in `constants/content.ts` and are language-independent;
// only the translatable copy lives here, keyed by the same slug so components
// zip the two together at render time.

import {
  BRAND,
  type ResourceSlug,
  type ServiceSlug,
  type SolutionSlug,
} from '../constants/content';
import type { LegalSection } from '../types/legal';

const en = {
  nav: {
    home: 'Home',
    pricing: 'Pricing',
    about: 'About',
    contact: 'Contact',
    whatsapp: 'WhatsApp Us',
    requestQuote: 'Request a Quote',
    services: 'Services',
    solutions: 'Solutions',
    resources: 'Resources',
    viewAllServices: 'View All Services',
    viewAllSolutions: 'View All Solutions',
  },

  footer: {
    tagline: 'Certified E-Waste Collection & Disposal for Malaysia.',
    servicesHeading: 'Services',
    companyHeading: 'Company',
    legalHeading: 'Legal',
    services: [
      { label: 'Recycle & Get Paid', href: '/contact' },
      {
        label: 'Bulk & Enterprise Collection',
        href: '/services/bulk-industrial-collection',
      },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Track & Trace / Certificates', href: '/track-trace' },
      { label: 'Request a Quote', href: '/request-quote' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Meet the Team', href: '/about#team' },
      { label: 'Services', href: '/services' },
      { label: 'Resources', href: '/resources' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    copyrightLine: 'All rights reserved.',
  },

  home: {
    hero: {
      headlinePrefix: 'Registered',
      headlinePill: 'E-Waste',
      headlineSuffix: 'Recycling Services You Can Trust',
      subheadline:
        'Recycling Hub picks up old electronics for free across the Klang Valley — for households clearing out a drawer of devices and for businesses decommissioning a whole office. Every collection is DOE-registered and fully documented.',
      cta: 'Book Pickup',
      // TODO: replace with a real figure once available
      statCardLabel: 'Coming soon',
      statCardValue: 'Real stat',
      // TODO: replace with a real credential, e.g. "SW110 compliant"
      gradientCardLabel: 'Certified disposal',
    },

    trustStrip: {
      label: 'Why Malaysian households and businesses choose Recycling Hub',
      stats: [
        { value: 'DOE', label: 'Registered E-Waste Collector' },
        { value: 'Free', label: 'Doorstep Pickup in Klang Valley' },
        { value: 'Instant', label: 'DuitNow Payment on Collection' },
        { value: 'SW110', label: 'Compliant Enterprise Collection' },
      ],
    },

    problemIllustration: {
      headline: 'Still Piling Up? Or Worse — In the Bin?',
      subtext:
        "Scrap dealers, storage rooms, and the regular bin keep old electronics out of sight — they just don't keep you compliant, or your data safe.",
      cards: [
        {
          label: 'Scrap Dealer',
          avatarText: 'SD',
          invoice: 'Old Company Laptops',
          status: 'No data wipe performed',
        },
        {
          label: 'Storage Room',
          avatarText: 'ST',
          invoice: 'Boxes of Old Devices',
          status: 'Just taking up space',
        },
        {
          label: 'Regular Trash',
          avatarText: '?',
          invoice: 'E-Waste in General Bin',
          status: 'Illegal disposal risk',
        },
      ],
      caption:
        'Same devices. One quiet difference: certified, compliant disposal.',
    },

    problemStrip: {
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
    },

    whyRecyclingHub: {
      eyebrow: 'Why Recycling Hub',
      headline: 'The Compliant Way to Get Rid of Old Electronics',
      subtext:
        "A scrap dealer or a storage room won't wipe your data, document the collection, or keep it out of a landfill. Recycling Hub handles the entire process — licensed, certified, and documented — for individuals and businesses alike.",
      features: [
        {
          icon: 'shield',
          title: 'Licensed Under DOE & SW110 — Every Collection Documented',
          body: 'Recycling Hub collects and processes e-waste under a registered DOE license and SW110 scheduled-waste compliance. Every pickup is logged, tracked, and backed by paperwork you can hand to an auditor.',
        },
        {
          icon: 'plug',
          title: 'One Partner, Whether It’s One Phone or a Whole Office',
          body: "A single old laptop or a full office decommission — Recycling Hub runs the same licensed, documented process either way. You don't need a separate vendor for personal and enterprise volumes.",
        },
        {
          icon: 'lock',
          title: 'Certified Destruction. Zero Data Recovery.',
          body: 'Every device carrying data goes through certified destruction with a serialized certificate. Recycling Hub does not resell or retain your data-bearing devices — destruction is verified, not assumed.',
        },
      ],
    },

    comparison: {
      eyebrow: 'Transformation',
      headline: 'Stop Guessing Where It Ends Up. Start Getting Proof.',
      oldWay: {
        badge: 'The Usual Way',
        headline: 'Unregulated. Untraceable. Risky.',
        subtext: 'How most old electronics get disposed of today.',
        items: [
          'Sold to an unlicensed scrap dealer, no questions asked',
          'Left in a storage room indefinitely, taking up space',
          'Thrown in the regular bin — technically illegal, rarely enforced',
          'No idea whether the data on the device was ever wiped',
          'No paperwork if a regulator or auditor ever asks',
          'No idea where the device physically ended up',
        ],
      },
      recyclingHubWay: {
        badge: 'With Recycling Hub',
        headline: 'Licensed. Documented. Effortless.',
        subtext: 'What you get when Recycling Hub handles it for you.',
        items: [
          'Collected by a DOE-registered, SW110-compliant team',
          'Certified data destruction with a serialized certificate',
          'Full chain-of-custody from pickup to processing',
          'ESG-ready diversion report for your sustainability records',
          'Instant DuitNow payment for individual pickups',
          'A dedicated team that handles bulk collection for you',
        ],
      },
      ctaPrimary: 'Request Bulk Quote',
      ctaSecondary: 'WhatsApp Us',
    },

    featureTabs: {
      headline: 'What Happens After You Book',
      subtext:
        'From the moment you book to the certificate in your inbox — every step is licensed, tracked, and documented.',
      tabs: [
        {
          label: 'Book & Schedule',
          headline:
            'Book a pickup in under a minute — for one device or a hundred.',
          checklist: [
            'Online form or WhatsApp booking',
            'Flexible slots for households and offices',
            'Bulk collection scheduled around your operations',
            'No account or contract required for individuals',
            'Confirmation sent immediately after booking',
          ],
          // TODO: replace with real client quote
          quote:
            'We had forty old laptops sitting in a storeroom for two years. Recycling Hub had them collected within a week of booking.',
          authorInitials: 'OM',
          authorLabel: 'Office Manager',
          authorRole: 'KL trading company',
          mockupLabel: 'Pickup Booking Confirmation',
        },
        {
          label: 'Collect',
          headline: 'Licensed collection, tracked from the moment we arrive.',
          checklist: [
            'DOE-registered, SW110-compliant collection team',
            'Doorstep pickup for individuals in Klang Valley, on-site for businesses',
            'Every collected item logged at pickup',
            'Secure transport to our processing facility',
            'No device left unaccounted for',
          ],
          // TODO: replace with real client quote
          quote:
            'The team logged every single unit before it left our building. We had a full manifest the same day.',
          authorInitials: 'FM',
          authorLabel: 'Facilities Manager',
          authorRole: 'Selangor manufacturer',
          mockupLabel: 'Live Collection Log',
        },
        {
          label: 'Sort & Process',
          headline: 'Every device sorted, assessed, and routed correctly.',
          checklist: [
            'Devices assessed for reuse, refurbishment, or recycling',
            'Components separated by material type',
            'Hazardous components handled to DOE standard',
            'Nothing sent to landfill',
            'Processing facility open to compliance audits',
          ],
          // TODO: replace with real client quote
          quote:
            'We asked what actually happens after pickup, and Recycling Hub walked us through the whole process — nothing was vague.',
          authorInitials: 'PL',
          authorLabel: 'Procurement Lead',
          authorRole: 'KL professional services firm',
          mockupLabel: 'Processing Status Board',
        },
        {
          label: 'Data Destruction',
          headline: 'Every data-bearing device destroyed, not just deleted.',
          checklist: [
            'On-site or facility-based certified shredding',
            'Serialized certificate of destruction per asset',
            'PDPA-compliant handling throughout',
            'No resale of data-bearing devices',
            'Certificates available for audit within days',
          ],
          // TODO: replace with real client quote
          quote:
            'We needed proof our old servers were destroyed, not resold. The certificate covered every serial number.',
          authorInitials: 'ITM',
          authorLabel: 'IT Manager',
          authorRole: 'Financial services firm',
          mockupLabel: 'Certificate of Destruction',
        },
        {
          label: 'Get Paid',
          headline:
            'Individuals get paid the moment their devices are collected.',
          checklist: [
            'Instant DuitNow payment on collection',
            'No waiting period or manual payout request',
            'Payment confirmed before our team leaves',
            'No hidden deductions',
            'Works for one device or a full clear-out',
          ],
          // TODO: replace with real client quote
          quote:
            'I had a drawer full of old phones. Payment landed in DuitNow before the pickup team even left.',
          authorInitials: 'HS',
          authorLabel: 'Household Seller',
          authorRole: 'Petaling Jaya',
          mockupLabel: 'DuitNow Payment Confirmation',
        },
        {
          label: 'Compliance Docs',
          headline:
            'Every collection backed by paperwork your auditor will accept.',
          checklist: [
            'DOE and SW110 documentation per collection',
            'Full chain-of-custody records',
            'Certificates stored and retrievable on request',
            'Ready for internal or third-party audit',
            'No manual record-keeping needed on your end',
          ],
          // TODO: replace with real client quote
          quote:
            'When our auditors asked for e-waste disposal records, we had the full documentation within the hour.',
          authorInitials: 'CO',
          authorLabel: 'Compliance Officer',
          authorRole: 'Klang Valley manufacturer',
          mockupLabel: 'Compliance Documentation Pack',
        },
        {
          label: 'ESG Reporting',
          headline:
            'Diversion reports your sustainability team can actually use.',
          checklist: [
            'Tonnage recycled per collection',
            'Landfill diversion summary',
            'Estimated carbon impact',
            'Delivered in a format ready for ESG disclosures',
            'Available on a per-collection or annual basis',
          ],
          // TODO: replace with real client quote
          quote:
            'The diversion report dropped straight into our sustainability disclosure with no extra formatting needed.',
          authorInitials: 'SM',
          authorLabel: 'Sustainability Manager',
          authorRole: 'Malaysian NGO',
          mockupLabel: 'ESG Diversion Report',
        },
      ],
    },

    howItWorks: {
      eyebrow: 'The Process',
      headline: 'Recycle in 3 Simple Steps',
      steps: [
        {
          number: '01',
          title: 'Book a Pickup',
          subtitle: 'Takes Under a Minute',
          bullets: [
            {
              bold: 'Online or WhatsApp',
              rest: ' — whichever is faster for you',
            },
            {
              bold: 'Pick a convenient time',
              rest: ' for doorstep collection in Klang Valley',
            },
            { bold: 'No account required', rest: ' to book a pickup' },
          ],
        },
        {
          number: '02',
          title: 'We Collect',
          subtitle: 'Free, No Minimums',
          bullets: [
            { bold: 'Our team comes to you', rest: ' at the scheduled time' },
            {
              bold: 'All personal devices accepted',
              rest: ' in one visit',
            },
            { bold: 'No cost to you', rest: ' — collection is always free' },
          ],
        },
        {
          number: '03',
          title: 'Get Paid',
          subtitle: 'On the Spot',
          bullets: [
            {
              bold: 'Instant DuitNow payment',
              rest: ' at the moment of collection',
            },
            { bold: 'No waiting period', rest: ' or manual payout request' },
            {
              bold: 'Your devices are recycled',
              rest: ' through certified channels',
            },
          ],
        },
      ],
    },

    splitHero: {
      individual: {
        badge: 'For Individuals',
        headline: 'Free E-Waste Pickup You Can Trust.',
        description:
          'Recycling Hub picks up your old phones, laptops, and gadgets for free across Klang Valley — DOE-registered and fully documented, with instant payment via DuitNow the moment we collect.',
        features: [
          'Free doorstep pickup in Klang Valley',
          'Instant DuitNow payment',
          'DOE-registered and fully documented',
          'No minimums, no paperwork',
        ],
        cta: 'Book Pickup',
        ctaHref: '/contact',
      },
      business: {
        badge: 'For Businesses',
        headline: 'Registered Bulk Collection You Can Trust.',
        description:
          'Recycling Hub handles DOE- and SW110-compliant bulk collection for offices, warehouses, and factories — with certified data destruction and ESG-ready reporting, fully documented from pickup to disposal.',
        features: [
          'DOE/SW110-compliant bulk collection',
          'Certified data destruction with serialized certificates',
          'ESG & sustainability reporting included',
          'Scheduled around your operations',
        ],
        cta: 'Request Bulk Quote',
        ctaHref: '/request-quote?service=bulk-industrial-collection',
      },
    },

    deliveryModels: {
      eyebrow: 'How to Recycle With Us',
      headline: 'Two Paths. One Compliant Recycling Partner.',
      models: [
        {
          badge: 'For Individuals',
          name: 'Recycle & Get Paid',
          price: 'Free',
          period: 'pickup + instant payout',
          description:
            "No cost, no catch — individual pickup has always been free, and your DuitNow payout lands the moment we collect. That's the entire pricing story.",
          features: [
            '$0 to you — always free for individuals',
            'Paid instantly via DuitNow at collection',
            'No hidden fees or deductions',
            'No minimum device count required',
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
            "Priced by volume, not guesswork — tell us roughly what you're clearing out and we'll confirm a quote before anything is scheduled.",
          features: [
            'Quoted by device type and volume — no flat rate',
            'Confirmed in writing before any collection is scheduled',
            'Compliance documentation and ESG reporting included in the quote',
            'Recurring collection billed the same way each cycle',
          ],
          cta: 'Request Bulk Quote',
          ctaHref: '/request-quote?service=bulk-industrial-collection',
          highlight: true,
        },
      ],
      footnote:
        'Individual pickup is always free across Klang Valley — bulk and enterprise pricing is confirmed after a quick assessment of your volume.',
    },

    b2bSection: {
      eyebrow: 'For Businesses',
      headline: 'Turn E-Waste Into Verified Compliance, Not Audit Risk.',
      subheadline:
        "Improperly disposed electronics create data-breach exposure and compliance gaps your board doesn't want to explain. Recycling Hub closes that gap with licensed collection, certificate-backed destruction, and reporting your sustainability team can drop straight into an ESG disclosure.",
      pillars: [
        {
          icon: 'truck',
          title: 'Compliant Bulk Collection',
          description:
            'SW110-licensed logistics for offices, warehouses, and factories, scheduled around your operations — not ours.',
        },
        {
          icon: 'shield',
          title: 'Certified Data Destruction',
          description:
            'On-site or facility shredding with a serialized certificate of destruction for every asset, satisfying PDPA and internal audit requirements.',
        },
        {
          icon: 'chart',
          title: 'ESG & Sustainability Reporting',
          description:
            'Tonnage recycled, landfill diverted, and estimated carbon impact — delivered in a format your sustainability team can cite directly.',
        },
      ],
      cta: 'Request Bulk Quote',
      ctaHref: '/request-quote?service=bulk-industrial-collection',
      note: 'Built for finance, procurement, and sustainability teams that need paperwork they can hand straight to an auditor.',
    },

    connectorsStrip: {
      eyebrow: 'What We Collect',
      items: [
        'Phones & Tablets',
        'Laptops & Computers',
        'Monitors & Displays',
        'Office & IT Equipment',
        'Storage Devices',
      ],
      fallback: 'Not sure if we take it?',
      fallbackCtaLabel: "Ask us — we'll confirm",
      fallbackCtaHref: '/contact',
    },

    faq: {
      headline: 'Frequently Asked',
      headlineAccent: 'Questions',
      items: [
        {
          question: 'Is there a minimum number of devices for a free pickup?',
          answer:
            "No — whether it's a single old phone or a drawer full of devices, individual pickup is free across Klang Valley and comes with instant DuitNow payment. There's no account or contract required.",
        },
        {
          question: 'Which areas do you currently pick up from?',
          answer:
            "Free individual pickup is currently available across Klang Valley. If you're outside that area, get in touch and we'll let you know when coverage expands. Bulk and enterprise collection is assessed by location — request a quote and we'll confirm whether we can serve you.",
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
            "Individual pickup is for households clearing out personal devices — it's free across Klang Valley, with instant payment, no minimums. Business or bulk collection is for offices, warehouses, and factories, and is scheduled around your operations with a custom quote based on volume, device types, and location. Both are collected under the same DOE-registered, SW110-compliant process.",
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
    },

    finalCta: {
      eyebrow: 'Ready When You Are',
      headline: 'Free Pickup for You. Certified Disposal for Your Business.',
      subtext:
        "Whether it's one old phone or a warehouse of retired equipment, Recycling Hub handles the collection, the certificates, and the paperwork. Request a bulk quote or book a free call — either way, you'll have an answer within 24 hours.",
      cta: 'Request Bulk Quote',
      ctaHref: '/request-quote?service=bulk-industrial-collection',
      whatsapp: 'WhatsApp Us',
      note: 'No commitment required · Quote within 24 hours · Individual pickup always free',
    },
  },

  services: {
    hero: {
      eyebrow: 'What We Do',
      headline: 'Every Stage of the E-Waste Lifecycle,',
      headlineAccent: 'Handled Under One License.',
      description:
        'From the moment a device leaves your hands to the certificate that proves it was destroyed and recycled responsibly, Recycling Hub manages collection, certified destruction, material recovery, and compliance reporting — end to end.',
    },
    // TODO: replace with the actual DOE (JAS) registration number once issued
    trustBar: [
      'DOE-Registered E-Waste Collector',
      'Certified Data Destruction on Every Collection',
    ],
    crossLink: {
      text: 'Looking for the right fit by sector instead?',
      cta: 'Browse Solutions',
      href: '/solutions',
    },
    gridHeading: {
      ourServices: {
        eyebrow: 'Our Services',
        headline: 'Six Services. One License.',
      },
      exploreMore: { eyebrow: 'Explore More', headline: 'Other Services' },
    },
    whatsIncludedHeading: "What's Included",
    learnMore: 'Learn more',
    freeIndividualNote: {
      prefix:
        'Just clearing out a personal device? Individual pickup is free across Klang Valley — ',
      linkText: 'book directly via WhatsApp',
      suffix: ', no quote required.',
    },
    visualPlaceholders: {
      photos: 'Before/after collection photos — to be added once available',
      certificate:
        'Sample certificate of destruction — to be added once finalized',
    },
    cards: {
      'collection-pickup': {
        title: 'E-Waste Collection & Pickup',
        summary:
          'Scheduled doorstep collection for individual devices and household quantities, free of charge across Klang Valley.',
      },
      'bulk-industrial-collection': {
        title: 'Bulk & Industrial Collection',
        summary:
          'Recurring, volume-based collection for offices, warehouses, and factories — quoted and scheduled around your operations.',
      },
      'certified-data-destruction': {
        title: 'Certified Data Destruction',
        summary:
          'Physical destruction of data-bearing devices with a serialized certificate and full chain-of-custody tracking.',
      },
      'esg-reporting': {
        title: 'ESG & Sustainability Reporting',
        summary:
          'Diversion and impact reporting — tonnage recycled, materials recovered, and estimated carbon impact — for your ESG disclosures.',
      },
      'material-recovery': {
        title: 'Recycling & Material Recovery',
        summary:
          'Licensed downstream processing that recovers reusable materials and diverts the rest from landfill.',
      },
      'compliance-documentation': {
        title: 'Compliance Documentation',
        summary:
          'Consignment notes and DOE-compliant paperwork issued for every collection, ready for audit.',
      },
    } satisfies Record<ServiceSlug, { title: string; summary: string }>,
    detail: {
      'collection-pickup': {
        description:
          'Recycling Hub collects end-of-life phones, laptops, tablets, monitors, and small IT peripherals directly from your home or office across Klang Valley. Every pickup is scheduled in advance and confirmed before our team arrives, so collection happens on your terms, not as an unannounced drop-in.',
        included: [
          'Doorstep collection for individual and household electronics in Klang Valley — no minimum device count',
          'Accepted categories: phones & tablets, laptops & computers, monitors & displays, and small office IT peripherals',
          'Currently available across Klang Valley — other areas coming soon',
          'Standard pickup is sized for individual and household quantities — higher-volume collection is handled under Bulk & Industrial Collection instead',
          'Instant DuitNow payment for eligible personal devices at the point of collection',
        ],
        trust: {
          title: 'DOE-Registered Collection',
          description:
            'Every pickup — individual or bulk — is carried out under our registered DOE e-waste collector status, not an informal collection round.',
        },
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
          // TODO: confirm whether additional SW sub-codes apply to specific
          // material streams collected (e.g. batteries, CRT glass) before publishing
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
    } satisfies Record<
      ServiceSlug,
      {
        description: string;
        included: string[];
        trust: { title: string; description: string };
      }
    >,
  },

  resources: {
    hero: {
      eyebrow: 'Resources',
      headline: 'Guides to Compliant, Documented E-Waste Disposal.',
      description:
        'Straight answers on DOE registration, SW110 compliance, data destruction, and everything else that makes a collection more than just a pickup.',
    },
    gridHeading: {
      ourResources: { eyebrow: 'Guides', headline: 'Start Here' },
      exploreMore: { eyebrow: 'Explore More', headline: 'Other Guides' },
    },
    learnMore: 'Read guide',
    ctaLabel: 'Talk to Us',
    cards: {
      'doe-registration-explained': {
        title: 'What DOE Registration Means for You',
        summary:
          'Why Recycling Hub’s DOE registration matters, and what it protects you from when you hand over e-waste.',
      },
      'sw110-compliance-for-businesses': {
        title: 'SW110 Compliance for Businesses',
        summary:
          'What SW110 scheduled-waste classification means for offices, warehouses, and factories generating e-waste.',
      },
      'certified-data-destruction-guide': {
        title: 'How Certified Data Destruction Works',
        summary:
          'What actually happens to the data on your old phones, laptops, and hard drives before they’re recycled.',
      },
      'esg-reporting-for-ewaste': {
        title: 'ESG & Sustainability Reporting for E-Waste',
        summary:
          'How e-waste collection data turns into something your sustainability team can put directly into an ESG disclosure.',
      },
      'preparing-devices-for-pickup': {
        title: 'How to Prepare Your Devices for Pickup',
        summary:
          'A practical checklist before your free doorstep collection in Klang Valley, so pickup goes smoothly and your data stays yours.',
      },
      'understanding-your-certificate': {
        title: 'Understanding Your Recycling Certificate',
        summary:
          'What’s on a Recycling Hub certificate, and how to use it for your own records or an audit.',
      },
    } satisfies Record<ResourceSlug, { title: string; summary: string }>,
    detail: {
      'doe-registration-explained': {
        description:
          'Not every company that collects old electronics is legally allowed to. Recycling Hub is a DOE-registered e-waste collector, which means our collection activity is authorized and accountable under Malaysia’s Department of Environment — not run through an informal scrap channel.',
        keyPoints: [
          'DOE registration authorizes us to collect e-waste as regulated waste, not as general scrap',
          'Every pickup — individual or bulk — is carried out under this registered status, never an informal collection round',
          'Working with an unregistered collector leaves you with no paper trail if your devices, or the data on them, end up somewhere they shouldn’t',
          'Businesses need this for audit purposes — DOE-compliant paperwork is issued for every scheduled waste collection',
        ],
        takeaway:
          'If a collector can’t show proof of DOE registration, that’s a compliance and data-security risk, not just a formality.',
      },
      'sw110-compliance-for-businesses': {
        description:
          'Bulk and industrial e-waste collection isn’t just pickup at scale — it’s carried out under SW110 scheduled-waste classification, under Malaysia’s Environmental Quality Act 1974 and its subsidiary regulations. That classification is what makes bulk collection auditable.',
        keyPoints: [
          'SW110 governs how scheduled electronic waste must be collected, transported, and disposed of by a licensed operator',
          'A consignment note is issued for every SW110 collection — the paperwork an auditor will ask for',
          'This is distinct from an informal haul-it-away arrangement, which leaves no compliance trail',
          'Recurring collection is scheduled around your operating volume, not a one-off pickup dressed up as compliance',
        ],
        takeaway:
          'If your business generates e-waste regularly, SW110 compliance is what turns disposal into something you can point to during an audit.',
      },
      'certified-data-destruction-guide': {
        description:
          'Any data-bearing device we collect goes through certified destruction before recycling — not a software wipe that could theoretically be reversed, but physical destruction of the storage media itself, logged and certified.',
        keyPoints: [
          'Physical destruction of storage media, not a reversible software wipe',
          'A serialized certificate of destruction is issued per asset or per batch — tied to the specific devices, not a generic statement',
          'Chain-of-custody tracking follows the device from collection to destruction, so nothing sits unaccounted for in between',
          'Available as a standalone request for a specific device, or bundled into any collection',
          'Certificates are retrievable anytime via Track & Trace',
        ],
        takeaway:
          'If a recycler can’t produce a serialized certificate tied to your specific devices, you have no proof your data was actually destroyed.',
      },
      'esg-reporting-for-ewaste': {
        description:
          'Businesses collecting under Recycling Hub receive a diversion report summarizing what was collected and what happened to it — formatted for direct use in ESG disclosures, not raw data your team has to reformat.',
        keyPoints: [
          'Total weight collected and recycled, broken down by device category',
          'Materials-recovered vs. landfill-diverted breakdown',
          'Estimated carbon impact of the collection',
          'Delivered per collection, or aggregated over a reporting period (quarterly, annually) on request',
          'Every bulk and enterprise collection is eligible — request one with your next quote',
        ],
        takeaway:
          'E-waste diversion is one of the more concrete, easily-evidenced line items you can bring into an ESG report.',
      },
      'preparing-devices-for-pickup': {
        description:
          'Individual pickup is free across Klang Valley and doesn’t require paperwork on your end, but a few minutes of prep makes collection faster and safer for your data.',
        keyPoints: [
          'Back up anything you want to keep — devices are collected for certified destruction, not returned',
          'Sign out of accounts and remove SIM/memory cards where possible, even though certified destruction handles the data either way',
          'Group devices together so our team can confirm categories and count at the door',
          'Have the device ready at the scheduled time — pickups are confirmed in advance, not unannounced drop-ins',
          'Instant DuitNow payment is made at the point of collection for eligible personal devices',
        ],
        takeaway:
          'You don’t need to do anything complicated — just have your devices ready and your bank details on hand for DuitNow.',
      },
      'understanding-your-certificate': {
        description:
          'Every collection generates documentation — a consignment note, a certificate of destruction if data-bearing devices were involved, and DOE-compliant paperwork you can hand straight to an auditor.',
        keyPoints: [
          'Consignment note issued for every scheduled waste collection',
          'Certificate of destruction included for any data-bearing assets, serialized and tied to the specific devices destroyed',
          'DOE-compliant collection and disposal paperwork retained for your records',
          'Documentation delivered at the time of collection or shortly after',
          'Past documentation is retrievable anytime via Track & Trace, not just at the time of collection',
        ],
        takeaway:
          'Keep your certificate — it’s your proof of compliant, documented disposal if anyone ever asks.',
      },
    } satisfies Record<
      ResourceSlug,
      { description: string; keyPoints: string[]; takeaway: string }
    >,
  },

  solutions: {
    hero: {
      eyebrow: 'Who We Serve',
      headline: 'Tailored E-Waste Solutions,',
      headlineAccent: 'Sector by Sector.',
      description:
        'From a single household clearing out old devices to an enterprise retiring a data center, Recycling Hub adapts the same DOE-registered, certified process to what each sector actually needs.',
    },
    crossLink: {
      text: 'Looking for the right fit by service type instead?',
      cta: 'Browse Services',
      href: '/services',
    },
    gridHeading: {
      ourSegments: {
        eyebrow: 'Our Segments',
        headline: 'Solutions for Every Sector',
      },
      exploreMore: { eyebrow: 'Explore More', headline: 'Other Solutions' },
    },
    whyUsHeadingPrefix: 'Why',
    whyUsHeadingSuffix: 'Chooses Recycling Hub',
    learnMore: 'Learn more',
    cards: {
      'corporate-enterprise': {
        title: 'Corporate & Enterprise',
        summary:
          'Recurring bulk collection, certified data destruction, and ESG reporting for offices, corporate IT, and manufacturing facilities.',
      },
      'individuals-households': {
        title: 'Individuals & Households',
        summary:
          'Free doorstep pickup in Klang Valley and instant DuitNow payment for personal electronics — no minimums, no paperwork.',
      },
      'government-glc': {
        title: 'Government & GLC',
        summary:
          'Procurement-ready compliance and transparent documentation for public sector agencies and government-linked companies.',
      },
      education: {
        title: 'Education',
        summary:
          'Bulk collection for computer lab upgrades and campus-wide IT refresh cycles, with certified destruction of student and staff data.',
      },
      healthcare: {
        title: 'Healthcare',
        summary:
          'Chain-of-custody-tracked collection and certified destruction for retired hospital and clinic IT equipment.',
      },
      ngo: {
        title: 'NGO & Non-Profit',
        summary:
          'Flexible, lower-volume collection at partnership rates for nonprofits and community organizations.',
      },
    } satisfies Record<SolutionSlug, { title: string; summary: string }>,
    detail: {
      'corporate-enterprise': {
        framing:
          'Corporate offices, IT departments, and manufacturing facilities generate e-waste on an ongoing basis — and every device that leaves without proper documentation is a compliance and data-security question your board will eventually ask. Recycling Hub replaces that uncertainty with scheduled bulk collection, certified destruction, and audit-ready reporting built into every pickup.',
        whyUs: [
          'Recurring bulk collection scheduled around your operations, not ours',
          'Certified data destruction with a serialized certificate for every data-bearing asset retired',
          'ESG diversion reports formatted for direct use in sustainability disclosures and audits',
          'Compliance documentation — consignment notes, DOE-compliant paperwork — issued per collection, not batched at year-end',
        ],
        ctaLabel: 'Request a Bulk Quote',
        testimonialNote:
          'Corporate case study/testimonial — to be added once a client reference is available. Do not publish without real client sign-off.',
      },
      'individuals-households': {
        framing:
          "Clearing out an old phone, laptop, or a drawer full of dead chargers shouldn't take more effort than throwing it in the bin — but the bin isn't where it should go. Recycling Hub picks up your old electronics for free across Klang Valley, and pays you instantly the moment they're collected.",
        whyUs: [
          'Free doorstep pickup in Klang Valley — no minimum device count, no account or contract needed',
          'Instant DuitNow payment the moment your devices are collected',
          'All personal devices accepted — phones, laptops, tablets, monitors, and more',
          'Certified data destruction included on every data-bearing device, with no extra step for you',
        ],
        ctaLabel: 'Book a Pickup',
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
        ctaLabel: 'Request Vendor Information',
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
        ctaLabel: 'Request a Campus Collection Quote',
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
        ctaLabel: 'Request a Healthcare Solutions Quote',
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
        ctaLabel: 'Contact Us About Partnership Rates',
        testimonialNote:
          'Nonprofit partner case study or testimonial — to be added once available and cleared for public use.',
      },
    } satisfies Record<
      SolutionSlug,
      {
        framing: string;
        whyUs: string[];
        ctaLabel: string;
        testimonialNote: string;
      }
    >,
  },

  contact: {
    hero: {
      eyebrow: 'Get In Touch',
      headline: 'Not Sure If You Need This?',
      headlineAccent: "Let's Find Out.",
      description:
        "Just WhatsApp us, or send a message below. We'll help you figure out whether individual pickup or bulk collection fits your situation — and get you a quote if you need one. No commitment, no pressure.",
    },
    options: [
      { label: 'Email', sub: 'We reply within 24 hours' },
      { label: 'WhatsApp', sub: 'Click to start a chat' },
      { label: 'Website', sub: '' },
    ],
    faq: {
      eyebrow: 'Quick Answers',
      headline: 'Before You Reach Out',
      items: [
        {
          question: 'How fast will I get a reply?',
          answer:
            'We aim to reply to all emails within 24 hours on business days. For urgent queries, WhatsApp is the fastest way to reach us — we typically respond within a few hours during business hours.',
        },
        {
          question: 'Do you offer support in Bahasa Malaysia?',
          answer:
            'Yes. Our team is fluent in both English and Bahasa Malaysia. You are welcome to reach out in either language and we will respond accordingly.',
        },
        {
          question: 'Do I need to prepare anything before reaching out?',
          answer:
            "No preparation needed. It helps if you know roughly how many devices you're looking to clear out and whether it's for personal use or a business — but even if you don't, we can work through it together over WhatsApp or email.",
        },
        {
          question: 'Is getting a quote really free?',
          answer:
            "Yes, completely. There's no obligation to proceed. Send us your details and we'll review your situation, answer your questions, and give you a clear picture of whether individual pickup or bulk collection fits — plus a quote if bulk collection applies.",
        },
      ],
    },
    followUs: 'Follow Us',
    instagramDescription: 'E-waste tips & recycling updates',
  },

  faqPage: {
    eyebrow: 'FAQ',
    headline: 'Questions,',
    headlineAccent: 'Answered.',
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
              "Free individual pickup is currently available across Klang Valley. If you're outside that area, get in touch and we'll let you know when coverage expands. Bulk and enterprise collection is assessed by location — request a quote and we'll confirm whether we can serve you.",
          },
          {
            question:
              "What's the difference between individual and business collection?",
            answer:
              "Individual pickup is for households clearing out personal devices — it's free across Klang Valley, with instant payment, no minimums. Business or bulk collection is for offices, warehouses, and factories, and is scheduled around your operations with a custom quote based on volume, device types, and location. Both are collected under the same DOE-registered, SW110-compliant process.",
          },
        ],
      },
      {
        name: 'Individual Pickup',
        items: [
          {
            question: 'Is there a minimum number of devices for a free pickup?',
            answer:
              "No — whether it's a single old phone or a drawer full of devices, individual pickup is free across Klang Valley and comes with instant DuitNow payment. There's no account or contract required.",
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
  },

  trackTrace: {
    hero: {
      eyebrow: 'Track & Trace',
      headline: 'Request Your',
      headlineAccent: 'Certificate or Status.',
      description:
        "Look up a collection or request documentation — a certificate of destruction, an ESG diversion report, or a status update — and we'll get back to you.",
    },
    sectionHeading1: {
      eyebrow: 'What You Can Request',
      headline: 'Documentation for Any Collection',
      subtext:
        'Whether it was a free individual pickup or a bulk enterprise collection, you can request the paperwork that goes with it.',
    },
    requestInfo: [
      {
        title: 'Certificate of Destruction',
        description:
          'Serialized proof that a data-bearing device was destroyed to a certified standard — available for bulk and enterprise collections, and on request for individual pickups.',
      },
      {
        title: 'ESG Diversion Report',
        description:
          'Tonnage recycled and landfill diverted for a collection, formatted for your sustainability or donor reporting.',
      },
      {
        title: 'Collection Status Update',
        description:
          "Not sure where things stand on a booked or recent pickup? Send us your reference and we'll confirm.",
      },
    ],
    requestTypes: [
      'Certificate of Destruction',
      'ESG Diversion Report',
      'Collection Status Update',
    ],
    sectionHeading2: {
      eyebrow: 'Submit a Request',
      headline: 'Tell Us What You Need',
    },
    form: {
      fullName: 'Full name',
      fullNamePlaceholder: 'Your name',
      email: 'Email',
      phone: 'Phone (optional)',
      phonePlaceholder: '+60 1x-xxx xxxx',
      requestTypeLabel: 'What do you need?',
      referenceLabel: 'Booking or collection reference (optional)',
      referencePlaceholder:
        "Don't have one? Leave this blank and add details in the notes below",
      notesLabel: 'Notes (optional)',
      notesPlaceholder:
        'Approximate pickup date, address, or anything else that helps us find your collection',
      errorNameRequired: 'Please enter your full name.',
      errorEmailInvalid: 'Enter a valid email address.',
      submitButton: 'Submit Request',
      submittedButton: 'Request Sent',
      successPrefix: "Request received — we'll email your ",
      successSuffix: ' within 2 business days.',
      whatsappNote: 'Prefer to talk it through? WhatsApp us instead.',
    },
    closingNote:
      "Requests are handled by our team, not an automated system — if your reference number is hard to find, just describe the collection as best you can and we'll match it on our end.",
  },

  requestQuote: {
    hero: {
      eyebrow: 'Get a Quote',
      headline: 'Request a',
      headlineAccent: 'Quote.',
      description:
        'Tell us what you need collected and we’ll confirm pricing and a collection window — usually within 24 hours.',
    },
    form: {
      fullName: 'Full name',
      fullNamePlaceholder: 'Your name',
      email: 'Email',
      phone: 'Phone',
      phonePlaceholder: '+60 1x-xxx xxxx',
      company: 'Company (if applicable)',
      companyPlaceholder: 'Optional',
      serviceLabel: "Service you're interested in",
      detailsLabel: 'Device types & estimated volume',
      detailsPlaceholder:
        'E.g. ~40 desktops and monitors from a single office, one-off decommission',
      errorNameRequired: 'Please enter your full name.',
      errorEmailInvalid: 'Enter a valid email address.',
      submitButton: 'Submit Request',
      submittedButton: 'Request Sent',
      successMessage:
        "Request received — we'll confirm pricing and a collection window within 24 hours.",
      whatsappNote: 'Prefer to talk it through? WhatsApp us instead.',
    },
    footerNote: {
      prefix:
        "Individual pickup is always free across Klang Valley and doesn't need a quote — ",
      linkText: 'book it directly via WhatsApp',
      suffix: '.',
    },
  },

  legal: {
    contactLabels: {
      email: 'Email:',
      whatsapp: 'WhatsApp:',
      website: 'Website:',
    },
    terms: {
      hero: {
        eyebrow: 'Legal',
        headline: 'Terms of Service',
        description:
          "The terms that govern your use of Recycling Hub's collection and disposal services.",
      },
      lastUpdatedLine:
        'Last updated: 15 August 2026 · Effective date: 15 August 2026',
      sections: [
        {
          title: '1. Acceptance of Terms',
          blocks: [
            {
              type: 'p',
              text: 'By accessing our website (recyclinghub.eco), booking a pickup, or otherwise engaging Recycling Hub ("we", "us", "our") for any service, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services.',
            },
            {
              type: 'p',
              text: 'These terms apply to individuals booking a personal pickup and to businesses engaging us for bulk or enterprise collection. We may update these terms from time to time; continued use of our services after changes are posted constitutes acceptance of the revised terms.',
            },
          ],
        },
        {
          title: '2. Description of Services',
          blocks: [
            {
              type: 'p',
              text: 'Recycling Hub provides licensed e-waste collection, including:',
            },
            {
              type: 'ul',
              items: [
                'Free doorstep pickup of personal electronic devices from individuals within Klang Valley, with instant payment for eligible devices',
                'Scheduled bulk and enterprise collection for businesses, quoted according to device types and volume',
                'Certified data destruction for any data-bearing device collected, whether from an individual or a business',
                'ESG and sustainability diversion reporting for bulk and enterprise clients',
              ],
            },
            {
              type: 'p',
              text: 'For bulk and enterprise collections, the exact scope, pricing, and schedule are confirmed in a quote provided to you before collection is scheduled.',
            },
          ],
        },
        {
          title: '3. Accepted Devices and Exclusions',
          blocks: [
            {
              type: 'p',
              text: 'We accept phones and tablets, laptops and computers, monitors and displays, office and IT equipment, and data storage devices. If you are unsure whether an item is covered, contact us before booking and we will confirm.',
            },
            {
              type: 'p',
              text: 'We may decline to collect an item that is not electronic waste, that contains hazardous material outside the scope of our licence, or that was not disclosed accurately at the time of booking. Declining an item does not entitle you to any payment for that item.',
            },
          ],
        },
        {
          title: '4. Your Responsibilities',
          blocks: [
            {
              type: 'p',
              text: 'To help us complete your collection safely and correctly, you agree to:',
            },
            {
              type: 'ul',
              items: [
                'Provide accurate information about the devices you are surrendering, including quantity, type, and condition',
                'Confirm that you are the lawful owner of each device, or are otherwise authorised to surrender it for recycling',
                'Make devices reasonably accessible at the agreed pickup location and time',
                'Where practical, remove or back up any data you wish to keep before collection — while we perform certified destruction on data-bearing devices, we are not responsible for data you did not remove beforehand',
                'For business and enterprise collections, provide an accurate device inventory to support the quote and, where applicable, the certificate of destruction',
              ],
            },
          ],
        },
        {
          title: '5. Payment for Individual Pickups',
          blocks: [
            {
              type: 'p',
              text: "Individual pickups are free of charge, and eligible devices are paid for instantly via DuitNow at the time of collection. Payment amounts are based on our assessment of the device's type and condition at the point of collection, which may differ from any estimate given at the time of booking if the device's actual condition differs from what was described.",
            },
            {
              type: 'p',
              text: 'Some devices have no resale or material value and are collected and recycled at no cost to you, with no payment made in return. We will always confirm this before completing collection where reasonably possible.',
            },
          ],
        },
        {
          title: '6. Payment for Bulk and Enterprise Collection',
          blocks: [
            {
              type: 'p',
              text: 'Bulk and enterprise collection is quoted individually based on device types, volume, and site requirements. Where a service fee applies, payment terms — including amount, currency, and due date — are set out in the quote or service agreement provided to you before collection is scheduled. All prices are in Malaysian Ringgit (MYR) and exclude applicable taxes unless stated otherwise.',
            },
          ],
        },
        {
          title: '7. Scheduling and Collection',
          blocks: [
            {
              type: 'p',
              text: 'Collection windows are agreed at the time of booking. We will contact you if we need to reschedule. If you are not available at the agreed time and location without prior notice, we may need to rebook the collection for a later date.',
            },
          ],
        },
        {
          title: '8. Ownership and Certified Data Destruction',
          blocks: [
            {
              type: 'p',
              text: 'Ownership of a device transfers to Recycling Hub once it is collected. Any data-bearing device we collect is processed through certified destruction, whether wiped or physically destroyed depending on the device and condition.',
            },
            {
              type: 'p-link',
              prefix:
                'For business and enterprise collections, a certificate of destruction covering the assets collected is available on request. Individual pickups do not automatically receive a certificate, but one can be requested through our ',
              linkText: 'certificate request page',
              suffix: '.',
              href: '/track-trace',
            },
          ],
        },
        {
          title: '9. Environmental Compliance Disclaimer',
          blocks: [
            {
              type: 'p',
              text: "Recycling Hub is a DOE-registered e-waste collector, and our collection and processing activities are carried out under applicable scheduled waste requirements, including the SW110 classification, under Malaysia's Environmental Quality Act 1974 and its subsidiary regulations.",
            },
            {
              type: 'p',
              text: 'While we take reasonable care to ensure our operations remain compliant, we are not responsible for the accuracy of information you provide about a device, or for any regulatory obligation you may have that is separate from our own licensed activities.',
            },
          ],
        },
        {
          title: '10. Limitation of Liability',
          blocks: [
            {
              type: 'p',
              text: 'To the maximum extent permitted by Malaysian law, Recycling Hub shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services, including but not limited to loss of data that was not removed prior to collection, or loss arising from an inaccurate device description provided by you.',
            },
            {
              type: 'p',
              text: 'Our total liability for any claim arising from our services shall not exceed the total amount paid by you to us (or, for individual pickups where we paid you, the value of that payment) in the 3 months preceding the event giving rise to the claim.',
            },
          ],
        },
        {
          title: '11. Cancellation',
          blocks: [
            {
              type: 'p',
              text: 'You may cancel or reschedule a booked pickup at no charge by contacting us before the scheduled collection window. For bulk and enterprise collections, cancellation terms may be specified in your service agreement where a deposit or scheduling fee applies.',
            },
          ],
        },
        {
          title: '12. Confidentiality',
          blocks: [
            {
              type: 'p',
              text: 'For business and enterprise clients, we treat your device inventories, site information, and any business data shared with us as confidential, and will not disclose it to third parties except as required to complete the collection, issue certificates, or comply with the law.',
            },
          ],
        },
        {
          title: '13. Governing Law',
          blocks: [
            {
              type: 'p',
              text: 'These Terms of Service are governed by and construed in accordance with the laws of Malaysia. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts of Malaysia.',
            },
          ],
        },
        {
          title: '14. Contact Us',
          blocks: [
            {
              type: 'p',
              text: 'If you have any questions about these Terms of Service, please contact us:',
            },
            { type: 'contact-block' },
          ],
        },
      ] satisfies LegalSection[],
    },
    privacy: {
      hero: {
        eyebrow: 'Legal',
        headline: 'Privacy Policy',
        description: 'How we collect, use, and protect your information.',
      },
      lastUpdatedLine:
        'Last updated: 15 August 2026 · Effective date: 15 August 2026',
      sections: [
        {
          title: '1. Who We Are',
          blocks: [
            {
              type: 'p-link',
              prefix:
                'Recycling Hub ("we", "us", "our") is a DOE-registered e-waste collection and recycling company operating in Malaysia, serving both individuals and businesses. Our registered contact email is ',
              linkText: BRAND.email,
              suffix: '.',
              href: `mailto:${BRAND.email}`,
            },
            {
              type: 'p',
              text: "This Privacy Policy explains how we handle personal data collected through our website (recyclinghub.eco), our pickup and collection services, and any communications with us. We are committed to complying with Malaysia's Personal Data Protection Act 2010 (PDPA).",
            },
          ],
        },
        {
          title: '2. Information We Collect',
          blocks: [
            {
              type: 'p',
              text: 'We collect information in the following ways:',
            },
            {
              type: 'p-labeled',
              label: 'Information you provide directly',
              rest: 'your name, pickup address, email, phone number, and details about the devices you want collected, when you book a pickup or request a bulk quote.',
            },
            {
              type: 'p-labeled',
              label: 'Collection and device data',
              rest: 'information about the devices we collect, such as type, quantity, and condition, used to calculate payment, process certified destruction, and, for business clients, prepare certificates of destruction and ESG diversion reports.',
            },
            {
              type: 'p-labeled',
              label: 'Payment information',
              rest: 'for individual pickups, the DuitNow-linked details needed to pay you for eligible devices. Payments are processed through regulated payment rails; we do not store your full banking credentials.',
            },
            {
              type: 'p-labeled',
              label: 'Usage data',
              rest: 'standard web analytics such as page views, browser type, and referral source collected via anonymised analytics tools. No personally identifiable information is collected at this layer.',
            },
          ],
        },
        {
          title: '3. How We Use Your Information',
          blocks: [
            { type: 'p', text: 'We use the information we collect to:' },
            {
              type: 'ul',
              items: [
                'Schedule, confirm, and complete your collection',
                'Pay you instantly via DuitNow for eligible devices',
                'Prepare certificates of destruction and ESG diversion reports for business and enterprise clients',
                'Respond to enquiries and bulk quote requests',
                'Comply with legal and regulatory obligations, including recordkeeping required of a registered e-waste collector',
                'Improve our services and website experience',
              ],
            },
            {
              type: 'p',
              text: 'We do not sell, rent, or trade your personal data to third parties for marketing purposes.',
            },
          ],
        },
        {
          title: '4. Data Retention',
          blocks: [
            {
              type: 'p',
              text: 'We retain your personal data for as long as necessary to fulfil the purposes set out in this policy, or as required by law. This includes retaining collection and certificate records for a reasonable period to support any future certificate requests or audit needs, particularly for business and enterprise clients.',
            },
            {
              type: 'p',
              text: 'General contact and enquiry records are retained for up to 3 years for legitimate business purposes, after which they are deleted or anonymised.',
            },
          ],
        },
        {
          title: '5. Data Security',
          blocks: [
            {
              type: 'p',
              text: 'We implement appropriate technical and organisational measures to protect your data against unauthorised access, disclosure, alteration, or destruction. Payment details are handled through regulated, encrypted payment channels, and device or business data shared for bulk collections is treated as confidential.',
            },
            {
              type: 'p',
              text: 'No method of transmission over the internet is 100% secure. While we take every reasonable precaution, we cannot guarantee absolute security.',
            },
          ],
        },
        {
          title: '6. Sharing of Information',
          blocks: [
            {
              type: 'p',
              text: 'We only share your information with third parties in the following limited circumstances:',
            },
            {
              type: 'ul-labeled',
              items: [
                {
                  label: 'Service providers',
                  rest: 'logistics partners who assist with collection, and payment providers who process DuitNow payouts, under confidentiality obligations.',
                },
                {
                  label: 'Legal or regulatory requirement',
                  rest: 'where required by law, court order, or a government authority such as the Department of Environment.',
                },
                {
                  label: 'Business transfers',
                  rest: 'in the event of a merger or acquisition, your data may be transferred as part of that transaction.',
                },
              ],
            },
          ],
        },
        {
          title: '7. Your Rights Under PDPA',
          blocks: [
            {
              type: 'p',
              text: "Under Malaysia's Personal Data Protection Act 2010, you have the right to:",
            },
            {
              type: 'ul',
              items: [
                'Request access to the personal data we hold about you',
                'Request correction of inaccurate or incomplete personal data',
                'Withdraw consent for us to process your data, where consent is the basis for processing',
                'Request deletion of your data, subject to our legal and recordkeeping obligations',
              ],
            },
            {
              type: 'p-link',
              prefix: 'To exercise any of these rights, contact us at ',
              linkText: BRAND.email,
              suffix: '. We will respond within 21 days.',
              href: `mailto:${BRAND.email}`,
            },
          ],
        },
        {
          title: '8. Cookies',
          blocks: [
            {
              type: 'p',
              text: 'Our website uses minimal cookies required for basic functionality and anonymous analytics. We do not use advertising or tracking cookies. You may disable cookies in your browser settings, though some website features may not function as intended.',
            },
          ],
        },
        {
          title: '9. Links to Third-Party Sites',
          blocks: [
            {
              type: 'p',
              text: 'Our website may link to external services such as DuitNow/PayNet or our social media pages. We are not responsible for the privacy practices or content of those sites and encourage you to review their privacy policies independently.',
            },
          ],
        },
        {
          title: '10. Changes to This Policy',
          blocks: [
            {
              type: 'p',
              text: 'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. Continued use of our services after changes are posted constitutes your acceptance of the updated policy.',
            },
          ],
        },
        {
          title: '11. Contact Us',
          blocks: [
            {
              type: 'p',
              text: 'If you have any questions about this Privacy Policy or how we handle your data, please contact us:',
            },
            { type: 'contact-block' },
          ],
        },
      ] satisfies LegalSection[],
    },
  },
};

export type Dictionary = typeof en;
export { en };
