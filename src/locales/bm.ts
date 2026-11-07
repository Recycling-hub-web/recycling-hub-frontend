// Bahasa Melayu (Malaysia) translation.
//
// TODO: this translation was drafted by an AI assistant, not a native
// Malaysian-Malay copywriter. It should get a native-speaker review pass
// before being treated as final/production copy — especially the FAQ and
// legal-adjacent compliance wording (DOE/SW110/PDPA phrasing), where
// precision matters. Established English/regulatory terms (DOE, SW110,
// PDPA, ESG, DuitNow, Recycling Hub) are deliberately kept untranslated,
// matching how they're actually used in Malaysian business Malay.
//
// TODO: LEGAL REVIEW REQUIRED before `legal.terms`/`legal.privacy` below is
// relied upon as a binding legal document. This translation of the Terms of
// Service and Privacy Policy has NOT been reviewed by a Malaysian-qualified
// lawyer — the PDPA 2010 / DOE-SW110 references, liability limitation, and
// governing-law clauses especially need verification. The English text at
// /terms and /privacy remains authoritative until that review happens.

import {
  BRAND,
  type ResourceSlug,
  type ServiceSlug,
  type SolutionSlug,
} from '../constants/content';
import type { Dictionary } from './en';

const bm: Dictionary = {
  seo: {
    home: {
      title: 'Kitar semula sisa elektronik | Recycling Hub',
      description:
        'Kitar semula sisa elektronik di Lembah Klang: pickup percuma dengan minimum 3 peranti untuk isi rumah, bayaran DuitNow serta-merta. Minta kutipan hari ini.',
    },
    services: {
      title: 'Perkhidmatan kutipan e-waste | Recycling Hub',
      description:
        'Perkhidmatan kutipan e-waste di Lembah Klang: pickup rumah percuma untuk 3+ peranti, kutipan pukal dan pemusnahan data. Hubungi kami untuk sebut harga.',
    },
    faq: {
      title: 'Soalan lazim kitar semula e-waste | Recycling Hub',
      description:
        'Soalan lazim kitar semula e-waste: peranti diterima, pickup rumah percuma minimum 3 peranti dan bayaran DuitNow di Lembah Klang. Baca dan minta kutipan.',
    },
    quote: {
      title: 'Sebut harga pickup e-waste | Recycling Hub',
      description:
        'Minta sebut harga pickup e-waste untuk kutipan pukal di Lembah Klang. Pickup rumah percuma untuk 3+ peranti. Hubungi kami melalui WhatsApp.',
    },
  },

  nav: {
    whoWeHelp: 'Siapa yang kami bantu',
    serviceGroupMain: 'Kutipan & kitar semula',
    serviceGroupSupport: 'Sokongan perniagaan',
    home: 'Laman Utama',
    pricing: 'Harga',
    about: 'Tentang Kami',
    contact: 'Hubungi Kami',
    whatsapp: 'WhatsApp Kami',
    requestQuote: 'Minta Sebut Harga',
    requestPickup: 'Minta Kutipan',
    services: 'Perkhidmatan',
    solutions: 'Penyelesaian',
    resources: 'Sumber',
    viewAllServices: 'Lihat Semua Perkhidmatan',
    viewAllSolutions: 'Lihat Semua Penyelesaian',
  },

  footer: {
    generalEnquiries: 'Pertanyaan umum',
    partnerships: 'Kerjasama',

    tagline: 'Pickup e-waste di rumah di Lembah Klang.',
    servicesHeading: 'Perkhidmatan',
    companyHeading: 'Syarikat',
    legalHeading: 'Perundangan',
    services: [
      { label: 'Kitar Semula & Dapat Bayaran', href: '/request-pickup' },
      {
        label: 'Pengumpulan Pukal & Perusahaan',
        href: '/services/bulk-industrial-collection',
      },
      { label: 'Cara Ia Berfungsi', href: '/#how-it-works' },
      { label: 'Jejak & Kesan / Sijil', href: '/track-trace' },
      { label: 'Minta Sebut Harga', href: '/request-quote' },
    ],
    company: [
      { label: 'Tentang Kami', href: '/about' },
      { label: 'Perkhidmatan', href: '/services' },
      { label: 'Sumber', href: '/resources' },
      { label: 'Blog', href: '/resources/blog' },
      { label: 'Soalan Lazim', href: '/faq' },
      { label: 'Hubungi Kami', href: '/request-pickup' },
    ],
    legal: [
      { label: 'Dasar Privasi', href: '/privacy' },
      { label: 'Terma Perkhidmatan', href: '/terms' },
    ],
    copyrightLine: 'Hak cipta terpelihara.',
  },

  home: {
    serviceArea: {
      heading: 'Pickup e-waste di Lembah Klang',
      description:
        'Tanya tentang pickup di Kuala Lumpur, Petaling Jaya, Shah Alam, Subang Jaya, Klang, Puchong, Cheras, Cyberjaya dan Putrajaya. Kongsi alamat anda supaya kami boleh mengesahkan akses dan masa kutipan.',
      householdLink: 'Ketahui perkhidmatan kutipan e-waste di rumah',
      businessLink: 'Urus kutipan e-waste pukal',
      quoteLink: 'Minta sebut harga pickup e-waste',
    },

    hero: {
      headlinePrefix: 'Kitar semula',
      headlinePill: 'sisa elektronik',
      headlineSuffix: '',
      imageAlt: 'Televisyen lama dan peralatan elektronik di atas rak',
      subheadline:
        'Kitar semula sisa elektronik bermula di depan pintu anda. Recycling Hub menawarkan pickup e-waste percuma di Lembah Klang dengan minimum 3 peranti dan bayaran DuitNow serta-merta untuk isi rumah. Perniagaan boleh mengatur kutipan pukal, pemusnahan data bertauliah dan dokumen pematuhan.',
      cta: 'Tempah Kutipan',
      statCardLabel: 'Akan datang',
      statCardValue: 'Statistik sebenar',
      gradientCardLabel: 'Pelupusan bertauliah',
    },

    trustStrip: {
      label: 'Pilihan kutipan untuk isi rumah dan perniagaan',
      stats: [
        {
          value: 'Percuma',
          label: 'Pickup rumah di Lembah Klang',
        },
        {
          value: '3 peranti',
          label: 'Minimum untuk pickup rumah',
        },
        {
          value: 'DuitNow',
          label: 'Bayaran isi rumah serta-merta',
        },
        {
          value: 'Perniagaan',
          label: 'Kutipan pukal ikut sebut harga',
        },
      ],
    },

    problemIllustration: {
      headline: 'Masih Bertimbun? Atau Lebih Teruk — Dalam Tong Sampah?',
      subtext:
        'Peraih besi buruk, bilik simpanan, dan tong sampah biasa menyembunyikan peranti elektronik lama daripada pandangan — tetapi ia tidak menjamin pematuhan anda, atau keselamatan data anda.',
      cards: [
        {
          label: 'Peraih Besi Buruk',
          avatarText: 'SD',
          invoice: 'Komputer Riba Syarikat Lama',
          status: 'Tiada pemadaman data dilakukan',
        },
        {
          label: 'Bilik Simpanan',
          avatarText: 'ST',
          invoice: 'Kotak Peranti Lama',
          status: 'Hanya memenuhi ruang',
        },
        {
          label: 'Sampah Biasa',
          avatarText: '?',
          invoice: 'E-Sisa dalam Tong Sampah Am',
          status: 'Risiko pelupusan haram',
        },
      ],
      caption:
        'Peranti yang sama. Satu perbezaan senyap: pelupusan bertauliah dan mematuhi peraturan.',
    },

    problemStrip: {
      eyebrow: 'Risiko',
      headline: 'Ke Mana Sebenarnya Peranti Elektronik Lama Anda Berakhir?',
      stats: [
        { value: 'DOE', label: 'Kutipan & Pelupusan Berlesen' },
        { value: '0', label: 'Peranti Dihantar ke Tapak Pelupusan' },
        { value: '100%', label: 'Pemusnahan Data Bertauliah' },
      ],
      body: 'Peraih besi buruk, bilik simpanan, dan tong sampah biasa menyembunyikan peranti elektronik lama daripada pandangan — tetapi tiada satu pun daripadanya memadam data anda, mendokumenkan ke mana peranti itu pergi, atau memastikannya tidak berakhir di tapak pelupusan. Bagi sebuah perniagaan, itu adalah jurang pematuhan dan keselamatan data. Bagi sesiapa sahaja, itu bermakna peranti yang masih boleh dipulihkan berada di tangan seseorang yang tiada kewajipan untuk memusnahkannya dengan betul. Recycling Hub menggantikan ketidakpastian itu dengan kutipan berlesen, didokumenkan, dan disokong sijil.',
      warning:
        'Jumlah e-sisa di Malaysia semakin meningkat setiap tahun, dan jangkaan kawal selia serta ESG mengenai pelupusan yang betul turut semakin ketat. Menyediakan proses yang mematuhi peraturan sekarang lebih murah berbanding menjelaskan proses yang tidak terkawal kelak.',
    },

    whyRecyclingHub: {
      eyebrow: 'Langkah seterusnya untuk peranti lama',
      headline: 'Pickup rumah percuma. Kutipan pukal untuk pejabat.',
      subtext:
        'Sama ada anda mahu jual laptop lama atau mengosongkan peralatan pejabat, pilih kutipan yang sesuai dengan keperluan anda.',
      features: [
        {
          icon: 'plug',
          title: 'Ada telefon atau laptop lama?',
          body: 'Minta kutipan peranti lama dengan minimum 3 peranti. Kongsi jenis dan keadaan peranti supaya pasukan kami boleh berbincang dengan anda sebelum pickup.',
        },
        {
          icon: 'shield',
          title: 'Menggantikan peralatan pejabat?',
          body: 'Beritahu kami jenis peralatan, anggaran kuantiti dan alamat kutipan. Pickup perniagaan diberi sebut harga berasingan daripada kutipan rumah percuma.',
        },
        {
          icon: 'lock',
          title: 'Perlukan pemusnahan data bertauliah?',
          body: 'Perniagaan boleh meminta pemusnahan data bertauliah dan dokumen pematuhan. Nyatakan peranti yang menyimpan data dan rekod yang anda perlukan semasa meminta sebut harga.',
        },
      ],
    },

    comparison: {
      eyebrow: 'Transformasi',
      headline: 'Berhenti Meneka Ke Mana Ia Berakhir. Mula Dapatkan Bukti.',
      oldWay: {
        badge: 'Cara Biasa',
        headline: 'Tidak Dikawal Selia. Tidak Dapat Dikesan. Berisiko.',
        subtext: 'Cara kebanyakan peranti elektronik lama dilupuskan hari ini.',
        items: [
          'Dijual kepada peraih besi buruk tidak berlesen, tanpa sebarang soalan',
          'Dibiarkan di bilik simpanan buat masa yang lama, memenuhi ruang',
          'Dibuang ke tong sampah biasa — secara teknikal menyalahi undang-undang, jarang dikuatkuasakan',
          'Tiada kepastian sama ada data pada peranti itu pernah dipadam',
          'Tiada dokumen jika pengawal selia atau juruaudit bertanya',
          'Tiada kepastian ke mana peranti itu sebenarnya berakhir',
        ],
      },
      recyclingHubWay: {
        badge: 'Bersama Recycling Hub',
        headline: 'Berlesen. Didokumenkan. Mudah.',
        subtext:
          'Apa yang anda perolehi apabila Recycling Hub menguruskannya untuk anda.',
        items: [
          'Dikumpul oleh pasukan berdaftar DOE yang mematuhi SW110',
          'Pemusnahan data bertauliah dengan sijil bersiri',
          'Rantaian jagaan penuh dari kutipan hingga pemprosesan',
          'Laporan pengalihan sedia ESG untuk rekod kelestarian anda',
          'Bayaran DuitNow segera untuk kutipan individu',
          'Pasukan khusus yang menguruskan kutipan pukal untuk anda',
        ],
      },
      ctaPrimary: 'Minta Sebut Harga Pukal',
      ctaSecondary: 'WhatsApp Kami',
    },

    featureTabs: {
      headline: 'Apa Yang Berlaku Selepas Anda Menempah',
      subtext:
        'Dari saat anda menempah hingga sijil tiba di peti masuk anda — setiap langkah berlesen, dijejaki, dan didokumenkan.',
      tabs: [
        {
          label: 'Tempah & Jadualkan',
          headline:
            'Tempah kutipan dalam kurang seminit — untuk 3 peranti atau seratus.',
          checklist: [
            'Tempahan melalui borang dalam talian atau WhatsApp',
            'Slot fleksibel untuk isi rumah dan pejabat',
            'Kutipan pukal dijadualkan mengikut operasi anda',
            'Tiada akaun atau kontrak diperlukan untuk individu',
            'Pengesahan dihantar sejurus selepas tempahan',
          ],
          // TODO: replace with real client quote
          quote:
            'Kami ada empat puluh komputer riba lama tersimpan di bilik stor selama dua tahun. Recycling Hub berjaya mengutipnya dalam masa seminggu selepas tempahan.',
          authorInitials: 'OM',
          authorLabel: 'Pengurus Pejabat',
          authorRole: 'Syarikat perdagangan di KL',
          mockupLabel: 'Pengesahan Tempahan Kutipan',
        },
        {
          label: 'Kutipan',
          headline: 'Kutipan berlesen, dijejaki sejak saat kami tiba.',
          checklist: [
            'Pasukan kutipan berdaftar DOE, mematuhi SW110',
            'Kutipan di rumah untuk individu di Klang Valley, di tapak untuk perniagaan',
            'Setiap item yang dikutip direkod semasa kutipan',
            'Pengangkutan selamat ke fasiliti pemprosesan kami',
            'Tiada peranti yang tidak direkodkan',
          ],
          // TODO: replace with real client quote
          quote:
            'Pasukan itu merekod setiap unit sebelum ia meninggalkan bangunan kami. Kami dapat manifes penuh pada hari yang sama.',
          authorInitials: 'FM',
          authorLabel: 'Pengurus Fasiliti',
          authorRole: 'Pengilang di Selangor',
          mockupLabel: 'Log Kutipan Langsung',
        },
        {
          label: 'Susun & Proses',
          headline:
            'Setiap peranti disusun, dinilai, dan dihalakan dengan betul.',
          checklist: [
            'Peranti dinilai untuk penggunaan semula, pembaikan, atau kitar semula',
            'Komponen diasingkan mengikut jenis bahan',
            'Komponen berbahaya dikendalikan mengikut piawaian DOE',
            'Tiada apa-apa dihantar ke tapak pelupusan',
            'Fasiliti pemprosesan terbuka kepada audit pematuhan',
          ],
          // TODO: replace with real client quote
          quote:
            'Kami bertanya apa yang sebenarnya berlaku selepas kutipan, dan Recycling Hub menerangkan keseluruhan proses itu — tiada yang kabur.',
          authorInitials: 'PL',
          authorLabel: 'Ketua Perolehan',
          authorRole: 'Firma perkhidmatan profesional di KL',
          mockupLabel: 'Papan Status Pemprosesan',
        },
        {
          label: 'Pemusnahan Data',
          headline:
            'Setiap peranti membawa data dimusnahkan, bukan sekadar dipadam.',
          checklist: [
            'Pemecahan bertauliah di tapak atau di fasiliti',
            'Sijil pemusnahan bersiri bagi setiap aset',
            'Pengendalian mematuhi PDPA sepanjang proses',
            'Tiada penjualan semula peranti yang membawa data',
            'Sijil tersedia untuk audit dalam masa beberapa hari',
          ],
          // TODO: replace with real client quote
          quote:
            'Kami perlukan bukti pelayan lama kami dimusnahkan, bukan dijual semula. Sijil itu merangkumi setiap nombor siri.',
          authorInitials: 'ITM',
          authorLabel: 'Pengurus IT',
          authorRole: 'Firma perkhidmatan kewangan',
          mockupLabel: 'Sijil Pemusnahan',
        },
        {
          label: 'Dapat Bayaran',
          headline: 'Individu dibayar sejurus peranti mereka dikutip.',
          checklist: [
            'Bayaran DuitNow segera semasa kutipan',
            'Tiada tempoh menunggu atau permintaan bayaran manual',
            'Bayaran disahkan sebelum pasukan kami beredar',
            'Tiada potongan tersembunyi',
            'Sesuai untuk 3 peranti atau pembersihan penuh',
          ],
          // TODO: replace with real client quote
          quote:
            'Saya ada satu laci penuh telefon lama. Bayaran masuk ke DuitNow sebelum pun pasukan kutipan beredar.',
          authorInitials: 'HS',
          authorLabel: 'Penjual Individu',
          authorRole: 'Petaling Jaya',
          mockupLabel: 'Pengesahan Bayaran DuitNow',
        },
        {
          label: 'Dokumen Pematuhan',
          headline:
            'Setiap kutipan disokong dokumen yang diterima juruaudit anda.',
          checklist: [
            'Dokumentasi DOE dan SW110 bagi setiap kutipan',
            'Rekod rantaian jagaan yang lengkap',
            'Sijil disimpan dan boleh diperoleh semula atas permintaan',
            'Sedia untuk audit dalaman atau pihak ketiga',
            'Tiada penyimpanan rekod manual diperlukan di pihak anda',
          ],
          // TODO: replace with real client quote
          quote:
            'Apabila juruaudit kami meminta rekod pelupusan e-sisa, kami dapat dokumentasi penuh dalam masa sejam.',
          authorInitials: 'CO',
          authorLabel: 'Pegawai Pematuhan',
          authorRole: 'Pengilang di Lembah Klang',
          mockupLabel: 'Pek Dokumentasi Pematuhan',
        },
        {
          label: 'Laporan ESG',
          headline:
            'Laporan pengalihan yang benar-benar boleh digunakan pasukan kelestarian anda.',
          checklist: [
            'Tonaj dikitar semula bagi setiap kutipan',
            'Ringkasan pengalihan daripada tapak pelupusan',
            'Anggaran kesan karbon',
            'Diberikan dalam format sedia untuk pendedahan ESG',
            'Tersedia mengikut kutipan atau secara tahunan',
          ],
          // TODO: replace with real client quote
          quote:
            'Laporan pengalihan itu terus digunakan dalam pendedahan kelestarian kami tanpa sebarang format tambahan diperlukan.',
          authorInitials: 'SM',
          authorLabel: 'Pengurus Kelestarian',
          authorRole: 'NGO di Malaysia',
          mockupLabel: 'Laporan Pengalihan ESG',
        },
      ],
    },

    howItWorks: {
      eyebrow: 'Proses',
      headline: 'Kitar Semula dalam 3 Langkah Mudah',
      steps: [
        {
          number: '01',
          title: 'Tempah Kutipan',
          subtitle: 'Kurang Daripada Seminit',
          bullets: [
            {
              bold: 'Dalam talian atau WhatsApp',
              rest: ' — mana-mana yang lebih pantas untuk anda',
            },
            {
              bold: 'Pilih masa yang sesuai',
              rest: ' untuk kutipan di rumah di Klang Valley',
            },
            { bold: 'Tiada akaun diperlukan', rest: ' untuk menempah kutipan' },
          ],
        },
        {
          number: '02',
          title: 'Kami Mengutip',
          subtitle: 'Percuma, minimum 3 peranti',
          bullets: [
            {
              bold: 'Pasukan kami datang kepada anda',
              rest: ' pada masa yang dijadualkan',
            },
            {
              bold: 'Semua peranti peribadi diterima',
              rest: ' dalam satu lawatan',
            },
            {
              bold: 'Tiada kos kepada anda',
              rest: ' — kutipan sentiasa percuma',
            },
          ],
        },
        {
          number: '03',
          title: 'Dapat Bayaran',
          subtitle: 'Di Situ Juga',
          bullets: [
            {
              bold: 'Bayaran DuitNow segera',
              rest: ' semasa kutipan berlangsung',
            },
            {
              bold: 'Tiada tempoh menunggu',
              rest: ' atau permintaan bayaran manual',
            },
            {
              bold: 'Peranti anda dikitar semula',
              rest: ' melalui saluran bertauliah',
            },
          ],
        },
      ],
    },

    splitHero: {
      individual: {
        badge: 'Untuk Individu',
        headline: 'Kutipan E-Sisa Percuma Yang Boleh Dipercayai.',
        description:
          'Recycling Hub mengutip telefon, komputer riba, dan gajet lama anda secara percuma di seluruh Klang Valley — berdaftar DOE dan didokumenkan sepenuhnya, dengan bayaran segera melalui DuitNow sebaik sahaja kami mengutip.',
        features: [
          'Kutipan percuma di rumah di Klang Valley',
          'Bayaran DuitNow segera',
          'Berdaftar DOE dan didokumenkan sepenuhnya',
          '3 peranti, tiada dokumen',
        ],
        cta: 'Tempah Kutipan',
        ctaHref: '/request-pickup',
      },
      business: {
        badge: 'Untuk Perniagaan',
        headline: 'Kutipan Pukal Berdaftar Yang Boleh Dipercayai.',
        description:
          'Recycling Hub mengendalikan kutipan pukal mematuhi DOE dan SW110 untuk pejabat, gudang, dan kilang — dengan pemusnahan data bertauliah dan laporan sedia ESG, didokumenkan sepenuhnya dari kutipan hingga pelupusan.',
        features: [
          'Kutipan pukal mematuhi DOE/SW110',
          'Pemusnahan data bertauliah dengan sijil bersiri',
          'Laporan ESG & kelestarian disertakan',
          'Dijadualkan mengikut operasi anda',
        ],
        cta: 'Minta Sebut Harga Pukal',
        ctaHref: '/request-quote?service=bulk-industrial-collection',
      },
    },

    deliveryModels: {
      eyebrow: 'Cara Kitar Semula Bersama Kami',
      headline: 'Dua Laluan. Satu Rakan Kongsi Kitar Semula Bertauliah.',
      models: [
        {
          badge: 'Untuk Individu',
          name: 'Kitar Semula & Dapat Bayaran',
          price: 'Percuma',
          period: 'kutipan + bayaran segera',
          description:
            'Tiada kos, tiada muslihat — kutipan individu sentiasa percuma, dan bayaran DuitNow anda masuk sebaik sahaja kami mengutip. Itulah keseluruhan cerita harga kami.',
          features: [
            'RM0 kepada anda — sentiasa percuma untuk individu',
            'Dibayar segera melalui DuitNow semasa kutipan',
            'Tiada yuran atau potongan tersembunyi',
            'Minimum 3 peranti setiap kutipan',
          ],
          cta: 'Kitar Semula & Dapat Bayaran',
          ctaHref: '/contact',
          highlight: false,
        },
        {
          badge: 'Untuk Perniagaan',
          name: 'Kutipan Pukal Bertauliah',
          price: 'Sebut Harga Khusus',
          period: 'mengikut jumlah',
          description:
            'Disebut harga mengikut jumlah, bukan agakan — beritahu kami secara kasar apa yang ingin anda lupuskan dan kami akan sahkan sebut harga sebelum apa-apa dijadualkan.',
          features: [
            'Disebut harga mengikut jenis dan jumlah peranti — bukan kadar tetap',
            'Disahkan secara bertulis sebelum sebarang kutipan dijadualkan',
            'Dokumentasi pematuhan dan laporan ESG disertakan dalam sebut harga',
            'Kutipan berulang dikenakan bayaran secara konsisten setiap kitaran',
          ],
          cta: 'Minta Sebut Harga Pukal',
          ctaHref: '/request-quote?service=bulk-industrial-collection',
          highlight: true,
        },
      ],
      footnote:
        'Kutipan individu sentiasa percuma di seluruh Klang Valley — harga pukal dan perusahaan disahkan selepas penilaian ringkas jumlah anda.',
    },

    b2bSection: {
      eyebrow: 'Untuk Perniagaan',
      headline: 'Jadikan E-Sisa Pematuhan Yang Disahkan, Bukan Risiko Audit.',
      subheadline:
        'Peranti elektronik yang dilupuskan secara tidak betul mewujudkan risiko kebocoran data dan jurang pematuhan yang tidak mahu dijelaskan oleh lembaga pengarah anda. Recycling Hub menutup jurang itu dengan kutipan berlesen, pemusnahan disokong sijil, dan laporan yang boleh terus digunakan pasukan kelestarian anda dalam pendedahan ESG.',
      pillars: [
        {
          icon: 'truck',
          title: 'Kutipan Pukal Bertauliah',
          description:
            'Logistik berlesen SW110 untuk pejabat, gudang, dan kilang, dijadualkan mengikut operasi anda — bukan operasi kami.',
        },
        {
          icon: 'shield',
          title: 'Pemusnahan Data Bertauliah',
          description:
            'Pemecahan di tapak atau di fasiliti dengan sijil pemusnahan bersiri bagi setiap aset, memenuhi keperluan PDPA dan audit dalaman.',
        },
        {
          icon: 'chart',
          title: 'Laporan ESG & Kelestarian',
          description:
            'Tonaj dikitar semula, pengalihan daripada tapak pelupusan, dan anggaran kesan karbon — diberikan dalam format yang boleh dirujuk terus oleh pasukan kelestarian anda.',
        },
      ],
      cta: 'Minta Sebut Harga Pukal',
      ctaHref: '/request-quote?service=bulk-industrial-collection',
      note: 'Dibina untuk pasukan kewangan, perolehan, dan kelestarian yang memerlukan dokumen yang boleh terus diserahkan kepada juruaudit.',
    },

    connectorsStrip: {
      eyebrow: 'Apa Yang Kami Kumpul',
      items: [
        'Telefon & Tablet',
        'Komputer Riba & Komputer',
        'Monitor & Paparan',
        'Peralatan Pejabat & IT',
        'Peranti Storan',
      ],
      fallback: 'Tidak pasti sama ada kami terima?',
      fallbackCtaLabel: 'Tanya kami — kami akan sahkan',
      fallbackCtaHref: '/contact',
    },

    faq: {
      headline: 'Sebelum anda meminta',
      headlineAccent: 'pickup',
      items: [
        {
          question: 'Berapa peranti diperlukan untuk pickup?',
          answer:
            'Pickup rumah di Lembah Klang percuma untuk sekurang-kurangnya 3 peranti. Jika kurang, hubungi pasukan kami untuk membincangkan pilihan anda.',
        },
        {
          question: 'Bila bayaran isi rumah dibuat?',
          answer:
            'Bayaran dibuat serta-merta melalui DuitNow semasa peranti rumah anda dikutip. Bincangkan peranti anda dengan pasukan kami terlebih dahulu; kutipan perniagaan mengikut sebut harga.',
        },
        {
          question: 'Tidak pasti peranti anda boleh dikutip?',
          answer:
            'Kongsi jenis dan keadaan peranti dengan pasukan kami. FAQ penuh menerangkan peranti yang diterima, urusan kutipan dan dokumen perniagaan.',
        },
      ],
      seeMoreLabel: 'Lihat semua soalan lazim e-waste',
      seeMoreHref: '/faq',
    },

    finalCta: {
      eyebrow: 'Sedia Bila-Bila Masa',
      headline:
        'Kutipan Percuma Untuk Anda. Pelupusan Bertauliah Untuk Perniagaan Anda.',
      subtext:
        'Sama ada 3 peranti lama atau segudang peralatan yang telah bersara, Recycling Hub menguruskan kutipan, sijil, dan dokumen. Minta sebut harga pukal atau WhatsApp kami — kedua-duanya, anda akan mendapat jawapan dalam masa 24 jam.',
      cta: 'Minta Sebut Harga Pukal',
      ctaHref: '/request-quote?service=bulk-industrial-collection',
      whatsapp: 'WhatsApp Kami',
      note: 'Tiada komitmen diperlukan · Sebut harga dalam masa 24 jam · Kutipan individu sentiasa percuma',
    },
  },

  services: {
    pageMeta: {
      'collection-pickup': {
        title: 'Pickup e-waste rumah | Recycling Hub',
        description:
          'Pickup e-waste rumah percuma di Lembah Klang untuk minimum 3 peranti, dengan bayaran DuitNow serta-merta. Kongsi senarai peranti anda melalui WhatsApp.',
      },
      'bulk-industrial-collection': {
        title: 'Kutipan e-waste pukal | Recycling Hub',
        description:
          'Aturkan kutipan e-waste pukal untuk peralatan IT pejabat di Lembah Klang. Bincangkan pemusnahan data dan dokumen. Minta sebut harga melalui WhatsApp.',
      },
      'certified-data-destruction': {
        title: 'Pemusnahan data bertauliah | Recycling Hub',
        description:
          'Minta pemusnahan data bertauliah untuk peranti perniagaan di Lembah Klang. Sahkan kaedah dan dokumentasi sebelum kutipan. Hubungi kami melalui WhatsApp.',
      },
      'esg-reporting': {
        title: 'Rekod kutipan e-waste | Recycling Hub',
        description:
          'Tanya tentang rekod kutipan e-waste untuk pelaporan kelestarian perniagaan anda. Sahkan maklumat dan format dokumen yang tersedia melalui WhatsApp kami.',
      },
      'material-recovery': {
        title: 'Kitar semula elektronik | Recycling Hub',
        description:
          'Aturkan kitar semula elektronik di Lembah Klang dengan pickup rumah percuma untuk minimum 3 peranti dan bayaran DuitNow. Hubungi kami melalui WhatsApp.',
      },
      'compliance-documentation': {
        title: 'Dokumentasi kutipan perniagaan | Recycling Hub',
        description:
          'Minta dokumentasi kutipan e-waste perniagaan di Lembah Klang. Sahkan keperluan rekod organisasi anda sebelum kutipan. Minta sebut harga melalui WhatsApp.',
      },
    },
    supportHeading: {
      eyebrow: 'Sokongan kutipan perniagaan',
      headline: 'Dokumentasi dan rekod pelaporan',
    },

    pickupMeta: {
      title: 'Pickup e-waste di rumah | Recycling Hub',
      description:
        'Minta pickup e-waste di rumah di Lembah Klang untuk minimum 3 peranti. Kutipan percuma dengan bayaran DuitNow serta-merta. Hubungi kami untuk kutipan.',
    },

    intent: {
      heading: 'Pelupusan e-waste untuk rumah dan perniagaan',
      description:
        'Untuk kutipan rumah, beritahu kami tentang laptop, telefon, komputer atau monitor lama anda. Tanya tentang pengecas dan kabel semasa membuat tempahan. Kutipan perniagaan memerlukan sebut harga mengikut peralatan dan kuantiti.',
      dataLink: 'Pemusnahan data bertauliah di Malaysia',
      bulkLink: 'Kutipan e-waste pukal untuk perniagaan',
      quoteLink: 'Minta sebut harga pickup e-waste',
    },

    hero: {
      eyebrow: 'Apa yang kami lakukan',
      headline: 'Perkhidmatan kutipan e-waste',
      headlineAccent: '',
      description:
        'Perkhidmatan kutipan e-waste kami merangkumi pickup di rumah di Lembah Klang dan kutipan pukal untuk perniagaan. Pickup rumah percuma dengan minimum 3 peranti. Untuk peralatan pejabat, tanya tentang pemusnahan data bertauliah, pemulihan bahan dan dokumen pematuhan.',
    },
    trustBar: [
      'Pickup rumah percuma di Lembah Klang',
      'Pemusnahan data bertauliah untuk perniagaan',
    ],
    crossLink: {
      text: 'Perkhidmatan menerangkan apa yang kami lakukan. Cari pendekatan untuk organisasi anda:',
      cta: 'Lihat penyelesaian e-waste mengikut sektor',
      href: '/solutions',
    },
    gridHeading: {
      ourServices: {
        eyebrow: 'Perkhidmatan kami',
        headline: 'Kutipan, pemusnahan data dan dokumentasi',
      },
      exploreMore: { eyebrow: 'Terokai Lagi', headline: 'Perkhidmatan Lain' },
    },
    whatsIncludedHeading: 'Apa Yang Disertakan',
    learnMore: 'Ketahui lebih lanjut',
    freeIndividualNote: {
      prefix:
        'Ingin melupuskan sekurang-kurangnya 3 peranti peribadi? Kutipan individu adalah percuma di seluruh Klang Valley — ',
      linkText: 'tempah terus melalui WhatsApp',
      suffix: ', tiada sebut harga diperlukan.',
    },
    visualPlaceholders: {
      photos: 'Foto sebelum/selepas kutipan — akan ditambah apabila tersedia',
      certificate:
        'Contoh sijil pemusnahan — akan ditambah apabila templat dimuktamadkan',
    },
    cards: {
      'collection-pickup': {
        title: 'Pickup e-waste rumah',
        summary:
          'Pickup rumah percuma di Lembah Klang untuk minimum 3 peranti, dengan bayaran DuitNow serta-merta.',
      },
      'bulk-industrial-collection': {
        title: 'Kutipan e-waste perniagaan & pukal',
        summary:
          'Kutipan mengikut sebut harga untuk pejabat dan organisasi yang melupuskan komputer, monitor dan peralatan IT.',
      },
      'certified-data-destruction': {
        title: 'Pemusnahan data bertauliah',
        summary:
          'Pemusnahan data peranti perniagaan, dengan kaedah pengendalian dan keperluan dokumentasi disahkan sebelum kutipan.',
      },
      'esg-reporting': {
        title: 'Rekod kutipan & kelestarian',
        summary:
          'Bincangkan rekod kutipan yang tersedia untuk pelaporan kelestarian dalaman organisasi anda.',
      },
      'material-recovery': {
        title: 'Kitar semula elektronik',
        summary:
          'Aturkan kitar semula peranti elektronik lama dan bincangkan keperluan pengendalian mengikut jenis peranti.',
      },
      'compliance-documentation': {
        title: 'Dokumentasi kutipan perniagaan',
        summary:
          'Sahkan dokumen kutipan dan pemusnahan data yang organisasi anda perlukan sebelum mengatur pickup.',
      },
    } satisfies Record<ServiceSlug, { title: string; summary: string }>,
    detail: {
      'collection-pickup': {
        description:
          'Aturkan kutipan telefon, laptop, komputer dan peranti elektronik lama anda di Lembah Klang. Pickup rumah percuma untuk minimum 3 peranti. Kongsi jenis peranti dan alamat melalui WhatsApp supaya pasukan kami boleh mengesahkan penerimaan dan urusan kutipan.',
        included: [
          'Minimum 3 peranti untuk pickup rumah percuma',
          'Kongsi jenis, keadaan peranti dan alamat kutipan',
          'Bayaran DuitNow serta-merta semasa kutipan',
          'Masa kutipan disahkan bersama pasukan kami',
        ],
        trust: {
          title: 'Sebelum pickup',
          description:
            'Tanya tentang penerimaan terlebih dahulu untuk barang luar biasa, perkakas atau peranti yang rosak.',
        },
      },
      'bulk-industrial-collection': {
        description:
          'Rancang kutipan e-waste perniagaan mengikut peralatan yang hendak dilupuskan. Kongsi inventori, anggaran kuantiti dan alamat kutipan di Lembah Klang. Pasukan kami akan mengesahkan skop, akses dan harga sebelum kutipan.',
        included: [
          'Sahkan inventori komputer, monitor dan peralatan IT pejabat',
          'Sebut harga mengikut peralatan, kuantiti dan keperluan kutipan',
          'Bincangkan akses bangunan dan urusan pemuatan',
          'Minta pemusnahan data dan dokumentasi bersama sebut harga',
        ],
        trust: {
          title: 'Sahkan skop kutipan',
          description:
            'Keperluan kutipan sekali atau berulang boleh dibincangkan melalui WhatsApp. Jadual berulang hanya ditetapkan selepas persetujuan.',
        },
      },
      'certified-data-destruction': {
        description:
          'Perniagaan boleh meminta pemusnahan data bertauliah apabila melupuskan peralatan yang menyimpan data. Nyatakan peranti atau media storan yang terlibat dan bukti yang organisasi anda perlukan. Sahkan kaedah pengendalian, skop dan dokumentasi sebelum kutipan.',
        included: [
          'Senaraikan peranti dan media storan yang terlibat',
          'Terangkan keperluan pengendalian data organisasi anda',
          'Sahkan kaedah pemusnahan sebelum penyerahan',
          'Persetujui dokumentasi yang diperlukan dalam sebut harga',
        ],
        trust: {
          title: 'Persetujui bukti yang diperlukan',
          description:
            'Sahkan format sijil, butiran setiap aset dan standard yang diminta dengan pasukan kami sebelum kutipan.',
        },
      },
      'esg-reporting': {
        description:
          'Jika organisasi anda memerlukan rekod untuk pelaporan kelestarian dalaman, nyatakan maklumat yang diperlukan semasa meminta kutipan perniagaan. Pasukan kami akan mengesahkan rekod kutipan dan maklumat sokongan yang boleh disediakan.',
        included: [
          'Terangkan tujuan dan tempoh pelaporan',
          'Tanya butiran peranti atau kutipan yang tersedia',
          'Sahkan format dan skop sebelum kutipan',
        ],
        trust: {
          title: 'Sokongan rekod yang dipersetujui',
          description:
            'Sahkan maklumat yang tersedia untuk kutipan anda dan cara pasukan anda akan menggunakannya dalam rekod kelestarian dalaman.',
        },
      },
      'material-recovery': {
        description:
          'Aturkan kitar semula elektronik sebagai sebahagian daripada kutipan rumah atau perniagaan. Kongsi jenis, keadaan peranti dan keperluan pengendalian sebelum pickup. Bincangkan laluan kitar semula dengan pasukan kami tanpa menganggap semua peranti digunakan semula atau semua bahan dipulihkan.',
        included: [
          'Sahkan penerimaan peranti elektronik anda',
          'Maklumkan bateri, barang rosak atau keperluan pengendalian lain',
          'Bincangkan urusan kitar semula dengan pasukan kutipan',
        ],
        trust: {
          title: 'Tanya tentang laluan kitar semula',
          description:
            'Tanya tentang urusan kitar semula bagi kutipan anda, termasuk peralatan yang memerlukan pengendalian berasingan.',
        },
      },
      'compliance-documentation': {
        description:
          'Kutipan perniagaan boleh merangkumi dokumentasi yang dipersetujui untuk rekod organisasi anda. Terangkan keperluan perolehan, pemusnahan data atau dokumen pelupusan semasa meminta sebut harga supaya pasukan kami boleh mengesahkan dokumen yang tersedia.',
        included: [
          'Senaraikan dokumen yang organisasi anda perlukan',
          'Sahkan rekod yang termasuk dalam sebut harga',
          'Tanya cara meminta rekod selepas kutipan',
        ],
        trust: {
          title: 'Sahkan dokumen sebelum tempahan',
          description:
            'Sahkan skop, format dan urusan penyerahan dokumen dengan pasukan kami sebelum tempahan.',
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
      eyebrow: 'Sumber',
      headline:
        'Panduan untuk Pelupusan E-Sisa yang Mematuhi dan Didokumentasikan.',
      description:
        'Jawapan jelas tentang pendaftaran DOE, pematuhan SW110, pemusnahan data, dan segala-galanya yang menjadikan kutipan lebih daripada sekadar mengambil.',
    },
    gridHeading: {
      ourResources: { eyebrow: 'Panduan', headline: 'Mula Di Sini' },
      exploreMore: { eyebrow: 'Terokai Lagi', headline: 'Panduan Lain' },
    },
    learnMore: 'Baca panduan',
    ctaLabel: 'Hubungi Kami',
    cards: {
      'doe-registration-explained': {
        title: 'Apa Maksud Pendaftaran DOE untuk Anda',
        summary:
          'Mengapa pendaftaran DOE Recycling Hub penting, dan apa yang ia lindungi anda daripada apabila anda menyerahkan e-sisa.',
      },
      'sw110-compliance-for-businesses': {
        title: 'Pematuhan SW110 untuk Perniagaan',
        summary:
          'Apa maksud klasifikasi sisa terjadual SW110 untuk pejabat, gudang, dan kilang yang menjana e-sisa.',
      },
      'certified-data-destruction-guide': {
        title: 'Bagaimana Pemusnahan Data Bertauliah Berfungsi',
        summary:
          'Apa yang sebenarnya berlaku kepada data pada telefon, komputer riba, dan cakera keras lama anda sebelum ia dikitar semula.',
      },
      'esg-reporting-for-ewaste': {
        title: 'Pelaporan ESG & Kelestarian untuk E-Sisa',
        summary:
          'Bagaimana data kutipan e-sisa bertukar menjadi sesuatu yang boleh dimasukkan terus oleh pasukan kelestarian anda ke dalam pendedahan ESG.',
      },
      'preparing-devices-for-pickup': {
        title: 'Cara Menyediakan Peranti Anda untuk Kutipan',
        summary:
          'Senarai semak praktikal sebelum kutipan pintu rumah percuma anda di Klang Valley, supaya kutipan berjalan lancar dan data anda kekal milik anda.',
      },
      'understanding-your-certificate': {
        title: 'Memahami Sijil Kitar Semula Anda',
        summary:
          'Apa yang terkandung dalam sijil Recycling Hub, dan cara menggunakannya untuk rekod anda sendiri atau audit.',
      },
    } satisfies Record<ResourceSlug, { title: string; summary: string }>,
    detail: {
      'doe-registration-explained': {
        description:
          'Bukan setiap syarikat yang mengumpul peranti elektronik lama dibenarkan secara sah untuk berbuat demikian. Recycling Hub ialah pengumpul e-sisa berdaftar DOE, bermakna aktiviti pengumpulan kami dibenarkan dan bertanggungjawab di bawah Jabatan Alam Sekitar Malaysia — bukan dijalankan melalui saluran skrap tidak formal.',
        keyPoints: [
          'Pendaftaran DOE membenarkan kami mengumpul e-sisa sebagai sisa terkawal, bukan skrap am',
          'Setiap kutipan — individu atau pukal — dijalankan di bawah status berdaftar ini, bukan pusingan kutipan tidak formal',
          'Bekerja dengan pengumpul tidak berdaftar meninggalkan anda tanpa rekod bertulis jika peranti anda, atau data di dalamnya, berakhir di tempat yang tidak sepatutnya',
          'Perniagaan memerlukan ini untuk tujuan audit — dokumen mematuhi DOE dikeluarkan bagi setiap kutipan sisa terjadual',
        ],
        takeaway:
          'Jika pengumpul tidak dapat menunjukkan bukti pendaftaran DOE, itu adalah risiko pematuhan dan keselamatan data, bukan sekadar formaliti.',
      },
      'sw110-compliance-for-businesses': {
        description:
          'Kutipan e-sisa pukal dan perindustrian bukan sekadar kutipan berskala besar — ia dijalankan di bawah klasifikasi sisa terjadual SW110, di bawah Akta Kualiti Alam Sekeliling 1974 Malaysia dan peraturan subsidiarinya. Klasifikasi itulah yang menjadikan kutipan pukal boleh diaudit.',
        keyPoints: [
          'SW110 mengawal bagaimana sisa elektronik terjadual mesti dikumpul, diangkut, dan dilupuskan oleh pengendali berlesen',
          'Nota konsainan dikeluarkan bagi setiap kutipan SW110 — dokumen yang akan diminta oleh juruaudit',
          'Ini berbeza daripada aturan bawa-pergi tidak formal, yang tidak meninggalkan sebarang rekod pematuhan',
          'Kutipan berulang dijadualkan mengikut jumlah operasi anda, bukan kutipan sekali sahaja yang dipersembahkan sebagai pematuhan',
        ],
        takeaway:
          'Jika perniagaan anda menjana e-sisa secara berkala, pematuhan SW110 adalah apa yang menjadikan pelupusan sesuatu yang boleh anda tunjukkan semasa audit.',
      },
      'certified-data-destruction-guide': {
        description:
          'Sebarang peranti membawa data yang kami kumpul melalui pemusnahan bertauliah sebelum dikitar semula — bukan pemadaman perisian yang secara teorinya boleh diterbalikkan, tetapi pemusnahan fizikal media storan itu sendiri, direkodkan dan disijilkan.',
        keyPoints: [
          'Pemusnahan fizikal media storan, bukan pemadaman perisian yang boleh diterbalikkan',
          'Sijil pemusnahan bersiri dikeluarkan bagi setiap aset atau kelompok — dikaitkan dengan peranti tertentu, bukan kenyataan generik',
          'Penjejakan rantaian jagaan mengikuti peranti dari kutipan hingga pemusnahan, jadi tiada apa yang tidak dikira di antaranya',
          'Tersedia sebagai permintaan berasingan untuk peranti tertentu, atau digabungkan dalam mana-mana kutipan',
          'Sijil boleh diperoleh semula bila-bila masa melalui Jejak & Kesan',
        ],
        takeaway:
          'Jika pengitar semula tidak dapat mengeluarkan sijil bersiri yang dikaitkan dengan peranti tertentu anda, anda tiada bukti data anda benar-benar dimusnahkan.',
      },
      'esg-reporting-for-ewaste': {
        description:
          'Perniagaan yang mengumpul bersama Recycling Hub menerima laporan pengalihan yang meringkaskan apa yang dikumpul dan apa yang berlaku kepadanya — diformatkan untuk kegunaan terus dalam pendedahan ESG, bukan data mentah yang perlu diformat semula oleh pasukan anda.',
        keyPoints: [
          'Jumlah berat dikumpul dan dikitar semula, dipecahkan mengikut kategori peranti',
          'Pecahan bahan dipulihkan berbanding dialihkan daripada tapak pelupusan',
          'Anggaran kesan karbon bagi kutipan tersebut',
          'Diberikan bagi setiap kutipan, atau dikumpulkan sepanjang tempoh pelaporan (suku tahunan, tahunan) atas permintaan',
          'Setiap kutipan pukal dan perusahaan layak — minta satu bersama sebut harga seterusnya anda',
        ],
        takeaway:
          'Pengalihan e-sisa ialah salah satu item yang paling konkrit dan mudah dibuktikan yang boleh anda bawa ke dalam laporan ESG.',
      },
      'preparing-devices-for-pickup': {
        description:
          'Kutipan individu adalah percuma di seluruh Klang Valley dan tidak memerlukan dokumen di pihak anda, tetapi beberapa minit persediaan menjadikan kutipan lebih pantas dan lebih selamat untuk data anda.',
        keyPoints: [
          'Sandarkan apa-apa yang anda ingin simpan — peranti dikumpul untuk pemusnahan bertauliah, bukan dipulangkan',
          'Log keluar daripada akaun dan keluarkan kad SIM/memori jika boleh, walaupun pemusnahan bertauliah menguruskan data dalam apa jua keadaan',
          'Kumpulkan peranti bersama supaya pasukan kami dapat mengesahkan kategori dan bilangan di depan pintu',
          'Sediakan peranti pada masa yang dijadualkan — kutipan disahkan terlebih dahulu, bukan lawatan tanpa notis',
          'Pembayaran DuitNow segera dibuat pada titik kutipan bagi peranti peribadi yang layak',
        ],
        takeaway:
          'Anda tidak perlu melakukan apa-apa yang rumit — cuma sediakan peranti anda dan butiran bank untuk DuitNow.',
      },
      'understanding-your-certificate': {
        description:
          'Setiap kutipan menjana dokumentasi — nota konsainan, sijil pemusnahan jika peranti membawa data terlibat, dan dokumen mematuhi DOE yang boleh anda serahkan terus kepada juruaudit.',
        keyPoints: [
          'Nota konsainan dikeluarkan bagi setiap kutipan sisa terjadual',
          'Sijil pemusnahan disertakan bagi sebarang aset membawa data, bersiri dan dikaitkan dengan peranti tertentu yang dimusnahkan',
          'Dokumen kutipan dan pelupusan mematuhi DOE disimpan untuk rekod anda',
          'Dokumentasi diberikan pada masa kutipan atau sejurus selepasnya',
          'Dokumentasi lampau boleh diperoleh semula bila-bila masa melalui Jejak & Kesan, bukan hanya pada masa kutipan',
        ],
        takeaway:
          'Simpan sijil anda — ia adalah bukti pelupusan yang mematuhi dan didokumentasikan jika sesiapa bertanya.',
      },
    } satisfies Record<
      ResourceSlug,
      { description: string; keyPoints: string[]; takeaway: string }
    >,
  },

  solutions: {
    meta: {
      title: 'Penyelesaian e-waste perniagaan | Recycling Hub',
      description:
        'Terokai penyelesaian e-waste untuk perniagaan dan isi rumah di Lembah Klang. Sediakan peranti, akses dan rekod kutipan. Hubungi kami melalui WhatsApp.',
    },

    relatedServiceHeading: 'Perkhidmatan berkaitan',

    pageMeta: {
      'corporate-enterprise': {
        title: 'Pelupusan IT pejabat | Recycling Hub',
        description:
          'Rancang pelupusan IT pejabat di Lembah Klang dengan senarai aset dan butiran akses bangunan. Bincangkan skop dan harga kutipan melalui WhatsApp kami.',
      },
      'individuals-households': {
        title: 'Kitar semula elektronik rumah | Recycling Hub',
        description:
          'Sedia untuk kitar semula elektronik rumah di Lembah Klang: minimum 3 peranti, pickup percuma dan bayaran DuitNow. Aturkan kutipan melalui WhatsApp kami.',
      },
      'government-glc': {
        title: 'Persediaan pelupusan IT sektor awam | Recycling Hub',
        description:
          'Sediakan pelupusan IT sektor awam dengan kelulusan aset dan keperluan dokumen. Sahkan skop kutipan di Lembah Klang. Hubungi kami melalui WhatsApp hari ini.',
      },
      education: {
        title: 'Pengosongan elektronik sekolah | Recycling Hub',
        description:
          'Rancang pengosongan elektronik sekolah di Lembah Klang dengan inventori bilik dan masa akses. Bincangkan kutipan serta keperluan data melalui WhatsApp.',
      },
      healthcare: {
        title: 'Pelupusan IT kesihatan | Recycling Hub',
        description:
          'Rancang pelupusan IT kesihatan di Lembah Klang dengan kelulusan dalaman, semakan peranti dan keperluan data. Bincangkan skop kutipan melalui WhatsApp kami.',
      },
      ngo: {
        title: 'Pengosongan elektronik NGO | Recycling Hub',
        description:
          'Urus pengosongan elektronik NGO di Lembah Klang dengan penyelaras, senarai peranti dan lokasi penyerahan. Sahkan harga dan masa melalui WhatsApp kami.',
      },
    },

    householdMeta: {
      title: 'Kitar semula elektronik rumah | Recycling Hub',
      description:
        'Kitar semula elektronik rumah di Lembah Klang dengan pickup percuma untuk minimum 3 peranti dan bayaran DuitNow serta-merta. Hubungi kami untuk kutipan.',
    },
    hero: {
      eyebrow: 'Siapa yang kami bantu',
      headline: 'Penyelesaian e-waste untuk perniagaan',
      headlineAccent: 'dan isi rumah',
      description:
        'Pilih panduan yang sesuai untuk organisasi atau rumah anda. Setiap penyelesaian menerangkan persediaan, pegawai yang perlu dilibatkan dan perkhidmatan untuk dibincangkan sebelum kutipan di Lembah Klang.',
    },
    crossLink: {
      text: 'Bersedia memilih keperluan anda?',
      cta: 'Bandingkan perkhidmatan kutipan e-waste',
      href: '/services',
    },
    gridHeading: {
      ourSegments: {
        eyebrow: 'Segmen Kami',
        headline: 'Penyelesaian untuk Setiap Sektor',
      },
      exploreMore: { eyebrow: 'Terokai Lagi', headline: 'Penyelesaian Lain' },
    },
    whyUsHeadingPrefix: 'Persediaan untuk',
    whyUsHeadingSuffix: '',
    learnMore: 'Ketahui lebih lanjut',
    cards: {
      'corporate-enterprise': {
        title: 'Pelupusan IT pejabat',
        summary:
          'Rancang pengosongan peralatan pejabat dengan inventori, pegawai bertanggungjawab dan urusan akses yang dipersetujui.',
      },
      'individuals-households': {
        title: 'Kitar semula elektronik rumah',
        summary:
          'Sediakan minimum 3 peranti rumah lama untuk pickup dan bincangkan keadaan peranti sebelum kutipan.',
      },
      'government-glc': {
        title: 'Persediaan pelupusan IT sektor awam',
        summary:
          'Urus kelulusan aset dan keperluan dokumen sebelum meminta kutipan peralatan sektor awam.',
      },
      education: {
        title: 'Pengosongan elektronik sekolah & kampus',
        summary:
          'Sediakan peralatan kelas dan pejabat yang dilupuskan untuk kutipan tanpa mengganggu ruang pembelajaran aktif.',
      },
      healthcare: {
        title: 'Pelupusan IT klinik & hospital',
        summary:
          'Rancang penyerahan IT yang dilupuskan mengikut kawalan data dalaman dan keperluan akses premis.',
      },
      ngo: {
        title: 'Pengosongan peranti komuniti & NGO',
        summary:
          'Selaraskan senarai peranti, penyelaras dan lokasi kutipan untuk peranti elektronik lama organisasi anda.',
      },
    } satisfies Record<SolutionSlug, { title: string; summary: string }>,
    detail: {
      'corporate-enterprise': {
        framing:
          'Apabila menggantikan IT pejabat, mulakan dengan peranti yang organisasi anda telah luluskan untuk dilupuskan. Sediakan senarai aset, asingkan peralatan yang masih digunakan dan kenal pasti pegawai yang akan membenarkan penyerahan. Kongsi butiran lokasi di Lembah Klang untuk membincangkan keperluan kutipan.',
        whyUs: [
          'Senaraikan jenis, kuantiti dan rujukan aset',
          'Sahkan kelulusan dalaman dan pegawai penyerahan',
          'Semak akses pemuatan, lif dan sekatan bangunan',
          'Nyatakan keperluan data dan rekod sebelum meminta sebut harga',
        ],
        serviceSlug: 'bulk-industrial-collection',
        serviceLabel: 'Kutipan e-waste perniagaan & pukal',
        ctaLabel: 'Minta sebut harga kutipan pejabat',
      },
      'individuals-households': {
        framing:
          'Kumpulkan peranti elektronik lama yang hendak dikeluarkan dari rumah dan pastikan sekurang-kurangnya 3 peranti tersedia untuk pickup rumah percuma di Lembah Klang. Beritahu pasukan kami jenis peranti dan alamat anda. Sandarkan fail peribadi dan log keluar daripada akaun sebelum menyerahkan peranti.',
        whyUs: [
          'Sahkan penerimaan dan keadaan peranti dengan pasukan kami',
          'Sediakan minimum 3 peranti rumah untuk pickup',
          'Keluarkan kad SIM dan sandarkan fail yang ingin disimpan',
          'Maklumkan akses kondominium atau peraturan kutipan bangunan',
        ],
        serviceSlug: 'collection-pickup',
        serviceLabel: 'Pickup e-waste rumah',
        ctaLabel: 'Aturkan pickup rumah',
      },
      'government-glc': {
        framing:
          'Agensi awam dan syarikat berkaitan kerajaan mungkin memerlukan kelulusan pelupusan aset sebelum peralatan boleh keluar dari premis. Kenal pasti pegawai pelulus, rujukan inventori dan maklumat vendor yang diperlukan. Minta pasukan kami mengesahkan sama ada skop kutipan dan keperluan dokumen boleh dipenuhi.',
        whyUs: [
          'Ikut proses kelulusan pelupusan aset organisasi anda',
          'Sediakan inventori dan kenal pasti pegawai yang diberi kuasa',
          'Nyatakan maklumat vendor dan dokumen yang diminta',
          'Persetujui akses premis dan urusan penyerahan sebelum kutipan',
        ],
        serviceSlug: 'compliance-documentation',
        serviceLabel: 'Dokumentasi kutipan perniagaan',
        ctaLabel: 'Bincangkan kutipan sektor awam',
      },
      education: {
        framing:
          'Untuk pengosongan sekolah atau kampus, asingkan peralatan yang dilupuskan daripada peranti yang masih digunakan oleh pelajar dan kakitangan. Sediakan inventori mengikut bilik atau jabatan, kenal pasti pegawai sekolah dan cadangkan masa kutipan yang tidak mengganggu kelas. Pasukan kami akan mengesahkan ketersediaan sebelum tarikh dipersetujui.',
        whyUs: [
          'Asingkan peralatan yang dilupuskan daripada peranti kelas aktif',
          'Rekod peralatan mengikut bilik, makmal atau jabatan',
          'Kenal pasti peranti yang mungkin menyimpan rekod pelajar atau kakitangan',
          'Cadangkan masa akses dan sahkan ketersediaan',
        ],
        serviceSlug: 'bulk-industrial-collection',
        serviceLabel: 'Kutipan e-waste perniagaan & pukal',
        ctaLabel: 'Minta sebut harga kutipan kampus',
      },
      healthcare: {
        framing:
          'Apabila melupuskan IT klinik atau hospital, libatkan pegawai IT dan perlindungan data organisasi sebelum mengatur kutipan. Kenal pasti peralatan yang menyimpan data dan sahkan peranti yang diluluskan untuk penyerahan. Kongsi jenis peralatan terlebih dahulu; penerimaan peralatan perubatan atau khusus perlu disahkan secara berasingan.',
        whyUs: [
          'Sahkan kelulusan dalaman bagi setiap aset IT',
          'Kenal pasti media storan yang mungkin menyimpan rekod pesakit',
          'Bincangkan keperluan pemusnahan data sebelum penyerahan',
          'Sahkan penerimaan peralatan, akses premis dan pegawai penyerahan',
        ],
        serviceSlug: 'certified-data-destruction',
        serviceLabel: 'Pemusnahan data bertauliah',
        ctaLabel: 'Bincangkan kutipan IT kesihatan',
      },
      ngo: {
        framing:
          'Untuk pengosongan peranti NGO atau komuniti, pilih penyelaras yang boleh mengesahkan peralatan yang termasuk dalam kutipan. Asingkan barang untuk sumbangan daripada barang yang dilupuskan, dan tanya tentang penerimaan serta harga sebelum mengumumkan tarikh kutipan.',
        whyUs: [
          'Pilih penyelaras dan lokasi penyerahan yang dipersetujui',
          'Sediakan jenis peranti dan anggaran kuantiti',
          'Asingkan barang sumbangan daripada peralatan yang dilupuskan',
          'Sahkan harga dan masa sebelum berkongsi butiran kutipan',
        ],
        serviceSlug: 'bulk-industrial-collection',
        serviceLabel: 'Kutipan e-waste perniagaan & pukal',
        ctaLabel: 'Bincangkan kutipan komuniti',
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
      eyebrow: 'Hubungi Kami',
      headline: 'Tidak Pasti Sama Ada Anda Memerlukan Ini?',
      headlineAccent: 'Mari Kita Ketahui.',
      description:
        'WhatsApp kami sahaja, atau hantar mesej di bawah. Kami akan bantu anda tentukan sama ada kutipan individu atau kutipan pukal sesuai dengan situasi anda — dan berikan sebut harga jika anda memerlukannya. Tiada komitmen, tiada tekanan.',
    },
    faq: {
      eyebrow: 'Jawapan Pantas',
      headline: 'Sebelum Anda Menghubungi Kami',
      items: [
        {
          question: 'Berapa cepat saya akan mendapat balasan?',
          answer:
            'Kami berusaha membalas semua e-mel dalam masa 24 jam pada hari bekerja. Untuk pertanyaan segera, WhatsApp adalah cara terpantas untuk menghubungi kami — kami biasanya membalas dalam beberapa jam semasa waktu operasi.',
        },
        {
          question: 'Adakah anda menawarkan sokongan dalam Bahasa Malaysia?',
          answer:
            'Ya. Pasukan kami fasih dalam Bahasa Inggeris dan Bahasa Malaysia. Anda dialu-alukan untuk menghubungi kami dalam mana-mana bahasa dan kami akan membalas mengikutnya.',
        },
        {
          question: 'Perlukah saya sediakan apa-apa sebelum menghubungi anda?',
          answer:
            'Tiada persediaan diperlukan. Ia membantu jika anda tahu secara kasar berapa banyak peranti yang ingin dilupuskan dan sama ada untuk kegunaan peribadi atau perniagaan — tetapi jika tidak pun, kami boleh selesaikannya bersama melalui WhatsApp atau e-mel.',
        },
        {
          question: 'Adakah mendapatkan sebut harga ini benar-benar percuma?',
          answer:
            'Ya, sepenuhnya. Tiada kewajipan untuk meneruskan. Hantar butiran anda dan kami akan menyemak situasi anda, menjawab soalan anda, dan memberi gambaran jelas sama ada kutipan individu atau kutipan pukal yang sesuai — ditambah sebut harga jika kutipan pukal berkenaan.',
        },
      ],
    },
    form: {
      heading: 'Hantar Mesej Kepada Kami',
      subheading:
        'Ada soalan, aduan, atau perlukan bantuan memilih perkhidmatan? Jangan teragak-agak untuk menghubungi kami.',
      firstName: 'Nama pertama',
      firstNamePlaceholder: 'Masukkan nama pertama anda',
      lastName: 'Nama akhir',
      lastNamePlaceholder: 'Masukkan nama akhir anda',
      email: 'E-mel',
      emailPlaceholder: 'Masukkan e-mel anda',
      phone: 'Butiran hubungan',
      phonePlaceholder: 'Masukkan nombor hubungan anda',
      subject: 'Subjek',
      subjectPlaceholder: 'Berkaitan apa?',
      message: 'Mesej',
      messagePlaceholder: 'Masukkan mesej anda',
      errorFirstNameRequired: 'Sila masukkan nama pertama anda.',
      errorLastNameRequired: 'Sila masukkan nama akhir anda.',
      errorEmailInvalid: 'Masukkan alamat e-mel yang sah.',
      errorPhoneRequired: 'Sila masukkan nombor hubungan anda.',
      errorPhoneInvalid:
        'Sila masukkan nombor telefon yang sah, cth. 12-345 6789.',
      errorSubjectRequired: 'Sila masukkan subjek.',
      errorMessageRequired: 'Sila masukkan mesej.',
      submitButton: 'Hantar Mesej',
      submittingButton: 'Menghantar…',
      submittedButton: 'Mesej Dihantar',
      successMessage: 'Mesej diterima — kami akan membalas dalam 24 jam.',
      errorMessage: 'Sesuatu tidak kena. Sila cuba lagi.',
      sidePanel: {
        heading: 'Hai! Kami sentiasa di sini untuk membantu anda.',
        hotlineLabel: 'Talian Hotline',
        whatsappLabel: 'WhatsApp',
        emailLabel: 'E-mel',
        connectHeading: 'Ikuti kami',
      },
    },
  },

  faqPage: {
    eyebrow: 'Soalan Lazim',
    headline: 'Soalan lazim kitar semula e-waste',
    headlineAccent: '',
    subtext:
      'Soalan lazim kitar semula e-waste ini menerangkan pickup rumah di Lembah Klang, kutipan perniagaan dan dokumen yang mungkin anda perlukan. Pickup rumah percuma dengan minimum 3 peranti, dengan bayaran DuitNow serta-merta.',
    categories: [
      {
        name: 'Peranti dan kawasan kutipan',
        items: [
          {
            question: 'Apakah e-waste yang diterima?',
            answer:
              'Hubungi kami tentang telefon, tablet, laptop, komputer, monitor dan peralatan IT pejabat. Kongsi senarai atau gambar terlebih dahulu, terutama untuk perkakas atau barang luar biasa, supaya pasukan kami boleh mengesahkan penerimaan.',
          },
          {
            question: 'Di manakah pickup tersedia?',
            answer:
              'Kawasan perkhidmatan kami ialah Lembah Klang. Kongsi alamat kutipan semasa menghubungi kami supaya akses dan urusan kutipan boleh disahkan. Slot pickup tidak dijamin sebelum pengesahan.',
          },
        ],
      },
      {
        name: 'Pickup rumah dan bayaran',
        items: [
          {
            question: 'Adakah pickup e-waste percuma dan ada kuantiti minimum?',
            answer:
              'Pickup e-waste untuk isi rumah di Lembah Klang percuma untuk sekurang-kurangnya 3 peranti setiap kutipan. Kutipan perniagaan atau pukal diberi sebut harga berasingan.',
          },
          {
            question: 'Bagaimana saya dibayar untuk peranti lama?',
            answer:
              'Bayaran isi rumah dibuat serta-merta melalui DuitNow semasa kutipan. Beritahu pasukan kami jenis dan keadaan peranti sebelum pickup. Kami tidak menerbitkan harga tetap untuk setiap peranti.',
          },
          {
            question: 'Bagaimana saya meminta pickup?',
            answer:
              'Gunakan Minta Kutipan atau hubungi pasukan kami melalui WhatsApp. Kongsi jenis peranti dan alamat kutipan. Pasukan kami akan mengesahkan urusan kutipan dengan anda.',
          },
        ],
      },
      {
        name: 'Kutipan perniagaan dan data',
        items: [
          {
            question: 'Bagaimana harga kutipan e-waste pukal ditentukan?',
            answer:
              'Kutipan perniagaan mengikut sebut harga. Kongsi jenis peranti, anggaran kuantiti dan lokasi pickup. Nyatakan jika anda memerlukan pemusnahan data bertauliah atau dokumen pematuhan supaya keperluan itu diambil kira.',
          },
          {
            question: 'Bolehkah perniagaan meminta pemusnahan data bertauliah?',
            answer:
              'Boleh. Pemusnahan data bertauliah tersedia untuk kutipan perniagaan. Bincangkan peranti yang menyimpan data dan keperluan dokumentasi dengan pasukan kami sebelum menjadualkan kutipan.',
          },
          {
            question: 'Dokumen pematuhan apa yang boleh saya minta?',
            answer:
              'Beritahu kami rekod kutipan, pemusnahan data dan pematuhan yang organisasi anda perlukan. Pasukan kami akan mengesahkan dokumen yang termasuk dalam sebut harga sebelum kutipan.',
          },
        ],
      },
      {
        name: 'Rekod kutipan',
        items: [
          {
            question:
              'Bagaimana saya menyemak status kutipan atau meminta sijil?',
            answer:
              'Gunakan Jejak & Kesan dengan nombor rujukan kutipan, jika ada. Jika tiada, terangkan kutipan anda supaya pasukan kami boleh mencari rekod dan mengesahkan dokumen yang tersedia.',
          },
        ],
      },
    ],
  },

  trackTrace: {
    hero: {
      eyebrow: 'Jejak & Kesan',
      headline: 'Minta',
      headlineAccent: 'Sijil atau Status Anda.',
      description:
        'Semak status kutipan atau minta dokumentasi — sijil pemusnahan, laporan pengalihan ESG, atau kemas kini status — dan kami akan menghubungi anda semula.',
    },
    sectionHeading1: {
      eyebrow: 'Apa Yang Anda Boleh Minta',
      headline: 'Dokumentasi untuk Sebarang Kutipan',
      subtext:
        'Sama ada ia kutipan individu percuma atau kutipan perusahaan pukal, anda boleh minta dokumen yang berkaitan dengannya.',
    },
    requestInfo: [
      {
        title: 'Sijil Pemusnahan',
        description:
          'Bukti bersiri bahawa peranti membawa data telah dimusnahkan mengikut piawaian bertauliah — tersedia untuk kutipan pukal dan perusahaan, dan atas permintaan untuk kutipan individu.',
      },
      {
        title: 'Laporan Pengalihan ESG',
        description:
          'Tonaj dikitar semula dan pengalihan daripada tapak pelupusan bagi satu kutipan, diformat untuk pelaporan kelestarian atau penderma anda.',
      },
      {
        title: 'Kemas Kini Status Kutipan',
        description:
          'Tidak pasti status kutipan yang ditempah atau baru-baru ini? Hantar rujukan anda dan kami akan sahkan.',
      },
    ],
    requestTypes: [
      'Sijil Pemusnahan',
      'Laporan Pengalihan ESG',
      'Kemas Kini Status Kutipan',
    ],
    sectionHeading2: {
      eyebrow: 'Hantar Permintaan',
      headline: 'Beritahu Kami Apa Yang Anda Perlukan',
    },
    form: {
      fullName: 'Nama penuh',
      fullNamePlaceholder: 'Nama anda',
      email: 'E-mel',
      phone: 'Telefon (pilihan)',
      phonePlaceholder: '+60 1x-xxx xxxx',
      requestTypeLabel: 'Apa yang anda perlukan?',
      referenceLabel: 'Rujukan tempahan atau kutipan (pilihan)',
      referencePlaceholder:
        'Tiada rujukan? Biarkan kosong dan tambah butiran dalam nota di bawah',
      notesLabel: 'Nota (pilihan)',
      notesPlaceholder:
        'Anggaran tarikh kutipan, alamat, atau apa-apa lagi yang membantu kami mencari kutipan anda',
      errorNameRequired: 'Sila masukkan nama penuh anda.',
      errorEmailInvalid: 'Masukkan alamat e-mel yang sah.',
      submitButton: 'Hantar Permintaan',
      submittedButton: 'Permintaan Dihantar',
      successPrefix: 'Permintaan diterima — kami akan e-melkan ',
      successSuffix: ' anda dalam masa 2 hari bekerja.',
      whatsappNote: 'Lebih suka berbincang terus? WhatsApp kami sahaja.',
    },
    closingNote:
      'Permintaan dikendalikan oleh pasukan kami, bukan sistem automatik — jika nombor rujukan anda sukar dicari, terangkan sahaja kutipan tersebut sebaik mungkin dan kami akan padankan di pihak kami.',
  },

  requestQuote: {
    help: {
      heading: 'Perlukan sebut harga pelupusan aset IT?',
      description:
        'Senaraikan jenis peranti, anggaran kuantiti dan lokasi kutipan di bawah. Teruskan ke WhatsApp, semak mesej yang disediakan dan hantarkannya kepada pasukan pertanyaan umum kami.',
    },
    hero: {
      eyebrow: 'Kutipan perniagaan dan pukal',
      headline: 'Sebut harga pickup e-waste',
      headlineAccent: '',
      description:
        'Minta sebut harga pickup e-waste untuk peranti pejabat atau kutipan pukal di Lembah Klang. Kongsi jenis peralatan dan anggaran kuantiti, serta keperluan pemusnahan data bertauliah atau dokumen pematuhan. Pickup rumah untuk sekurang-kurangnya 3 peranti adalah percuma dan tidak memerlukan sebut harga pukal.',
    },
    form: {
      emailPlaceholder: 'anda@contoh.com',

      fullName: 'Nama penuh',
      fullNamePlaceholder: 'Nama anda',
      email: 'E-mel',
      phone: 'Telefon',
      phonePlaceholder: '+60 1x-xxx xxxx',
      company: 'Syarikat (jika berkenaan)',
      companyPlaceholder: 'Pilihan',
      serviceLabel: 'Perkhidmatan yang anda berminat',
      detailsLabel: 'Jenis peranti & anggaran jumlah',
      detailsPlaceholder:
        'Cth. ~40 desktop dan monitor daripada satu pejabat, penutupan sekali sahaja',
      errorNameRequired: 'Sila masukkan nama penuh anda.',
      errorEmailInvalid: 'Masukkan alamat e-mel yang sah.',
      submitButton: 'Teruskan di WhatsApp',
      submittedButton: 'Buka WhatsApp semula',
      successMessage:
        'Pertanyaan anda disediakan di WhatsApp. Hantar mesej di sana untuk meminta sebut harga; laman ini belum menghantarnya.',
      whatsappNote:
        'Borang ini menyediakan mesej WhatsApp. Anda perlu menghantarnya di sana.',
    },
    footerNote: {
      prefix:
        'Pickup rumah di Lembah Klang percuma untuk sekurang-kurangnya 3 peranti dan tidak memerlukan sebut harga — ',
      linkText: 'minta pickup rumah percuma melalui WhatsApp',
      suffix: '.',
    },
  },

  pickupRequest: {
    hero: {
      eyebrow: 'Kutipan Percuma Ke Rumah',
      headline: 'Minta',
      headlineAccent: 'Kutipan.',
      description:
        'Beritahu kami jenis peranti dan lokasi kutipan. Pickup rumah percuma memerlukan sekurang-kurangnya 3 peranti; pasukan kami akan mengesahkan urusannya.',
    },
    typeSelector: {
      changeOption: 'Tukar jenis permintaan',
      heading: 'Apa yang anda ingin kitar semula?',
      subheading: 'Pilih opsyen yang sesuai, dan kami akan uruskan selebihnya.',
      callback: {
        title: 'Minta Panggilan Balik',
        description:
          'Tinggalkan nombor anda dan kami akan hubungi anda. Pickup rumah memerlukan sekurang-kurangnya 3 peranti.',
      },
      business: {
        title: 'Perniagaan / Pukal',
        description:
          'Dapatkan sebut harga untuk penutupan pejabat, gudang, atau kilang.',
      },
    },
    quickForm: {
      heading: 'Minta Panggilan Balik',
      subheading:
        'Tinggalkan nombor anda dan kami akan hubungi anda. Pickup rumah memerlukan sekurang-kurangnya 3 peranti.',
      phone: 'Telefon',
      phonePlaceholder: 'Masukkan nombor hubungan anda',
      errorPhoneRequired: 'Sila masukkan nombor hubungan anda.',
      errorPhoneInvalid:
        'Sila masukkan nombor telefon yang sah, cth. 12-345 6789.',
      submitButton: 'Minta Panggilan Balik',
      submittingButton: 'Menghantar…',
      successMessage: 'Diterima — kami akan hubungi anda sebentar lagi.',
      errorMessage: 'Sesuatu tidak kena. Sila cuba lagi.',
    },
    form: {
      heading: 'Butiran Permintaan Kutipan',
      subheading:
        'Isikan butiran anda dan kami akan hubungi anda untuk sahkan masa kutipan.',
      fullName: 'Nama penuh',
      fullNamePlaceholder: 'cth. Fatima Ali',
      email: 'E-mel',
      emailPlaceholder: 'Masukkan e-mel anda',
      phone: 'Telefon',
      phonePlaceholder: 'Masukkan nombor hubungan anda',
      pickupAddress: 'Alamat kutipan',
      pickupAddressPlaceholder: 'Alamat di mana bahan perlu dikutip',
      addressVerifiedAt: 'Disahkan di',
      requestedAt: 'Tarikh & masa kutipan',
      requestedAtPlaceholder: 'Pilih tarikh dan masa',
      note: 'Nota',
      notePlaceholder: 'Sebarang perkara lain yang perlu disebut',
      photos: 'Gambar',
      photosHelper:
        'Gambar barang yang perlu kami kutip — sekurang-kurangnya 1, hingga 4 (JPG, PNG atau WebP, 5 MB setiap satu).',
      photosAdd: 'Tambah gambar',
      errorPhotosRequired: 'Sila tambah sekurang-kurangnya satu gambar.',
      errorFullNameRequired: 'Sila masukkan nama penuh anda.',
      errorEmailInvalid: 'Masukkan alamat e-mel yang sah.',
      errorEmailRequired: 'E-mel diperlukan untuk permintaan perniagaan.',
      errorPhoneRequired: 'Sila masukkan nombor hubungan anda.',
      errorPhoneInvalid:
        'Sila masukkan nombor telefon yang sah, cth. 12-345 6789.',
      errorAddressRequired: 'Sila masukkan alamat kutipan.',
      errorRequestedAtRequired: 'Sila pilih tarikh dan masa kutipan.',
      submitButton: 'Hantar Permintaan',
      submittingButton: 'Menghantar…',
      successMessage:
        'Permintaan diterima — kami akan hubungi anda untuk sahkan kutipan.',
      errorMessage: 'Sesuatu tidak kena. Sila cuba lagi.',
    },
  },

  legal: {
    contactLabels: {
      email: 'E-mel:',
      whatsapp: 'WhatsApp:',
      website: 'Laman Web:',
    },
    terms: {
      hero: {
        eyebrow: 'Perundangan',
        headline: 'Terma Perkhidmatan',
        description:
          'Terma yang mengawal penggunaan anda terhadap perkhidmatan kutipan dan pelupusan Recycling Hub.',
      },
      lastUpdatedLine:
        'Kemas kini terakhir: 15 Ogos 2026 · Tarikh berkuat kuasa: 15 Ogos 2026',
      sections: [
        {
          title: '1. Penerimaan Terma',
          blocks: [
            {
              type: 'p',
              text: 'Dengan mengakses laman web kami (recyclinghub.eco), menempah kutipan, atau melibatkan Recycling Hub ("kami") bagi sebarang perkhidmatan, anda bersetuju untuk terikat dengan Terma Perkhidmatan ini. Jika anda tidak bersetuju, sila jangan gunakan laman web atau perkhidmatan kami.',
            },
            {
              type: 'p',
              text: 'Terma ini terpakai kepada individu yang menempah kutipan peribadi dan kepada perniagaan yang melibatkan kami untuk kutipan pukal atau perusahaan. Kami boleh mengemas kini terma ini dari semasa ke semasa; penggunaan berterusan perkhidmatan kami selepas perubahan disiarkan membentuk penerimaan terhadap terma yang disemak.',
            },
          ],
        },
        {
          title: '2. Penerangan Perkhidmatan',
          blocks: [
            {
              type: 'p',
              text: 'Recycling Hub menyediakan kutipan e-sisa berlesen, termasuk:',
            },
            {
              type: 'ul',
              items: [
                'Kutipan percuma di rumah bagi peranti elektronik peribadi daripada individu dalam kawasan Klang Valley, dengan bayaran segera untuk peranti yang layak',
                'Kutipan pukal dan perusahaan berjadual untuk perniagaan, disebut harga mengikut jenis dan jumlah peranti',
                'Pemusnahan data bertauliah bagi sebarang peranti membawa data yang dikutip, sama ada daripada individu atau perniagaan',
                'Pelaporan pengalihan ESG dan kelestarian untuk pelanggan pukal dan perusahaan',
              ],
            },
            {
              type: 'p',
              text: 'Bagi kutipan pukal dan perusahaan, skop, harga, dan jadual yang tepat disahkan dalam sebut harga yang diberikan kepada anda sebelum kutipan dijadualkan.',
            },
          ],
        },
        {
          title: '3. Peranti Diterima dan Pengecualian',
          blocks: [
            {
              type: 'p',
              text: 'Kami menerima telefon dan tablet, komputer riba dan komputer, monitor dan paparan, peralatan pejabat dan IT, serta peranti storan data. Jika anda tidak pasti sama ada sesuatu item diliputi, hubungi kami sebelum menempah dan kami akan mengesahkannya.',
            },
            {
              type: 'p',
              text: 'Kami boleh menolak untuk mengutip item yang bukan e-sisa, yang mengandungi bahan berbahaya di luar skop lesen kami, atau yang tidak didedahkan dengan tepat semasa tempahan. Penolakan sesuatu item tidak memberi anda hak kepada sebarang bayaran bagi item tersebut.',
            },
          ],
        },
        {
          title: '4. Tanggungjawab Anda',
          blocks: [
            {
              type: 'p',
              text: 'Untuk membantu kami melengkapkan kutipan anda dengan selamat dan betul, anda bersetuju untuk:',
            },
            {
              type: 'ul',
              items: [
                'Memberikan maklumat yang tepat tentang peranti yang anda serahkan, termasuk kuantiti, jenis, dan keadaan',
                'Mengesahkan bahawa anda adalah pemilik sah setiap peranti, atau diberi kuasa untuk menyerahkannya bagi tujuan kitar semula',
                'Memastikan peranti mudah diakses secara munasabah pada lokasi dan masa kutipan yang dipersetujui',
                'Jika praktikal, memadam atau membuat sandaran data yang ingin anda simpan sebelum kutipan — walaupun kami melaksanakan pemusnahan bertauliah pada peranti membawa data, kami tidak bertanggungjawab atas data yang tidak anda alihkan terlebih dahulu',
                'Bagi kutipan perniagaan dan perusahaan, memberikan inventori peranti yang tepat untuk menyokong sebut harga dan, jika berkenaan, sijil pemusnahan',
              ],
            },
          ],
        },
        {
          title: '5. Bayaran untuk Kutipan Individu',
          blocks: [
            {
              type: 'p',
              text: 'Kutipan individu adalah percuma, dan peranti yang layak dibayar segera melalui DuitNow pada masa kutipan. Jumlah bayaran adalah berdasarkan penilaian kami terhadap jenis dan keadaan peranti pada ketika kutipan, yang mungkin berbeza daripada sebarang anggaran yang diberikan semasa tempahan jika keadaan sebenar peranti berbeza daripada yang diterangkan.',
            },
            {
              type: 'p',
              text: 'Sesetengah peranti tidak mempunyai nilai jualan semula atau bahan dan akan dikutip serta dikitar semula tanpa sebarang kos kepada anda, tanpa sebarang bayaran sebagai balasan. Kami akan sentiasa mengesahkan perkara ini sebelum melengkapkan kutipan, di mana munasabah untuk berbuat demikian.',
            },
          ],
        },
        {
          title: '6. Bayaran untuk Kutipan Pukal dan Perusahaan',
          blocks: [
            {
              type: 'p',
              text: 'Kutipan pukal dan perusahaan disebut harga secara individu berdasarkan jenis peranti, jumlah, dan keperluan tapak. Jika yuran perkhidmatan dikenakan, terma bayaran — termasuk jumlah, mata wang, dan tarikh matang — dinyatakan dalam sebut harga atau perjanjian perkhidmatan yang diberikan kepada anda sebelum kutipan dijadualkan. Semua harga adalah dalam Ringgit Malaysia (MYR) dan tidak termasuk cukai yang berkenaan melainkan dinyatakan sebaliknya.',
            },
          ],
        },
        {
          title: '7. Penjadualan dan Kutipan',
          blocks: [
            {
              type: 'p',
              text: 'Tempoh kutipan dipersetujui semasa tempahan. Kami akan menghubungi anda jika kami perlu menjadualkan semula. Jika anda tidak berada di lokasi pada masa yang dipersetujui tanpa notis awal, kami mungkin perlu menempah semula kutipan untuk tarikh kemudian.',
            },
          ],
        },
        {
          title: '8. Pemilikan dan Pemusnahan Data Bertauliah',
          blocks: [
            {
              type: 'p',
              text: 'Pemilikan sesuatu peranti berpindah kepada Recycling Hub sebaik sahaja ia dikutip. Sebarang peranti membawa data yang kami kutip diproses melalui pemusnahan bertauliah, sama ada dipadam atau dimusnahkan secara fizikal bergantung kepada peranti dan keadaannya.',
            },
            {
              type: 'p-link',
              prefix:
                'Bagi kutipan perniagaan dan perusahaan, sijil pemusnahan yang merangkumi aset yang dikutip tersedia atas permintaan. Kutipan individu tidak menerima sijil secara automatik, tetapi ia boleh diminta melalui ',
              linkText: 'halaman permintaan sijil',
              suffix: '.',
              href: '/track-trace',
            },
          ],
        },
        {
          title: '9. Penafian Pematuhan Alam Sekitar',
          blocks: [
            {
              type: 'p',
              text: 'Recycling Hub adalah pengumpul e-sisa berdaftar DOE, dan aktiviti kutipan serta pemprosesan kami dijalankan di bawah keperluan sisa terjadual yang berkenaan, termasuk klasifikasi SW110, di bawah Akta Kualiti Alam Sekeliling 1974 Malaysia dan peraturan sampingannya.',
            },
            {
              type: 'p',
              text: 'Walaupun kami mengambil langkah berjaga-jaga yang munasabah untuk memastikan operasi kami kekal mematuhi peraturan, kami tidak bertanggungjawab atas ketepatan maklumat yang anda berikan tentang sesuatu peranti, atau atas sebarang kewajipan kawal selia yang anda ada yang berasingan daripada aktiviti berlesen kami sendiri.',
            },
          ],
        },
        {
          title: '10. Had Liabiliti',
          blocks: [
            {
              type: 'p',
              text: 'Setakat yang dibenarkan sepenuhnya oleh undang-undang Malaysia, Recycling Hub tidak akan bertanggungjawab atas sebarang kerugian tidak langsung, sampingan, atau berbangkit yang timbul daripada penggunaan perkhidmatan kami, termasuk tetapi tidak terhad kepada kehilangan data yang tidak dialihkan sebelum kutipan, atau kerugian yang timbul daripada penerangan peranti yang tidak tepat yang diberikan oleh anda.',
            },
            {
              type: 'p',
              text: 'Jumlah liabiliti kami bagi sebarang tuntutan yang timbul daripada perkhidmatan kami tidak akan melebihi jumlah keseluruhan yang dibayar oleh anda kepada kami (atau, bagi kutipan individu di mana kami membayar anda, nilai bayaran tersebut) dalam tempoh 3 bulan sebelum peristiwa yang menimbulkan tuntutan tersebut.',
            },
          ],
        },
        {
          title: '11. Pembatalan',
          blocks: [
            {
              type: 'p',
              text: 'Anda boleh membatalkan atau menjadualkan semula kutipan yang ditempah tanpa sebarang caj dengan menghubungi kami sebelum tempoh kutipan yang dijadualkan. Bagi kutipan pukal dan perusahaan, terma pembatalan mungkin dinyatakan dalam perjanjian perkhidmatan anda jika deposit atau yuran penjadualan dikenakan.',
            },
          ],
        },
        {
          title: '12. Kerahsiaan',
          blocks: [
            {
              type: 'p',
              text: 'Bagi pelanggan perniagaan dan perusahaan, kami melayan inventori peranti, maklumat tapak, dan sebarang data perniagaan yang dikongsi dengan kami sebagai sulit, dan tidak akan mendedahkannya kepada pihak ketiga kecuali sebagaimana diperlukan untuk melengkapkan kutipan, mengeluarkan sijil, atau mematuhi undang-undang.',
            },
          ],
        },
        {
          title: '13. Undang-Undang Yang Terpakai',
          blocks: [
            {
              type: 'p',
              text: 'Terma Perkhidmatan ini dikawal selia dan ditafsirkan mengikut undang-undang Malaysia. Sebarang pertikaian yang timbul daripada terma ini atau perkhidmatan kami akan tertakluk kepada bidang kuasa eksklusif mahkamah Malaysia.',
            },
          ],
        },
        {
          title: '14. Hubungi Kami',
          blocks: [
            {
              type: 'p',
              text: 'Jika anda mempunyai sebarang soalan tentang Terma Perkhidmatan ini, sila hubungi kami:',
            },
            { type: 'contact-block' },
          ],
        },
      ],
    },
    privacy: {
      hero: {
        eyebrow: 'Perundangan',
        headline: 'Dasar Privasi',
        description:
          'Cara kami mengumpul, menggunakan, dan melindungi maklumat anda.',
      },
      lastUpdatedLine:
        'Kemas kini terakhir: 15 Ogos 2026 · Tarikh berkuat kuasa: 15 Ogos 2026',
      sections: [
        {
          title: '1. Siapa Kami',
          blocks: [
            {
              type: 'p-link',
              prefix:
                'Recycling Hub ("kami") adalah syarikat kutipan dan kitar semula e-sisa berdaftar DOE yang beroperasi di Malaysia, melayani individu dan perniagaan. E-mel hubungan berdaftar kami ialah ',
              linkText: BRAND.email,
              suffix: '.',
              href: `mailto:${BRAND.email}`,
            },
            {
              type: 'p',
              text: 'Dasar Privasi ini menerangkan cara kami mengendalikan data peribadi yang dikumpul melalui laman web kami (recyclinghub.eco), perkhidmatan kutipan kami, dan sebarang komunikasi dengan kami. Kami komited untuk mematuhi Akta Perlindungan Data Peribadi 2010 (PDPA) Malaysia.',
            },
          ],
        },
        {
          title: '2. Maklumat Yang Kami Kumpul',
          blocks: [
            {
              type: 'p',
              text: 'Kami mengumpul maklumat dengan cara berikut:',
            },
            {
              type: 'p-labeled',
              label: 'Maklumat yang anda berikan secara langsung',
              rest: 'nama, alamat kutipan, e-mel, nombor telefon anda, dan butiran tentang peranti yang ingin dikutip, apabila anda menempah kutipan atau meminta sebut harga pukal.',
            },
            {
              type: 'p-labeled',
              label: 'Data kutipan dan peranti',
              rest: 'maklumat tentang peranti yang kami kutip, seperti jenis, kuantiti, dan keadaan, digunakan untuk mengira bayaran, memproses pemusnahan bertauliah, dan, bagi pelanggan perniagaan, menyediakan sijil pemusnahan dan laporan pengalihan ESG.',
            },
            {
              type: 'p-labeled',
              label: 'Maklumat bayaran',
              rest: 'bagi kutipan individu, butiran berkaitan DuitNow yang diperlukan untuk membayar anda bagi peranti yang layak. Bayaran diproses melalui saluran bayaran yang dikawal selia; kami tidak menyimpan kelayakan perbankan penuh anda.',
            },
            {
              type: 'p-labeled',
              label: 'Data penggunaan',
              rest: 'analitik web standard seperti paparan halaman, jenis pelayar, dan sumber rujukan yang dikumpul melalui alat analitik yang dinamakan semula. Tiada maklumat yang boleh mengenal pasti individu dikumpul pada lapisan ini.',
            },
          ],
        },
        {
          title: '3. Cara Kami Menggunakan Maklumat Anda',
          blocks: [
            {
              type: 'p',
              text: 'Kami menggunakan maklumat yang kami kumpul untuk:',
            },
            {
              type: 'ul',
              items: [
                'Menjadualkan, mengesahkan, dan melengkapkan kutipan anda',
                'Membayar anda segera melalui DuitNow bagi peranti yang layak',
                'Menyediakan sijil pemusnahan dan laporan pengalihan ESG untuk pelanggan perniagaan dan perusahaan',
                'Membalas pertanyaan dan permintaan sebut harga pukal',
                'Mematuhi kewajipan undang-undang dan kawal selia, termasuk penyimpanan rekod yang diperlukan bagi pengumpul e-sisa berdaftar',
                'Menambah baik perkhidmatan dan pengalaman laman web kami',
              ],
            },
            {
              type: 'p',
              text: 'Kami tidak menjual, menyewa, atau berdagang data peribadi anda kepada pihak ketiga bagi tujuan pemasaran.',
            },
          ],
        },
        {
          title: '4. Penyimpanan Data',
          blocks: [
            {
              type: 'p',
              text: 'Kami menyimpan data peribadi anda selama yang diperlukan untuk memenuhi tujuan yang dinyatakan dalam dasar ini, atau sebagaimana dikehendaki oleh undang-undang. Ini termasuk menyimpan rekod kutipan dan sijil untuk tempoh yang munasabah bagi menyokong sebarang permintaan sijil pada masa hadapan atau keperluan audit, khususnya bagi pelanggan perniagaan dan perusahaan.',
            },
            {
              type: 'p',
              text: 'Rekod hubungan dan pertanyaan am disimpan sehingga 3 tahun bagi tujuan perniagaan yang sah, selepas itu ia akan dipadam atau dinamakan semula.',
            },
          ],
        },
        {
          title: '5. Keselamatan Data',
          blocks: [
            {
              type: 'p',
              text: 'Kami melaksanakan langkah teknikal dan organisasi yang sesuai untuk melindungi data anda daripada akses, pendedahan, pengubahan, atau pemusnahan yang tidak dibenarkan. Butiran bayaran dikendalikan melalui saluran bayaran yang dikawal selia dan disulitkan, dan data peranti atau perniagaan yang dikongsi bagi kutipan pukal dilayan sebagai sulit.',
            },
            {
              type: 'p',
              text: 'Tiada kaedah penghantaran melalui internet yang selamat 100%. Walaupun kami mengambil setiap langkah berjaga-jaga yang munasabah, kami tidak dapat menjamin keselamatan mutlak.',
            },
          ],
        },
        {
          title: '6. Perkongsian Maklumat',
          blocks: [
            {
              type: 'p',
              text: 'Kami hanya berkongsi maklumat anda dengan pihak ketiga dalam keadaan terhad berikut:',
            },
            {
              type: 'ul-labeled',
              items: [
                {
                  label: 'Penyedia perkhidmatan',
                  rest: 'rakan logistik yang membantu kutipan, dan penyedia pembayaran yang memproses bayaran DuitNow, di bawah kewajipan kerahsiaan.',
                },
                {
                  label: 'Keperluan undang-undang atau kawal selia',
                  rest: 'jika dikehendaki oleh undang-undang, perintah mahkamah, atau pihak berkuasa kerajaan seperti Jabatan Alam Sekitar.',
                },
                {
                  label: 'Pemindahan perniagaan',
                  rest: 'sekiranya berlaku penggabungan atau pengambilalihan, data anda mungkin dipindahkan sebagai sebahagian daripada transaksi tersebut.',
                },
              ],
            },
          ],
        },
        {
          title: '7. Hak Anda Di Bawah PDPA',
          blocks: [
            {
              type: 'p',
              text: 'Di bawah Akta Perlindungan Data Peribadi 2010 Malaysia, anda mempunyai hak untuk:',
            },
            {
              type: 'ul',
              items: [
                'Meminta akses kepada data peribadi anda yang kami simpan',
                'Meminta pembetulan data peribadi yang tidak tepat atau tidak lengkap',
                'Menarik balik kebenaran untuk kami memproses data anda, jika kebenaran adalah asas pemprosesan',
                'Meminta pemadaman data anda, tertakluk kepada kewajipan undang-undang dan penyimpanan rekod kami',
              ],
            },
            {
              type: 'p-link',
              prefix: 'Untuk menggunakan mana-mana hak ini, hubungi kami di ',
              linkText: BRAND.email,
              suffix: '. Kami akan membalas dalam masa 21 hari.',
              href: `mailto:${BRAND.email}`,
            },
          ],
        },
        {
          title: '8. Kuki',
          blocks: [
            {
              type: 'p',
              text: 'Laman web kami menggunakan kuki minimum yang diperlukan untuk fungsi asas dan analitik tanpa nama. Kami tidak menggunakan kuki pengiklanan atau penjejakan. Anda boleh melumpuhkan kuki dalam tetapan pelayar anda, walaupun sesetengah ciri laman web mungkin tidak berfungsi sepenuhnya.',
            },
          ],
        },
        {
          title: '9. Pautan ke Laman Pihak Ketiga',
          blocks: [
            {
              type: 'p',
              text: 'Laman web kami mungkin memaut kepada perkhidmatan luaran seperti DuitNow/PayNet atau halaman media sosial kami. Kami tidak bertanggungjawab atas amalan privasi atau kandungan laman tersebut dan menggalakkan anda menyemak dasar privasi mereka secara berasingan.',
            },
          ],
        },
        {
          title: '10. Perubahan Kepada Dasar Ini',
          blocks: [
            {
              type: 'p',
              text: 'Kami boleh mengemas kini Dasar Privasi ini dari semasa ke semasa. Apabila kami berbuat demikian, kami akan menyemak tarikh "Kemas kini terakhir" di bahagian atas halaman ini. Penggunaan berterusan perkhidmatan kami selepas perubahan disiarkan membentuk penerimaan anda terhadap dasar yang dikemas kini.',
            },
          ],
        },
        {
          title: '11. Hubungi Kami',
          blocks: [
            {
              type: 'p',
              text: 'Jika anda mempunyai sebarang soalan tentang Dasar Privasi ini atau cara kami mengendalikan data anda, sila hubungi kami:',
            },
            { type: 'contact-block' },
          ],
        },
      ],
    },
  },

  auth: {
    login: {
      title: 'Log Masuk',
      subtitle: 'Log masuk ke operasi Recycling Hub.',
      emailLabel: 'E-mel',
      emailPlaceholder: 'anda@recyclinghub.eco',
      passwordLabel: 'Kata Laluan',
      passwordPlaceholder: '••••••••',
      showPassword: 'Papar Kata Laluan',
      hidePassword: 'Sembunyi Kata Laluan',
      forgotPassword: 'Lupa Kata Laluan?',
      submit: 'Log Masuk',
      submitting: 'Sedang Log Masuk…',
      genericError: 'E-mel atau kata laluan tidak sah.',
    },
    verifyOtp: {
      title: 'Masukkan Kod Anda',
      subtitle: 'Kami telah menghantar kod pengesahan 6-digit ke e-mel anda.',
      codeLabel: 'Kod 6-Digit',
      submit: 'Sahkan',
      submitting: 'Sedang Mengesahkan…',
      resend: 'Tidak Menerima Kod? Hantar Semula',
      resendSending: 'Sedang Menghantar…',
      resendSent: 'Kod baharu telah dihantar.',
      resendIn: 'Hantar semula dalam',
      backToLogin: 'Kembali Ke Log Masuk',
      noPendingFlow: 'Sesi log masuk anda telah tamat — sila log masuk semula.',
      genericError: 'Kod tidak sah atau telah tamat tempoh.',
      incompleteCodeError: 'Masukkan semua 6 digit.',
    },
    forgotPassword: {
      title: 'Lupa Kata Laluan Anda?',
      subtitle:
        'Masukkan e-mel anda dan kami akan menghantar pautan untuk menetapkan semula.',
      emailLabel: 'E-mel',
      emailPlaceholder: 'anda@recyclinghub.eco',
      submit: 'Hantar Pautan Tetapan Semula',
      submitting: 'Sedang Menghantar…',
      successTitle: 'Semak E-mel Anda',
      successMessage:
        'Jika akaun itu wujud, kami telah menghantar pautan tetapan semula kata laluan ke e-melnya.',
      backToLogin: 'Kembali Ke Log Masuk',
    },
    resetPassword: {
      title: 'Tetapkan Semula Kata Laluan Anda',
      subtitle: 'Pilih kata laluan baharu untuk akaun anda.',
      passwordLabel: 'Kata Laluan Baharu',
      confirmLabel: 'Sahkan Kata Laluan Baharu',
      submit: 'Tetapkan Semula Kata Laluan',
      submitting: 'Sedang Menetapkan Semula…',
      successTitle: 'Kata Laluan Dikemas Kini',
      successMessage:
        'Kata laluan anda telah ditetapkan semula — anda kini boleh log masuk.',
      signInNow: 'Log Masuk',
      invalidToken:
        'Pautan ini tidak sah atau telah tamat tempoh. Minta pautan baharu di bawah.',
      requestNewLink: 'Minta Pautan Baharu',
      passwordMismatch: 'Kata laluan tidak sepadan.',
    },
    setPassword: {
      title: 'Tetapkan Kata Laluan Anda',
      subtitle:
        'Seorang pentadbir telah mencipta akaun untuk anda di Recycling Hub. Tetapkan kata laluan untuk melengkapkan pengaktifan akaun.',
      passwordLabel: 'Kata Laluan',
      confirmLabel: 'Sahkan Kata Laluan',
      submit: 'Tetapkan Kata Laluan',
      submitting: 'Sedang Menetapkan Kata Laluan…',
      successTitle: 'Akaun Diaktifkan',
      successMessage:
        'Kata laluan anda telah ditetapkan — anda kini boleh log masuk.',
      signInNow: 'Log Masuk',
      invalidToken:
        'Pautan jemputan ini tidak sah atau telah tamat tempoh. Hubungi pentadbir anda untuk pautan baharu.',
      passwordMismatch: 'Kata laluan tidak sepadan.',
    },
    accountLocked: {
      title: 'Akaun Disekat Sementara',
      message:
        'Kami telah menyekat akaun ini buat sementara waktu selepas beberapa percubaan log masuk yang gagal, untuk melindunginya. Sila cuba lagi sebentar lagi.',
      backToLogin: 'Kembali Ke Log Masuk',
    },
    unauthorized: {
      title: 'Anda Tiada Akses Kepada Ini',
      message:
        'Akaun anda tidak mempunyai kebenaran untuk melihat halaman ini.',
      backToDashboard: 'Kembali Ke Papan Pemuka Saya',
    },
  },
};

export { bm };
