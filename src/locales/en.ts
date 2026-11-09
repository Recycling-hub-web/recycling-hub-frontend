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
  seo: {
    home: {
      title: 'E-waste recycling Malaysia | Free pickup | Recycling Hub',
      description:
        'E-waste recycling Malaysia: free pickup in Klang Valley, a minimum of 3 devices and instant DuitNow payment for households. Request your collection today.',
    },
    services: {
      title: 'E-waste collection services | Recycling Hub',
      description:
        'E-waste collection services in Klang Valley: free household pickup for 3+ devices, bulk collection and certified data destruction. Request a quote.',
    },
    faq: {
      title: 'E-waste recycling FAQ | Recycling Hub',
      description:
        'E-waste recycling FAQ: accepted devices, free pickup for at least 3 devices and instant DuitNow payment in Klang Valley. Read answers and request pickup.',
    },
    quote: {
      title: 'E-waste pickup quote | Recycling Hub',
      description:
        'Get an e-waste pickup quote for bulk collection and certified data destruction in Klang Valley. Household pickup is free for 3+ devices. WhatsApp us.',
    },
  },

  nav: {
    whoWeHelp: 'Who we help',
    serviceGroupMain: 'Collection & recycling',
    serviceGroupSupport: 'Business support',
    home: 'Home',
    pricing: 'Pricing',
    about: 'About',
    contact: 'Contact',
    whatsapp: 'WhatsApp Us',
    requestPickup: 'Request a Pickup',
    services: 'Services',
    solutions: 'Solutions',
    resources: 'Resources',
    viewAllServices: 'View All Services',
    viewAllSolutions: 'View All Solutions',
  },

  footer: {
    generalEnquiries: 'General enquiries',
    partnerships: 'Partnerships',

    tagline: 'Doorstep e-waste pickup in Klang Valley.',
    servicesHeading: 'Services',
    companyHeading: 'Company',
    legalHeading: 'Legal',
    services: [
      { label: 'Recycle & Get Paid', href: '/request-pickup' },
      {
        label: 'Bulk & Enterprise Collection',
        href: '/services/bulk-industrial-collection',
      },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Track & Trace / Certificates', href: '/track-trace' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Resources', href: '/resources' },
      { label: 'Blog', href: '/resources/blog' },
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
    serviceArea: {
      heading: 'E-waste pickup in Klang Valley',
      description:
        'Ask about pickup in Kuala Lumpur, Petaling Jaya, Shah Alam, Subang Jaya, Klang, Puchong, Cheras, Cyberjaya and Putrajaya. Share your address so we can confirm collection access and timing.',
      householdLink: 'Explore doorstep e-waste collection',
      businessLink: 'Arrange bulk e-waste collection',
      quoteLink: 'Request an e-waste pickup quote',
    },

    hero: {
      headlinePrefix: 'E-waste recycling',
      headlinePill: 'Malaysia',
      headlineSuffix: '',
      imageAlt: 'Old televisions and electronic equipment on shelves',
      subheadline:
        'E-waste recycling Malaysia starts at your doorstep. Recycling Hub offers free e-waste pickup in Klang Valley with a minimum of 3 devices and instant DuitNow payment for households. Businesses can arrange bulk collection, certified data destruction and compliance documents.',
      cta: 'Book Pickup',
      // TODO: replace with a real figure once available
      statCardLabel: 'Coming soon',
      statCardValue: 'Real stat',
      // TODO: replace with a real credential, e.g. "SW110 compliant"
      gradientCardLabel: 'Certified disposal',
    },

    trustStrip: {
      label: 'Pickup options for households and businesses',
      stats: [
        {
          value: 'Free',
          label: 'Household pickup in Klang Valley',
        },
        {
          value: '3 devices',
          label: 'Minimum per household pickup',
        },
        {
          value: 'DuitNow',
          label: 'Instant household payment',
        },
        {
          value: 'Business',
          label: 'Bulk collection by quotation',
        },
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
      eyebrow: 'Old electronics, a clear next step',
      headline: 'Free e-waste pickup for homes. Bulk collection for offices.',
      subtext:
        'Whether you want to recycle old electronics for cash or arrange an office clear-out, choose the collection option that fits your needs.',
      features: [
        {
          icon: 'plug',
          title: 'Clearing out a phone or laptop?',
          body: 'Request collection for your old electronics with a minimum of 3 devices. Share the device type and condition so the team can discuss what you have before pickup.',
        },
        {
          icon: 'shield',
          title: 'Retiring office equipment?',
          body: 'Tell us your equipment types, estimated volume and collection address. Business pickup is quoted separately from free household collection.',
        },
        {
          icon: 'lock',
          title: 'Need certified data destruction?',
          body: 'Businesses can request certified data destruction and compliance documents. Discuss the data-bearing devices and records you need when requesting a quote.',
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
            'Book a pickup in under a minute — for 3 devices or a hundred.',
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
            'Works for 3 devices or a full clear-out',
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
          subtitle: 'Free, minimum 3 devices',
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
          'Minimum 3 devices, no paperwork',
        ],
        cta: 'Book Pickup',
        ctaHref: '/request-pickup',
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
            'Minimum 3 devices per pickup',
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
      headline: 'Before you request',
      headlineAccent: 'a pickup',
      items: [
        {
          question: 'How many devices do I need for pickup?',
          answer:
            'Household pickup in Klang Valley is free when you have at least 3 devices. Have fewer? Contact the team to discuss your options.',
        },
        {
          question: 'When is household payment made?',
          answer:
            'Payment is made instantly via DuitNow when we collect your household electronics. Discuss your devices with the team before pickup; business collections are quote-based.',
        },
        {
          question: 'Unsure whether your electronics can be collected?',
          answer:
            'Share the device types and condition with the team. Our full FAQ explains accepted devices, collection arrangements and business documentation.',
        },
      ],
      seeMoreLabel: 'See all e-waste recycling FAQs',
      seeMoreHref: '/faq',
    },

    finalCta: {
      eyebrow: 'Ready When You Are',
      headline: 'Free Pickup for You. Certified Disposal for Your Business.',
      subtext:
        "Whether it's 3 old devices or a warehouse of retired equipment, Recycling Hub handles the collection, the certificates, and the paperwork. Request a bulk quote or WhatsApp us — either way, you'll have an answer within 24 hours.",
      cta: 'Request Bulk Quote',
      ctaHref: '/request-quote?service=bulk-industrial-collection',
      whatsapp: 'WhatsApp Us',
      note: 'No commitment required · Quote within 24 hours · Individual pickup always free',
    },
  },

  services: {
    pageMeta: {
      'collection-pickup': {
        title: 'Household e-waste pickup | Recycling Hub',
        description:
          'Free household e-waste pickup in Klang Valley for at least 3 devices, with instant DuitNow payment. Share a device list on WhatsApp to arrange collection.',
      },
      'bulk-industrial-collection': {
        title: 'Bulk e-waste collection Malaysia | Recycling Hub',
        description:
          'Arrange bulk e-waste collection in Klang Valley for office IT equipment. Discuss data destruction and documents with the team. Request a quote on WhatsApp.',
      },
      'certified-data-destruction': {
        title: 'Certified data destruction Malaysia | Recycling Hub',
        description:
          'Request certified data destruction for business devices in Klang Valley. Confirm handling and documentation before collection. Contact us on WhatsApp.',
      },
      'esg-reporting': {
        title: 'E-waste collection records | Recycling Hub',
        description:
          'Ask about e-waste collection records for your business sustainability reporting. Confirm available information and document formats with us on WhatsApp.',
      },
      'material-recovery': {
        title: 'Electronics recycling Klang Valley | Recycling Hub',
        description:
          'Arrange electronics recycling in Klang Valley with free household pickup for at least 3 devices and instant DuitNow payment. Discuss your devices today.',
      },
      'compliance-documentation': {
        title: 'Business collection documents | Recycling Hub',
        description:
          'Request business collection documents for e-waste pickup in Klang Valley. Confirm your record requirements before collection. Ask for a quote on WhatsApp.',
      },
    },
    supportHeading: {
      eyebrow: 'Business collection support',
      headline: 'Documentation and reporting records',
    },

    pickupMeta: {
      title: 'Doorstep e-waste pickup | Recycling Hub',
      description:
        'Arrange doorstep e-waste pickup in Klang Valley for at least 3 household devices. Collection is free with instant DuitNow payment. Request a callback now.',
    },

    intent: {
      heading: 'E-waste disposal for households and businesses',
      description:
        'For a household clear-out, tell us about your old laptop, phone, computer or monitor. Ask about chargers and cables when booking. Business collections need a quote based on the equipment and volume.',
      dataLink: 'Certified data destruction in Malaysia',
      bulkLink: 'Bulk e-waste collection for businesses',
      quoteLink: 'Request an e-waste pickup quote',
    },

    hero: {
      eyebrow: 'What we do',
      headline: 'E-waste collection services',
      headlineAccent: '',
      description:
        'Our e-waste collection services cover doorstep pickup in Klang Valley and bulk collection for businesses. Household pickup is free with a minimum of 3 devices. For office equipment, ask about certified data destruction, material recovery and compliance documents.',
    },
    // TODO: replace with the actual DOE (JAS) registration number once issued
    trustBar: [
      'Free household pickup in Klang Valley',
      'Certified data destruction for businesses',
    ],
    crossLink: {
      text: 'Services explain what we do. Find the right approach for your organisation:',
      cta: 'Explore e-waste solutions by sector',
      href: '/solutions',
    },
    gridHeading: {
      ourServices: {
        eyebrow: 'Our services',
        headline: 'Collection, data destruction and documentation',
      },
      exploreMore: { eyebrow: 'Explore More', headline: 'Other Services' },
    },
    whatsIncludedHeading: "What's Included",
    learnMore: 'Learn more',
    freeIndividualNote: {
      prefix:
        'Clearing out at least 3 personal devices? Individual pickup is free across Klang Valley — ',
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
        title: 'Household e-waste pickup',
        summary:
          'Free doorstep pickup in Klang Valley for at least 3 household devices, with instant DuitNow payment.',
      },
      'bulk-industrial-collection': {
        title: 'Business & bulk e-waste collection',
        summary:
          'Quote-based collection for offices and organisations retiring computers, monitors and other IT equipment.',
      },
      'certified-data-destruction': {
        title: 'Certified data destruction',
        summary:
          'Data destruction for business devices, with the handling method and required documentation confirmed before collection.',
      },
      'esg-reporting': {
        title: 'Collection & sustainability records',
        summary:
          'Discuss the collection records available for your organisation’s internal sustainability reporting.',
      },
      'material-recovery': {
        title: 'Electronics recycling',
        summary:
          'Arrange recycling for old electronics and discuss the handling requirements for your device types.',
      },
      'compliance-documentation': {
        title: 'Business collection documentation',
        summary:
          'Confirm the collection and data-destruction documents your organisation needs before arranging pickup.',
      },
    } satisfies Record<ServiceSlug, { title: string; summary: string }>,
    detail: {
      'collection-pickup': {
        description:
          'Arrange collection for your old phones, laptops, computers and other electronics in Klang Valley. Household pickup is free for a minimum of 3 devices. Share the device types and address on WhatsApp so the team can confirm acceptance and collection arrangements.',
        included: [
          'Minimum 3 devices for free household pickup',
          'Share device types, condition and collection address',
          'Instant DuitNow payment on collection',
          'Collection timing confirmed with the team',
        ],
        trust: {
          title: 'Before pickup',
          description:
            'Ask about acceptance before handing over unusual items, appliances or damaged devices.',
        },
      },
      'bulk-industrial-collection': {
        description:
          'Plan a business e-waste collection around the equipment you are retiring. Share an inventory, estimated quantities and your Klang Valley collection address. The team will confirm the scope, access arrangements and pricing before collection.',
        included: [
          'Office computers, monitors and IT equipment: confirm your inventory',
          'Quote based on equipment, volume and collection requirements',
          'Discuss building access and loading arrangements',
          'Request data destruction and documentation with your quote',
        ],
        trust: {
          title: 'Confirm the collection scope',
          description:
            'One-off or repeat collection requirements can be discussed on WhatsApp. No recurring schedule is promised before agreement.',
        },
      },
      'certified-data-destruction': {
        description:
          'Businesses can request certified data destruction when retiring data-bearing equipment. Tell the team which devices or storage media are involved and what evidence your organisation needs. Confirm the handling method, scope and documentation before collection.',
        included: [
          'List the devices and storage media involved',
          'Explain your organisation’s data-handling requirements',
          'Confirm the destruction method before handover',
          'Agree the required documentation as part of the quote',
        ],
        trust: {
          title: 'Agree the evidence you need',
          description:
            'Confirm certificate format, asset-level details and any requested standards with the team before collection.',
        },
      },
      'esg-reporting': {
        description:
          'If your organisation needs records for internal sustainability reporting, describe the information you require when requesting business collection. The team will confirm which collection records and supporting information can be provided.',
        included: [
          'Explain the purpose and reporting period',
          'Ask which device or collection details are available',
          'Confirm the format and scope before collection',
        ],
        trust: {
          title: 'Reporting support, agreed in advance',
          description:
            'Confirm the information available for your collection and how your team plans to use it in internal sustainability records.',
        },
      },
      'material-recovery': {
        description:
          'Arrange electronics recycling as part of your household or business collection. Share the device types, condition and any handling concerns before pickup. Discuss the intended recycling route with the team rather than assuming every device is reused or every material is recovered.',
        included: [
          'Confirm acceptance for your electronics',
          'Mention batteries, damaged items or other handling concerns',
          'Discuss recycling arrangements with the collection team',
        ],
        trust: {
          title: 'Ask about the recycling route',
          description:
            'Ask the team about the recycling arrangements relevant to your collection, including any equipment that needs separate handling.',
        },
      },
      'compliance-documentation': {
        description:
          'Business collections can include agreed documentation for your organisation’s records. Explain your procurement, data destruction or disposal-document requirements when asking for a quote, so the team can confirm what is available for that service.',
        included: [
          'List the documents your organisation requires',
          'Confirm the records included in your quote',
          'Ask how to request records after collection',
        ],
        trust: {
          title: 'Confirm documents before booking',
          description:
            'Confirm the document scope, format and delivery arrangements with the team before booking.',
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
    meta: {
      title: 'E-waste solutions for businesses | Recycling Hub',
      description:
        'Explore e-waste solutions for businesses and households in Klang Valley. Prepare devices, access and records for collection. Discuss needs on WhatsApp.',
    },

    relatedServiceHeading: 'Relevant service',

    pageMeta: {
      'corporate-enterprise': {
        title: 'Office IT retirement | Recycling Hub',
        description:
          'Plan office IT retirement in Klang Valley with an approved asset list and building access details. Discuss collection scope and pricing on WhatsApp.',
      },
      'individuals-households': {
        title: 'Household electronics recycling | Recycling Hub',
        description:
          'Prepare for household electronics recycling in Klang Valley: minimum 3 devices, free pickup and instant DuitNow payment. Arrange collection on WhatsApp.',
      },
      'government-glc': {
        title: 'Public-sector IT disposal preparation | Recycling Hub',
        description:
          'Prepare public-sector IT disposal with asset approvals and document requirements. Ask us to confirm collection scope in Klang Valley. Enquire on WhatsApp.',
      },
      education: {
        title: 'School electronics clear-outs | Recycling Hub',
        description:
          'Plan school electronics clear-outs in Klang Valley with room-by-room inventories and access times. Discuss collection and data needs with us on WhatsApp.',
      },
      healthcare: {
        title: 'Healthcare IT retirement | Recycling Hub',
        description:
          'Plan healthcare IT retirement in Klang Valley with internal approval, device checks and data-handling requirements. Discuss collection scope on WhatsApp.',
      },
      ngo: {
        title: 'NGO electronics clear-outs | Recycling Hub',
        description:
          'Organise NGO electronics clear-outs in Klang Valley with an organiser, device list and handover location. Confirm pricing and timing with us on WhatsApp.',
      },
    },

    householdMeta: {
      title: 'Household electronics recycling | Recycling Hub',
      description:
        'Recycle household electronics in Klang Valley with free pickup for at least 3 devices and instant DuitNow payment. Contact Recycling Hub to arrange pickup.',
    },
    hero: {
      eyebrow: 'Who we help',
      headline: 'E-waste solutions for businesses',
      headlineAccent: 'and households',
      description:
        'Choose the guidance that matches your organisation or home. Each solution explains what to prepare, who to involve and which service to discuss before arranging collection in Klang Valley.',
    },
    crossLink: {
      text: 'Ready to choose what you need?',
      cta: 'Compare e-waste collection services',
      href: '/services',
    },
    gridHeading: {
      ourSegments: {
        eyebrow: 'Our Segments',
        headline: 'Solutions for Every Sector',
      },
      exploreMore: { eyebrow: 'Explore More', headline: 'Other Solutions' },
    },
    whyUsHeadingPrefix: 'Preparing for',
    whyUsHeadingSuffix: '',
    learnMore: 'Learn more',
    cards: {
      'corporate-enterprise': {
        title: 'Office IT retirement',
        summary:
          'Plan an office equipment clear-out with an inventory, an internal owner and agreed access arrangements.',
      },
      'individuals-households': {
        title: 'Household electronics recycling',
        summary:
          'Prepare at least 3 old household devices for pickup and discuss device condition before collection.',
      },
      'government-glc': {
        title: 'Public-sector IT disposal preparation',
        summary:
          'Organise asset approvals and document requirements before requesting a public-sector equipment collection.',
      },
      education: {
        title: 'School & campus electronics clear-outs',
        summary:
          'Prepare retired classroom and office equipment for collection without disrupting active teaching spaces.',
      },
      healthcare: {
        title: 'Clinic & hospital IT retirement',
        summary:
          'Plan the handover of retired IT equipment around internal data controls and site access requirements.',
      },
      ngo: {
        title: 'Community & NGO device clear-outs',
        summary:
          'Coordinate a device list, an organiser and a collection location for your organisation’s retired electronics.',
      },
    } satisfies Record<SolutionSlug, { title: string; summary: string }>,
    detail: {
      'corporate-enterprise': {
        framing:
          'When replacing office IT, start with the devices your organisation has approved for retirement. Prepare an asset list, separate equipment still in use and identify who will authorise the handover. Share your Klang Valley site details so the team can discuss collection requirements.',
        whyUs: [
          'List equipment types, quantities and asset references',
          'Confirm internal approval and a handover contact',
          'Check loading-bay access, lifts and building restrictions',
          'Identify data-handling and record requirements before requesting a quote',
        ],
        serviceSlug: 'bulk-industrial-collection',
        serviceLabel: 'Business & bulk e-waste collection',
        ctaLabel: 'Request an office collection quote',
      },
      'individuals-households': {
        framing:
          'Gather the old electronics you want to clear from your home and check that you have at least 3 devices for free household pickup in Klang Valley. Tell the team what you have and where you live. Back up personal files and sign out of accounts before handing over your devices.',
        whyUs: [
          'Check device acceptance and condition with the team',
          'Have at least 3 household devices ready for pickup',
          'Remove SIM cards and back up files you want to keep',
          'Mention condo access or building collection rules',
        ],
        serviceSlug: 'collection-pickup',
        serviceLabel: 'Household e-waste pickup',
        ctaLabel: 'Arrange household pickup',
      },
      'government-glc': {
        framing:
          'Public agencies and government-linked companies may need internal asset-disposal approval before equipment can leave a site. Identify your approving officer, inventory references and required vendor information first. Ask the team to confirm whether the collection scope and document requirements can be met.',
        whyUs: [
          'Follow your organisation’s asset-disposal approval process',
          'Prepare an inventory and identify the authorised contact',
          'Specify requested vendor information and documents',
          'Agree site access and handover arrangements before collection',
        ],
        serviceSlug: 'compliance-documentation',
        serviceLabel: 'Business collection documentation',
        ctaLabel: 'Discuss public-sector collection',
      },
      education: {
        framing:
          'For a school or campus clear-out, separate retired equipment from devices still used by students and staff. Prepare an inventory by room or department, identify the school’s contact person and suggest collection times that avoid lessons. The team will confirm availability before a date is agreed.',
        whyUs: [
          'Separate retired equipment from active classroom devices',
          'Record equipment by room, lab or department',
          'Identify devices that may contain student or staff records',
          'Suggest suitable access times and confirm availability',
        ],
        serviceSlug: 'bulk-industrial-collection',
        serviceLabel: 'Business & bulk e-waste collection',
        ctaLabel: 'Request a campus collection quote',
      },
      healthcare: {
        framing:
          'When retiring clinic or hospital IT, involve your organisation’s IT and data-protection contacts before arranging collection. Identify data-bearing equipment and confirm which devices are approved for handover. Share equipment types with the team first; acceptance of specialist or medical equipment must be confirmed separately.',
        whyUs: [
          'Confirm internal approval for each retired IT asset',
          'Identify storage media that may contain patient records',
          'Discuss data destruction requirements before handover',
          'Confirm equipment acceptance, site access and handover contacts',
        ],
        serviceSlug: 'certified-data-destruction',
        serviceLabel: 'Certified data destruction',
        ctaLabel: 'Discuss healthcare IT collection',
      },
      ngo: {
        framing:
          'For an NGO or community device clear-out, choose an organiser who can confirm which equipment belongs to the collection. Keep items intended for donation separate from items being retired, and ask the team about acceptance and pricing before announcing a collection date.',
        whyUs: [
          'Choose an organiser and an agreed handover location',
          'Prepare device types and estimated quantities',
          'Separate donation items from equipment being retired',
          'Confirm pricing and timing before sharing collection details',
        ],
        serviceSlug: 'bulk-industrial-collection',
        serviceLabel: 'Business & bulk e-waste collection',
        ctaLabel: 'Discuss a community collection',
      },
    } satisfies Record<
      SolutionSlug,
      {
        framing: string;
        whyUs: string[];
        ctaLabel: string;
        serviceSlug: string;
        serviceLabel: string;
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
    form: {
      heading: 'Send Us a Message',
      subheading:
        'Have a question, a complaint, or need help choosing a service? Feel free to reach out.',
      firstName: 'First name',
      firstNamePlaceholder: 'Enter your first name',
      lastName: 'Last name',
      lastNamePlaceholder: 'Enter your last name',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      phone: 'Contact details',
      phonePlaceholder: 'Enter your contact number',
      subject: 'Subject',
      subjectPlaceholder: "What's this about?",
      message: 'Message',
      messagePlaceholder: 'Enter your message',
      errorFirstNameRequired: 'Please enter your first name.',
      errorLastNameRequired: 'Please enter your last name.',
      errorEmailInvalid: 'Enter a valid email address.',
      errorPhoneRequired: 'Please enter your contact number.',
      errorPhoneInvalid: 'Please enter a valid phone number, e.g. 12-345 6789.',
      errorSubjectRequired: 'Please enter a subject.',
      errorMessageRequired: 'Please enter a message.',
      submitButton: 'Send a Message',
      submittingButton: 'Sending…',
      submittedButton: 'Message Sent',
      successMessage: "Message received — we'll reply within 24 hours.",
      errorMessage: 'Something went wrong. Please try again.',
      sidePanel: {
        heading: "Hi! We're always here to help you.",
        hotlineLabel: 'Hotline',
        whatsappLabel: 'WhatsApp',
        emailLabel: 'Email',
        connectHeading: 'Connect with us',
      },
    },
  },

  faqPage: {
    eyebrow: 'FAQ',
    headline: 'E-waste recycling FAQ',
    headlineAccent: '',
    subtext:
      'This e-waste recycling FAQ covers household pickup in Klang Valley, business collection and the documents you may need. Household pickup is free with a minimum of 3 devices and instant DuitNow payment.',
    categories: [
      {
        name: 'Devices and collection areas',
        items: [
          {
            question: 'What e-waste is accepted?',
            answer:
              'Contact us about phones, tablets, laptops, computers, monitors and office IT equipment. Share a list or photos first, especially for appliances or unusual items, so the team can confirm acceptance.',
          },
          {
            question: 'Where is pickup available?',
            answer:
              'Our service area is Klang Valley. Share your collection address when enquiring so we can confirm access and collection arrangements. No specific pickup window is guaranteed before confirmation.',
          },
        ],
      },
      {
        name: 'Household pickup and payment',
        items: [
          {
            question:
              'Is e-waste pickup free, and is there a minimum quantity?',
            answer:
              'Household e-waste pickup in Klang Valley is free for at least 3 devices per pickup. Business or bulk collections are quoted separately.',
          },
          {
            question: 'How do I get paid for old electronics?',
            answer:
              'Household payment is made instantly via DuitNow on collection. Tell the team what devices you have and their condition before pickup. We do not publish fixed prices for individual devices.',
          },
          {
            question: 'How do I request a pickup?',
            answer:
              'Use Request a Pickup or contact the team on WhatsApp. Share the device types and collection address. The team will confirm the collection arrangements with you.',
          },
        ],
      },
      {
        name: 'Business collection and data',
        items: [
          {
            question: 'How is bulk e-waste collection priced?',
            answer:
              'Business collection is quote-based. Share the device types, estimated quantity and pickup location. Tell us if you need certified data destruction or compliance documents so the quote can reflect those requirements.',
          },
          {
            question: 'Can businesses request certified data destruction?',
            answer:
              'Yes. Certified data destruction is available for business collections. Discuss your data-bearing devices and documentation requirements with the team before scheduling collection.',
          },
          {
            question: 'What compliance documents can I request?',
            answer:
              'Tell us which collection, data destruction and compliance records your organisation requires. The team will confirm the documents included in your quoted service before collection.',
          },
        ],
      },
      {
        name: 'Collection records',
        items: [
          {
            question:
              'How can I check my collection status or request a certificate?',
            answer:
              'Use Track & Trace with your collection reference, if available. Otherwise, describe the collection so the team can locate the record and confirm what documentation is available.',
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
    help: {
      heading: 'Need an IT asset disposal quote?',
      description:
        'List your device types, approximate quantity and collection location below. Continue to WhatsApp, review the prepared message and send it to our general enquiries team.',
    },
    hero: {
      eyebrow: 'Business and bulk collection',
      headline: 'E-waste pickup quote',
      headlineAccent: '',
      description:
        'Request an e-waste pickup quote for office or bulk electronics in Klang Valley. Share your equipment types and estimated volume, and mention any certified data destruction or compliance documents you need. Household pickup for at least 3 devices is free and does not need a bulk e-waste quote.',
    },
    form: {
      emailPlaceholder: 'you@example.com',

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
      submitButton: 'Continue on WhatsApp',
      submittedButton: 'Open WhatsApp again',
      successMessage:
        'Your enquiry is prepared in WhatsApp. Send the message there to request a quote; this website has not submitted it.',
      whatsappNote:
        'This form prepares a WhatsApp message. You must send it there.',
    },
    footerNote: {
      prefix:
        'Household pickup in Klang Valley is free for at least 3 devices and does not need a quote — ',
      linkText: 'request free household pickup via WhatsApp',
      suffix: '.',
    },
  },

  pickupRequest: {
    hero: {
      eyebrow: 'Free Doorstep Collection',
      headline: 'Request a',
      headlineAccent: 'Pickup.',
      description:
        'Tell us what you have and where to collect it. Free household pickup requires at least 3 devices; the team will confirm the arrangements.',
    },
    typeSelector: {
      changeOption: 'Change request type',
      heading: 'What are you recycling?',
      subheading: "Choose the option that fits, and we'll take it from there.",
      callback: {
        title: 'Request a Callback',
        description:
          "Leave your number and we'll call you back. Household pickup requires at least 3 devices.",
      },
      business: {
        title: 'Business / Bulk',
        description:
          'Get a quote for office, warehouse, or factory decommissioning.',
      },
    },
    quickForm: {
      heading: 'Request a Callback',
      subheading:
        "Leave your number and we'll call you back. Household pickup requires at least 3 devices.",
      phone: 'Phone',
      phonePlaceholder: 'Enter your contact number',
      errorPhoneRequired: 'Please enter your contact number.',
      errorPhoneInvalid: 'Please enter a valid phone number, e.g. 12-345 6789.',
      submitButton: 'Request Callback',
      submittingButton: 'Submitting…',
      successMessage: "Got it — we'll call you back shortly.",
      errorMessage: 'Something went wrong. Please try again.',
    },
    form: {
      heading: 'Pickup Request Details',
      subheading:
        "Fill in your details and we'll be in touch to confirm a collection time.",
      requiredNote:
        'Fields marked * are required. You can review everything before you submit.',
      stepsLabel: 'Pickup request steps',
      steps: {
        details: {
          label: 'Your details',
          description: 'How we can reach you.',
        },
        collect: {
          label: 'What to collect',
          description: 'Where to collect, and photos of the items.',
        },
        note: {
          label: 'Anything else?',
          description: 'Optional. Anything our team should know.',
        },
        review: {
          label: 'Review and submit',
          description: 'Check everything, then send your request.',
        },
      },
      stepOf: 'Step {current} of {total}',
      doneCount: '{count} done',
      continueButton: 'Continue',
      backButton: 'Back',
      editButton: 'Edit',
      photoCount: '{count} photo(s)',
      uploadingTitle: 'Photo still uploading',
      uploadingBody: 'Wait for the photo to finish uploading, then submit.',
      fixStepTitle: 'Check this step',
      fixStepBody: '{step} has something to fix.',
      nextTitle: 'What happens next',
      nextSteps: [
        {
          title: 'We review your request',
          body: 'We look at your photos and address to plan the collection.',
        },
        {
          title: 'We call to agree a time',
          body: "We'll contact you on the number you give to confirm a pickup date and time.",
        },
        {
          title: 'We collect',
          body: 'Our team collects your items at the agreed time.',
        },
      ],
      fullName: 'Full name',
      fullNamePlaceholder: 'e.g. Fatima Ali',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      phone: 'Phone',
      phonePlaceholder: 'Enter your contact number',
      pickupAddress: 'Pickup address',
      pickupAddressPlaceholder: 'Address where materials should be collected',
      addressVerifiedAt: 'Verified at',
      note: 'Note',
      notePlaceholder: 'Anything else worth mentioning',
      photos: 'Photos',
      photosHelper:
        'Photos of what we should collect — at least 1, up to 4 (JPG, PNG or WebP, 5 MB each).',
      photosAdd: 'Add photo',
      errorPhotosRequired: 'Please add at least one photo.',
      errorFullNameRequired: 'Please enter your full name.',
      errorEmailInvalid: 'Enter a valid email address.',
      errorEmailRequired: 'Email is required for business requests.',
      errorPhoneRequired: 'Please enter your contact number.',
      errorPhoneInvalid: 'Please enter a valid phone number, e.g. 12-345 6789.',
      errorAddressRequired: 'Please enter a pickup address.',
      submitButton: 'Submit Request',
      submittingButton: 'Submitting…',
      successMessage:
        "Request received — we'll be in touch to confirm your pickup.",
      errorMessage: 'Something went wrong. Please try again.',
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

  // Internal operations sign-in (Admin/Staff/Driver/Receiving Officer/
  // Accounting) — not part of the public marketing site, but bilingual for
  // the same reason everything else here is: staff read Malay too.
  auth: {
    login: {
      title: 'Sign in',
      subtitle: 'Sign in to Recycling Hub operations.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@recyclinghub.eco',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      forgotPassword: 'Forgot password?',
      submit: 'Sign in',
      submitting: 'Signing in…',
      genericError: 'Invalid email or password.',
    },
    verifyOtp: {
      title: 'Enter your code',
      subtitle: 'We sent a 6-digit verification code to your email.',
      codeLabel: '6-digit code',
      submit: 'Verify',
      submitting: 'Verifying…',
      resend: "Didn't get a code? Resend",
      resendSending: 'Sending…',
      resendSent: 'A new code has been sent.',
      resendIn: 'Resend in',
      backToLogin: 'Back to sign in',
      noPendingFlow: 'Your sign-in session has expired — please sign in again.',
      genericError: 'Invalid or expired code.',
      incompleteCodeError: 'Enter all 6 digits.',
    },
    forgotPassword: {
      title: 'Forgot your password?',
      subtitle: "Enter your email and we'll send you a link to reset it.",
      emailLabel: 'Email',
      emailPlaceholder: 'you@recyclinghub.eco',
      submit: 'Send reset link',
      submitting: 'Sending…',
      successTitle: 'Check your email',
      successMessage:
        "If that account exists, we've sent a password reset link to it.",
      backToLogin: 'Back to sign in',
    },
    resetPassword: {
      title: 'Reset your password',
      subtitle: 'Choose a new password for your account.',
      passwordLabel: 'New password',
      confirmLabel: 'Confirm new password',
      submit: 'Reset password',
      submitting: 'Resetting…',
      successTitle: 'Password updated',
      successMessage: 'Your password has been reset — you can now sign in.',
      signInNow: 'Sign in',
      invalidToken:
        'This link is invalid or has expired. Request a new one below.',
      requestNewLink: 'Request a new link',
      passwordMismatch: 'Passwords do not match.',
    },
    setPassword: {
      title: 'Set your password',
      subtitle:
        'An administrator created an account for you on Recycling Hub. Set a password to finish activating it.',
      passwordLabel: 'Password',
      confirmLabel: 'Confirm password',
      submit: 'Set password',
      submitting: 'Setting password…',
      successTitle: 'Account activated',
      successMessage: 'Your password has been set — you can now sign in.',
      signInNow: 'Sign in',
      invalidToken:
        'This invite link is invalid or has expired. Contact your administrator for a new one.',
      passwordMismatch: 'Passwords do not match.',
    },
    accountLocked: {
      title: 'Account temporarily locked',
      message:
        "We've temporarily locked this account after several failed sign-in attempts, to protect it. Please try again in a little while.",
      backToLogin: 'Back to sign in',
    },
    unauthorized: {
      title: "You don't have access to this",
      message: "Your account doesn't have permission to view this page.",
      backToDashboard: 'Back to my dashboard',
    },
  },
};

export type Dictionary = typeof en;
export { en };
