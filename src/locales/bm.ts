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
  nav: {
    home: 'Laman Utama',
    pricing: 'Harga',
    about: 'Tentang Kami',
    contact: 'Hubungi Kami',
    whatsapp: 'WhatsApp Kami',
    requestQuote: 'Minta Sebut Harga',
    services: 'Perkhidmatan',
    solutions: 'Penyelesaian',
    resources: 'Sumber',
    viewAllServices: 'Lihat Semua Perkhidmatan',
    viewAllSolutions: 'Lihat Semua Penyelesaian',
  },

  footer: {
    tagline: 'Pengumpulan & Pelupusan E-Sisa Bertauliah untuk Malaysia.',
    servicesHeading: 'Perkhidmatan',
    companyHeading: 'Syarikat',
    legalHeading: 'Perundangan',
    services: [
      { label: 'Kitar Semula & Dapat Bayaran', href: '/contact' },
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
      { label: 'Kenali Pasukan Kami', href: '/about#team' },
      { label: 'Perkhidmatan', href: '/services' },
      { label: 'Sumber', href: '/resources' },
      { label: 'Soalan Lazim', href: '/faq' },
      { label: 'Hubungi Kami', href: '/contact' },
    ],
    legal: [
      { label: 'Dasar Privasi', href: '/privacy' },
      { label: 'Terma Perkhidmatan', href: '/terms' },
    ],
    copyrightLine: 'Hak cipta terpelihara.',
  },

  home: {
    hero: {
      headlinePrefix: 'Perkhidmatan Kitar Semula',
      headlinePill: 'E-Sisa',
      headlineSuffix: 'Berdaftar di Klang Valley, Malaysia',
      subheadline:
        'Recycling Hub mengambil peranti elektronik lama secara percuma di seluruh Klang Valley — untuk isi rumah yang ingin melupuskan peranti lama dan untuk perniagaan yang menutup keseluruhan pejabat. Setiap kutipan berdaftar dengan DOE dan didokumenkan sepenuhnya.',
      cta: 'Tempah Kutipan',
      statCardLabel: 'Akan datang',
      statCardValue: 'Statistik sebenar',
      gradientCardLabel: 'Pelupusan bertauliah',
    },

    trustStrip: {
      label: 'Mengapa isi rumah dan perniagaan Malaysia memilih Recycling Hub',
      stats: [
        { value: 'DOE', label: 'Pengumpul E-Sisa Berdaftar' },
        { value: 'Percuma', label: 'Kutipan di Rumah untuk Individu' },
        { value: 'Segera', label: 'Bayaran DuitNow Semasa Kutipan' },
        { value: 'SW110', label: 'Kutipan Perusahaan Mematuhi SW110' },
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
      eyebrow: 'Mengapa Recycling Hub',
      headline:
        'Cara Mematuhi Peraturan untuk Melupuskan Peranti Elektronik Lama',
      subtext:
        'Peraih besi buruk atau bilik simpanan tidak akan memadam data anda, mendokumenkan kutipan, atau memastikannya tidak berakhir di tapak pelupusan. Recycling Hub mengendalikan keseluruhan proses — berlesen, bertauliah, dan didokumenkan — untuk individu mahupun perniagaan.',
      features: [
        {
          icon: 'shield',
          title: 'Berlesen Di Bawah DOE & SW110 — Setiap Kutipan Didokumenkan',
          body: 'Recycling Hub mengumpul dan memproses e-sisa di bawah lesen DOE yang berdaftar dan mematuhi peraturan sisa terjadual SW110. Setiap kutipan direkod, dijejaki, dan disokong dokumen yang boleh anda serahkan kepada juruaudit.',
        },
        {
          icon: 'plug',
          title: 'Satu Rakan Kongsi, Sama Ada Satu Telefon atau Sebuah Pejabat',
          body: 'Sebuah komputer riba lama atau penutupan pejabat sepenuhnya — Recycling Hub menjalankan proses berlesen dan didokumenkan yang sama dalam kedua-dua keadaan. Anda tidak perlu vendor berasingan untuk jumlah peribadi dan perusahaan.',
        },
        {
          icon: 'lock',
          title: 'Pemusnahan Bertauliah. Sifar Pemulihan Data.',
          body: 'Setiap peranti yang membawa data melalui proses pemusnahan bertauliah dengan sijil bersiri. Recycling Hub tidak menjual semula atau menyimpan peranti anda yang membawa data — pemusnahan disahkan, bukan diandaikan.',
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
            'Tempah kutipan dalam kurang seminit — untuk satu peranti atau seratus.',
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
            'Sesuai untuk satu peranti atau pembersihan penuh',
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
          subtitle: 'Percuma, Tiada Minimum',
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
          'Tiada minimum, tiada dokumen',
        ],
        cta: 'Tempah Kutipan',
        ctaHref: '/contact',
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
            'Tiada bilangan minimum peranti diperlukan',
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
      headline: 'Soalan',
      headlineAccent: 'Lazim',
      items: [
        {
          question:
            'Adakah terdapat bilangan minimum peranti untuk kutipan percuma?',
          answer:
            'Tiada — sama ada satu telefon lama atau satu laci penuh peranti, kutipan individu adalah percuma di seluruh Klang Valley dan disertakan bayaran DuitNow segera. Tiada akaun atau kontrak diperlukan.',
        },
        {
          question: 'Bagaimana saya dibayar untuk peranti lama saya?',
          answer:
            'Kutipan individu dibayar segera melalui DuitNow, sejurus peranti anda dikutip — tiada tempoh menunggu, tiada permintaan bayaran manual. Kutipan pukal dan perusahaan adalah berasaskan sebut harga dan bukan dibayar, kerana fokusnya adalah pelupusan mematuhi peraturan dan dokumentasi.',
        },
        {
          question:
            'Adakah Recycling Hub benar-benar berlesen untuk mengendalikan e-sisa?',
          answer:
            'Ya — kutipan dan pemprosesan dijalankan di bawah lesen DOE yang berdaftar dan mematuhi peraturan sisa terjadual SW110, bukan operasi tidak formal atau tidak berlesen.',
        },
      ],
      seeMoreLabel: 'Lihat Semua Soalan Lazim',
      seeMoreHref: '/faq',
    },

    finalCta: {
      eyebrow: 'Sedia Bila-Bila Masa',
      headline:
        'Kutipan Percuma Untuk Anda. Pelupusan Bertauliah Untuk Perniagaan Anda.',
      subtext:
        'Sama ada satu telefon lama atau segudang peralatan yang telah bersara, Recycling Hub menguruskan kutipan, sijil, dan dokumen. Minta sebut harga pukal atau WhatsApp kami — kedua-duanya, anda akan mendapat jawapan dalam masa 24 jam.',
      cta: 'Minta Sebut Harga Pukal',
      ctaHref: '/request-quote?service=bulk-industrial-collection',
      whatsapp: 'WhatsApp Kami',
      note: 'Tiada komitmen diperlukan · Sebut harga dalam masa 24 jam · Kutipan individu sentiasa percuma',
    },
  },

  services: {
    hero: {
      eyebrow: 'Apa Yang Kami Lakukan',
      headline: 'Setiap Peringkat Kitaran Hayat E-Sisa,',
      headlineAccent: 'Diuruskan Di Bawah Satu Lesen.',
      description:
        'Dari saat peranti meninggalkan tangan anda hingga sijil yang membuktikan ia dimusnahkan dan dikitar semula dengan bertanggungjawab, Recycling Hub menguruskan kutipan, pemusnahan bertauliah, pemulihan bahan, dan pelaporan pematuhan — dari hujung ke hujung.',
    },
    trustBar: [
      'Pengumpul E-Sisa Berdaftar DOE',
      'Pemusnahan Data Bertauliah pada Setiap Kutipan',
    ],
    crossLink: {
      text: 'Mencari pilihan mengikut sektor pula?',
      cta: 'Lihat Penyelesaian',
      href: '/solutions',
    },
    gridHeading: {
      ourServices: {
        eyebrow: 'Perkhidmatan Kami',
        headline: 'Enam Perkhidmatan. Satu Lesen.',
      },
      exploreMore: { eyebrow: 'Terokai Lagi', headline: 'Perkhidmatan Lain' },
    },
    whatsIncludedHeading: 'Apa Yang Disertakan',
    learnMore: 'Ketahui lebih lanjut',
    freeIndividualNote: {
      prefix:
        'Hanya ingin melupuskan satu peranti peribadi? Kutipan individu adalah percuma di seluruh Klang Valley — ',
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
        title: 'Kutipan & Pengumpulan E-Sisa',
        summary:
          'Kutipan berjadual di rumah untuk peranti individu dan jumlah isi rumah, secara percuma di seluruh Klang Valley.',
      },
      'bulk-industrial-collection': {
        title: 'Pengumpulan Pukal & Industri',
        summary:
          'Kutipan berulang dan berasaskan jumlah untuk pejabat, gudang, dan kilang — disebut harga dan dijadualkan mengikut operasi anda.',
      },
      'certified-data-destruction': {
        title: 'Pemusnahan Data Bertauliah',
        summary:
          'Pemusnahan fizikal peranti membawa data dengan sijil bersiri dan penjejakan rantaian jagaan penuh.',
      },
      'esg-reporting': {
        title: 'Pelaporan ESG & Kelestarian',
        summary:
          'Laporan pengalihan dan impak — tonaj dikitar semula, bahan dipulihkan, dan anggaran kesan karbon — untuk pendedahan ESG anda.',
      },
      'material-recovery': {
        title: 'Kitar Semula & Pemulihan Bahan',
        summary:
          'Pemprosesan muara bawah berlesen yang memulihkan bahan boleh guna semula dan mengalihkan selebihnya daripada tapak pelupusan.',
      },
      'compliance-documentation': {
        title: 'Dokumentasi Pematuhan',
        summary:
          'Nota konsainan dan dokumen mematuhi DOE dikeluarkan bagi setiap kutipan, sedia untuk audit.',
      },
    } satisfies Record<ServiceSlug, { title: string; summary: string }>,
    detail: {
      'collection-pickup': {
        description:
          'Recycling Hub mengutip telefon, komputer riba, tablet, monitor, dan peralatan IT kecil yang telah bersara terus dari rumah atau pejabat anda di seluruh Klang Valley. Setiap kutipan dijadualkan terlebih dahulu dan disahkan sebelum pasukan kami tiba, jadi kutipan berlaku mengikut syarat anda, bukan lawatan tanpa notis.',
        included: [
          'Kutipan di rumah untuk peranti elektronik individu dan isi rumah di Klang Valley — tiada bilangan minimum peranti',
          'Kategori diterima: telefon & tablet, komputer riba & komputer, monitor & paparan, dan peralatan IT pejabat kecil',
          'Kini tersedia di seluruh Klang Valley — kawasan lain akan datang',
          'Kutipan standard direka untuk jumlah individu dan isi rumah — kutipan jumlah lebih tinggi dikendalikan di bawah Pengumpulan Pukal & Industri',
          'Bayaran DuitNow segera untuk peranti peribadi yang layak semasa kutipan',
        ],
        trust: {
          title: 'Kutipan Berdaftar DOE',
          description:
            'Setiap kutipan — individu atau pukal — dijalankan di bawah status pengumpul e-sisa berdaftar DOE kami, bukan pusingan kutipan tidak formal.',
        },
      },
      'bulk-industrial-collection': {
        description:
          'Untuk pejabat, gudang, dan kilang yang menjana e-sisa secara berterusan, Recycling Hub menjalankan kutipan berjadual dan berulang berbanding kutipan sekali sahaja. Logistik dibina mengikut waktu operasi dan jumlah anda, bukan sebaliknya.',
        included: [
          'Kutipan berulang dijadualkan mengikut kadar yang sepadan dengan jumlah anda',
          'Logistik khusus untuk kutipan pelbagai unit — satu tapak atau pelbagai cawangan/gudang dalam satu penglibatan',
          'Sebut harga berasaskan jumlah mengikut jenis dan bilangan peranti, disahkan sebelum sebarang kutipan dijadualkan',
          'Pemusnahan data bertauliah dan dokumentasi pematuhan yang sama seperti setiap peringkat kutipan lain',
          'Berbeza daripada kutipan individu — dibina untuk jumlah berulang dan berjadual, bukan satu laci peranti sekali sahaja',
        ],
        trust: {
          title: 'Pematuhan Sisa Terjadual SW110',
          description:
            'Kutipan pukal dan industri dijalankan di bawah klasifikasi sisa terjadual SW110, di bawah Akta Kualiti Alam Sekeliling 1974 Malaysia dan peraturan sampingannya.',
        },
      },
      'certified-data-destruction': {
        description:
          'Sebarang peranti membawa data yang kami kutip — telefon, komputer riba, cakera keras, pelayan — melalui pemusnahan bertauliah sebelum dikitar semula. Kami tidak menjual semula atau membaik pulih peranti yang masih membawa data anda, dan setiap peristiwa pemusnahan direkod dan disahkan.',
        included: [
          'Pemusnahan fizikal media storan, bukan pemadaman perisian yang boleh diterbalikkan',
          'Sijil pemusnahan bersiri dikeluarkan bagi setiap aset atau kelompok',
          'Penjejakan rantaian jagaan dari kutipan hingga pemusnahan, jadi tiada peranti tidak direkodkan di antaranya',
          'Tersedia sebagai permintaan berasingan untuk peranti atau kelompok tertentu, atau digabungkan dalam mana-mana kutipan',
          'Sijil boleh diperoleh semula atas permintaan melalui Jejak & Kesan',
        ],
        trust: {
          title: 'Sijil Pemusnahan',
          description:
            'Setiap sijil bersiri dan dikaitkan dengan aset khusus yang dimusnahkan — bukan kenyataan kelompok generik.',
        },
      },
      'esg-reporting': {
        description:
          'Perniagaan yang mengutip bersama Recycling Hub menerima laporan pengalihan yang meringkaskan apa yang dikutip dan apa yang berlaku kepadanya — diformat supaya pasukan kelestarian atau pematuhan anda boleh menggunakannya terus dalam pendedahan ESG, tanpa memformat semula.',
        included: [
          'Jumlah berat dikutip dan dikitar semula, mengikut kategori peranti',
          'Pecahan bahan dipulihkan berbanding pengalihan daripada tapak pelupusan',
          'Anggaran kesan karbon bagi kutipan',
          'Diberikan bagi setiap kutipan, atau digabungkan sepanjang tempoh pelaporan (contohnya suku tahunan, tahunan) atas permintaan',
          'Diformat untuk kegunaan terus dalam audit ESG dan pendedahan kelestarian',
        ],
        trust: {
          title: 'Pelaporan Sedia ESG',
          description:
            'Setiap kutipan pukal dan perusahaan layak mendapat laporan pengalihan — minta satu bersama sebut harga seterusnya anda.',
        },
      },
      'material-recovery': {
        description:
          'Setelah dikutip, e-sisa diproses melalui rakan kongsi muara bawah berlesen yang memulihkan bahan boleh guna semula — logam, plastik, dan komponen — dan memastikan apa-apa yang tidak boleh dipulihkan dilupuskan mematuhi peraturan sisa terjadual Malaysia, bukan dihantar ke tapak pelupusan.',
        included: [
          'Penyusunan dan pembongkaran peranti dikutip mengikut aliran bahan',
          'Bahan boleh pulih — logam, plastik, kaca, komponen papan litar — dihalakan kepada pemproses berlesen',
          'Sisa baki tidak boleh pulih dilupuskan mematuhi SW110, tidak pernah dihantar ke tapak pelupusan tanpa rawatan',
          'Tiada peraih besi buruk tidak berlesen atau pengitar semula tidak formal dalam rantaian pada mana-mana peringkat',
          'Hasil pemprosesan dicerminkan dalam laporan pengalihan ESG anda jika anda pelanggan perniagaan',
        ],
        trust: {
          title: 'Pemprosesan Muara Bawah Berlesen',
          description:
            'Pemulihan bahan dijalankan hanya melalui pemproses berlesen — tidak pernah melalui saluran besi buruk tidak formal atau tidak berdaftar.',
        },
      },
      'compliance-documentation': {
        description:
          'Setiap kutipan — individu atau perniagaan — menjana rekod bertulis. Bagi perniagaan, ini bermakna nota konsainan dan dokumen mematuhi DOE yang boleh anda serahkan terus kepada juruaudit, tanpa perlu mengejar kami untuk rekod selepas itu.',
        included: [
          'Nota konsainan dikeluarkan bagi setiap kutipan sisa terjadual',
          'Dokumen kutipan dan pelupusan mematuhi DOE disimpan untuk rekod anda',
          'Sijil pemusnahan disertakan bagi sebarang aset membawa data dalam kutipan',
          'Dokumentasi diberikan pada masa kutipan atau sejurus selepasnya',
          'Dokumentasi lampau boleh diperoleh semula bila-bila masa melalui Jejak & Kesan',
        ],
        trust: {
          title: 'Dokumen Sedia Audit',
          description:
            'Dokumentasi dikeluarkan bagi setiap kutipan, tidak dikumpulkan pada penghujung tahun, jadi rekod anda kekal terkini sepanjang tahun.',
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
    hero: {
      eyebrow: 'Siapa Yang Kami Khidmati',
      headline: 'Penyelesaian E-Sisa Disesuaikan,',
      headlineAccent: 'Sektor demi Sektor.',
      description:
        'Dari sebuah isi rumah tunggal yang melupuskan peranti lama hingga sebuah perusahaan yang menutup pusat data, Recycling Hub menyesuaikan proses berdaftar DOE dan bertauliah yang sama mengikut keperluan sebenar setiap sektor.',
    },
    crossLink: {
      text: 'Mencari pilihan mengikut jenis perkhidmatan pula?',
      cta: 'Lihat Perkhidmatan',
      href: '/services',
    },
    gridHeading: {
      ourSegments: {
        eyebrow: 'Segmen Kami',
        headline: 'Penyelesaian untuk Setiap Sektor',
      },
      exploreMore: { eyebrow: 'Terokai Lagi', headline: 'Penyelesaian Lain' },
    },
    whyUsHeadingPrefix: 'Mengapa',
    whyUsHeadingSuffix: 'Memilih Recycling Hub',
    learnMore: 'Ketahui lebih lanjut',
    cards: {
      'corporate-enterprise': {
        title: 'Korporat & Perusahaan',
        summary:
          'Kutipan pukal berulang, pemusnahan data bertauliah, dan pelaporan ESG untuk pejabat, IT korporat, dan kilang.',
      },
      'individuals-households': {
        title: 'Individu & Isi Rumah',
        summary:
          'Kutipan percuma di rumah di Klang Valley dan bayaran DuitNow segera untuk peranti elektronik peribadi — tiada minimum, tiada dokumen.',
      },
      'government-glc': {
        title: 'Kerajaan & GLC',
        summary:
          'Pematuhan sedia perolehan dan dokumentasi telus untuk agensi sektor awam dan syarikat berkaitan kerajaan.',
      },
      education: {
        title: 'Pendidikan',
        summary:
          'Kutipan pukal untuk naik taraf makmal komputer dan pertukaran peralatan sepanjang kampus, dengan pemusnahan bertauliah data pelajar dan staf.',
      },
      healthcare: {
        title: 'Penjagaan Kesihatan',
        summary:
          'Kutipan dijejaki rantaian jagaan dan pemusnahan bertauliah untuk peralatan IT hospital dan klinik yang telah bersara.',
      },
      ngo: {
        title: 'NGO & Bukan Untung',
        summary:
          'Kutipan fleksibel dan berjumlah rendah pada kadar perkongsian untuk badan bukan untung dan organisasi komuniti.',
      },
    } satisfies Record<SolutionSlug, { title: string; summary: string }>,
    detail: {
      'corporate-enterprise': {
        framing:
          'Pejabat korporat, jabatan IT, dan kilang menjana e-sisa secara berterusan — dan setiap peranti yang keluar tanpa dokumentasi yang betul adalah soalan pematuhan dan keselamatan data yang akhirnya akan ditanya oleh lembaga pengarah anda. Recycling Hub menggantikan ketidakpastian itu dengan kutipan pukal berjadual, pemusnahan bertauliah, dan pelaporan sedia audit yang terbina dalam setiap kutipan.',
        whyUs: [
          'Kutipan pukal berulang dijadualkan mengikut operasi anda, bukan operasi kami',
          'Pemusnahan data bertauliah dengan sijil bersiri bagi setiap aset membawa data yang bersara',
          'Laporan pengalihan ESG diformat untuk kegunaan terus dalam pendedahan kelestarian dan audit',
          'Dokumentasi pematuhan — nota konsainan, dokumen mematuhi DOE — dikeluarkan bagi setiap kutipan, tidak dikumpulkan pada penghujung tahun',
        ],
        ctaLabel: 'Minta Sebut Harga Pukal',
        testimonialNote:
          'Kajian kes/testimoni korporat — akan ditambah apabila rujukan pelanggan tersedia. Jangan diterbitkan tanpa persetujuan pelanggan sebenar.',
      },
      'individuals-households': {
        framing:
          'Melupuskan telefon lama, komputer riba, atau satu laci penuh pengecas mati tidak sepatutnya mengambil lebih usaha daripada membuangnya ke tong sampah — tetapi tong sampah bukan tempat ia patut pergi. Recycling Hub mengutip peranti elektronik lama anda secara percuma di seluruh Klang Valley, dan membayar anda segera sejurus ia dikutip.',
        whyUs: [
          'Kutipan percuma di rumah di Klang Valley — tiada bilangan minimum peranti, tiada akaun atau kontrak diperlukan',
          'Bayaran DuitNow segera sejurus peranti anda dikutip',
          'Semua peranti peribadi diterima — telefon, komputer riba, tablet, monitor, dan banyak lagi',
          'Pemusnahan data bertauliah disertakan pada setiap peranti membawa data, tanpa langkah tambahan untuk anda',
        ],
        ctaLabel: 'Tempah Kutipan',
        testimonialNote:
          'Testimoni isi rumah — akan ditambah apabila maklum balas pelanggan sebenar tersedia. Jangan terbitkan petikan rekaan.',
      },
      'government-glc': {
        framing:
          'Agensi sektor awam dan syarikat berkaitan kerajaan memerlukan vendor yang dapat menahan penelitian perolehan — pematuhan kawal selia penuh, dokumentasi telus, dan rekod bertulis yang kukuh dalam semakan tender, bukan sekadar resit kutipan.',
        whyUs: [
          'Kutipan berdaftar DOE dan pematuhan sisa terjadual SW110, sedia untuk usaha wajar perolehan',
          'Dokumentasi telus bagi setiap kutipan — nota konsainan dan dokumen pematuhan, bukan diringkaskan selepas fakta',
          'Pemusnahan data bertauliah dengan penjejakan rantaian jagaan, untuk agensi yang mengendalikan rekod sensitif',
          'Kutipan pukal dijadualkan mengikut kitaran perolehan dan belanjawan standard',
        ],
        ctaLabel: 'Minta Maklumat Vendor',
        testimonialNote:
          'Kajian kes atau rujukan kerajaan/GLC — akan ditambah apabila tersedia dan diluluskan untuk pendedahan awam.',
      },
      education: {
        framing:
          'Naik taraf makmal komputer dan pertukaran peralatan sepanjang kampus menjana e-sisa secara berkelompok, bukan satu peranti pada satu masa — dan peranti pelajar dan staf yang bersara sering masih menyimpan data peribadi yang menjadi tanggungjawab sekolah untuk melindungi. Recycling Hub menguruskan kedua-dua jumlah dan data.',
        whyUs: [
          'Kutipan pukal yang boleh dijadualkan mengikut cuti semester dan kitaran naik taraf',
          'Pemusnahan data bertauliah pada setiap peranti bersara, melindungi data pelajar dan staf sebelum dijual semula atau dikitar semula',
          'Dokumentasi merangkumi keseluruhan kelompok dikutip, berguna untuk hapus kira aset dan rekod inventori',
          'Proses berdaftar DOE dan mematuhi SW110 yang sama seperti mana-mana kutipan pukal lain',
        ],
        ctaLabel: 'Minta Sebut Harga Kutipan Kampus',
        testimonialNote:
          'Kajian kes atau testimoni sekolah/universiti — akan ditambah apabila rujukan pelanggan tersedia.',
      },
      healthcare: {
        framing:
          'Peralatan IT hospital dan klinik yang telah bersara — stesen kerja, pelayan, sistem pengimejan, pemacu storan — boleh membawa data pesakit lama selepas ia ditarik daripada perkhidmatan. Recycling Hub melayan setiap kutipan penjagaan kesihatan sebagai peristiwa rantaian jagaan, bukan sekadar kutipan.',
        whyUs: [
          'Pemusnahan data bertauliah bagi sebarang peranti yang mungkin menyimpan rekod pesakit atau klinikal',
          'Rantaian jagaan didokumenkan dari kutipan hingga pemusnahan, untuk semakan audit dan pematuhan dalaman',
          'Kutipan dijadualkan mengikut waktu operasi fasiliti, bukan kutipan tanpa temujanji',
          'Sijil pemusnahan bersiri dikeluarkan bagi setiap aset, bukan kenyataan kelompok generik',
        ],
        ctaLabel: 'Minta Sebut Harga Penyelesaian Penjagaan Kesihatan',
        testimonialNote:
          'Kajian kes atau testimoni fasiliti penjagaan kesihatan — akan ditambah apabila rujukan pelanggan tersedia dan diluluskan untuk pendedahan.',
      },
      ngo: {
        framing:
          'Badan bukan untung dan kumpulan komuniti tidak sentiasa menjana e-sisa mengikut jadual yang boleh diramal atau dalam jumlah pukal — dan belanjawan hampir selalu menjadi kekangan sebenar. Recycling Hub menyesuaikan skala untuk memadankan, tanpa melayan organisasi lebih kecil sebagai keutamaan lebih rendah.',
        whyUs: [
          'Kutipan fleksibel disesuaikan dengan jumlah rendah dan tidak tetap — tiada minimum pukal diperlukan',
          'Harga kadar perkongsian tersedia untuk badan bukan untung berdaftar — tanya semasa anda menghubungi kami',
          'Pemusnahan data bertauliah dan dokumentasi pematuhan disertakan, sama seperti mana-mana kutipan lain',
          'Pelaporan pengalihan ESG tersedia atas permintaan, untuk pelaporan penderma atau geran',
        ],
        ctaLabel: 'Hubungi Kami Mengenai Kadar Perkongsian',
        testimonialNote:
          'Kajian kes atau testimoni rakan kongsi bukan untung — akan ditambah apabila tersedia dan diluluskan untuk kegunaan awam.',
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
        whatsappLabel: 'SMS / WhatsApp',
        emailLabel: 'E-mel',
        connectHeading: 'Ikuti kami',
      },
    },
  },

  faqPage: {
    eyebrow: 'Soalan Lazim',
    headline: 'Soalan,',
    headlineAccent: 'Dijawab.',
    subtext:
      'Semua yang paling kerap ditanya — daripada menempah kutipan percuma hingga meminta sijil untuk kutipan lampau. Tidak jumpa apa yang anda perlukan? Hubungi kami dan kami akan jawab terus.',
    categories: [
      {
        name: 'Bermula',
        items: [
          {
            question: 'Peranti apakah yang anda terima?',
            answer:
              'Telefon, tablet, komputer riba, desktop, monitor, dan peralatan IT pejabat seperti pelayan, pencetak, dan penghala, ditambah cakera keras, SSD, dan peranti storan lain. Hubungi kami jika anda tidak pasti sama ada item tertentu — terutamanya peralatan besar — diterima.',
          },
          {
            question: 'Bagaimana saya menempah kutipan?',
            answer:
              'Tempah dalam talian atau melalui WhatsApp — ia mengambil masa kurang seminit. Beritahu kami secara kasar apa yang anda ada dan di mana, dan kami sahkan masa kutipan.',
          },
          {
            question: 'Kawasan manakah yang anda khidmati?',
            answer:
              'Kutipan individu percuma kini tersedia di seluruh Klang Valley. Jika anda berada di luar kawasan itu, hubungi kami dan kami akan maklumkan apabila liputan berkembang. Kutipan pukal dan perusahaan dinilai mengikut lokasi — minta sebut harga dan kami akan sahkan sama ada kami boleh berkhidmat untuk anda.',
          },
          {
            question:
              'Apakah perbezaan antara kutipan individu dan perniagaan?',
            answer:
              'Kutipan individu adalah untuk isi rumah yang ingin melupuskan peranti peribadi — ia percuma di seluruh Klang Valley, dengan bayaran segera, tiada minimum. Kutipan perniagaan atau pukal adalah untuk pejabat, gudang, dan kilang, dan dijadualkan mengikut operasi dan lokasi anda dengan sebut harga khusus. Kedua-duanya dikutip di bawah proses yang sama, berdaftar DOE dan mematuhi SW110.',
          },
        ],
      },
      {
        name: 'Kutipan Individu',
        items: [
          {
            question:
              'Adakah terdapat bilangan minimum peranti untuk kutipan percuma?',
            answer:
              'Tiada — sama ada satu telefon lama atau satu laci penuh peranti, kutipan individu adalah percuma di seluruh Klang Valley dan disertakan bayaran DuitNow segera. Tiada akaun atau kontrak diperlukan.',
          },
          {
            question: 'Bagaimana saya dibayar untuk peranti lama saya?',
            answer:
              'Kutipan individu dibayar segera melalui DuitNow, sejurus peranti anda dikutip — tiada tempoh menunggu, tiada permintaan bayaran manual.',
          },
        ],
      },
      {
        name: 'Perniagaan & Kutipan Pukal',
        items: [
          {
            question:
              'Adakah anda mengenakan bayaran untuk kutipan pukal atau perusahaan?',
            answer:
              'Kutipan individu sentiasa percuma. Kutipan pukal dan perusahaan disebut harga berdasarkan jumlah dan jenis peranti — minta sebut harga dan kami akan sahkan harga sebelum apa-apa dijadualkan.',
          },
          {
            question:
              'Apakah dokumentasi yang kami terima untuk tujuan pematuhan atau audit?',
            answer:
              'Kutipan perniagaan dan pukal disertakan rekod rantaian jagaan yang lengkap, sijil pemusnahan bersiri bagi setiap aset yang membawa data, dan laporan pengalihan sedia ESG yang merangkumi tonaj dikitar semula dan pengalihan daripada tapak pelupusan — semuanya boleh diperoleh semula atas permintaan.',
          },
        ],
      },
      {
        name: 'Data, Sijil & Pematuhan',
        items: [
          {
            question:
              'Apa yang berlaku kepada data saya sebelum peranti dikitar semula?',
            answer:
              'Sebarang peranti yang membawa data — telefon, komputer riba, cakera keras, pelayan — melalui pemusnahan bertauliah sebelum dikitar semula. Untuk individu, ini disertakan dalam setiap kutipan. Untuk perniagaan, anda menerima sijil pemusnahan bersiri bagi setiap aset, sebagai bukti ia telah dilakukan.',
          },
          {
            question:
              'Adakah Recycling Hub benar-benar berlesen untuk mengendalikan e-sisa?',
            answer:
              'Ya — kutipan dan pemprosesan dijalankan di bawah lesen DOE yang berdaftar dan mematuhi peraturan sisa terjadual SW110, bukan operasi tidak formal atau tidak berlesen.',
          },
          {
            question:
              'Bagaimana saya boleh meminta sijil atau menyemak status kutipan saya?',
            answer:
              'Gunakan halaman Jejak & Kesan / Permintaan Sijil kami — hantar rujukan tempahan anda jika ada, atau sekadar terangkan kutipan tersebut, dan kami akan e-melkan apa yang anda perlukan.',
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
    hero: {
      eyebrow: 'Dapatkan Sebut Harga',
      headline: 'Minta',
      headlineAccent: 'Sebut Harga.',
      description:
        'Beritahu kami apa yang perlu dikutip dan kami akan sahkan harga serta jadual kutipan — biasanya dalam masa 24 jam.',
    },
    form: {
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
      submitButton: 'Hantar Permintaan',
      submittedButton: 'Permintaan Dihantar',
      successMessage:
        'Permintaan diterima — kami akan sahkan harga dan jadual kutipan dalam masa 24 jam.',
      whatsappNote: 'Lebih suka berbincang terus? WhatsApp kami sahaja.',
    },
    footerNote: {
      prefix:
        'Kutipan individu sentiasa percuma di seluruh Klang Valley dan tidak memerlukan sebut harga — ',
      linkText: 'tempah terus melalui WhatsApp',
      suffix: '.',
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
      backToLogin: 'Kembali Ke Log Masuk',
      noPendingFlow: 'Sesi log masuk anda telah tamat — sila log masuk semula.',
      genericError: 'Kod tidak sah atau telah tamat tempoh.',
    },
    forgotPassword: {
      title: 'Lupa Kata Laluan Anda?',
      subtitle:
        'Masukkan e-mel anda dan kami akan menghantar pautan untuk menetapkan semula.',
      emailLabel: 'E-mel',
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
