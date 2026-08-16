// English dictionary — canonical source of truth for shape. `bm.ts` is typed
// against `Dictionary` (derived below) so a missing translation key fails to
// compile rather than silently falling back.
//
// Scope (Phase 1): navbar/footer chrome + full homepage. All other pages
// (Services, Solutions, About, Pricing, legal, FAQ, track & trace) still read
// from `constants/content.ts` directly and are English-only for now — they'll
// move into this dictionary system in a later pass.

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
    copyrightLine: 'All rights reserved.',
  },

  home: {
    hero: {
      headlinePrefix: 'Registered',
      headlinePill: 'E-Waste',
      headlineSuffix: 'Recycling Services You Can Trust',
      subheadline:
        'Recycling Hub picks up old electronics for free, wherever you are — for households clearing out a drawer of devices and for businesses decommissioning a whole office. Every collection is DOE-registered and fully documented.',
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
        { value: 'Free', label: 'Doorstep Pickup for Individuals' },
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
            'Doorstep pickup for individuals, on-site for businesses',
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
              rest: ' for doorstep collection',
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
          ctaHref: '/request-quote?service=bulk-industrial-collection',
          highlight: true,
        },
      ],
      footnote:
        'Individual pickup is always free — bulk and enterprise pricing is confirmed after a quick assessment of your volume.',
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
};

export type Dictionary = typeof en;
export { en };
