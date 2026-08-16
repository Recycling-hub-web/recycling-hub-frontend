// Bahasa Melayu (Malaysia) translation.
//
// TODO: this translation was drafted by an AI assistant, not a native
// Malaysian-Malay copywriter. It should get a native-speaker review pass
// before being treated as final/production copy — especially the FAQ and
// legal-adjacent compliance wording (DOE/SW110/PDPA phrasing), where
// precision matters. Established English/regulatory terms (DOE, SW110,
// PDPA, ESG, DuitNow, Recycling Hub) are deliberately kept untranslated,
// matching how they're actually used in Malaysian business Malay.

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
      { label: 'Harga', href: '/pricing' },
      { label: 'Jejak & Kesan / Sijil', href: '/track-trace' },
      { label: 'Minta Sebut Harga', href: '/request-quote' },
    ],
    company: [
      { label: 'Tentang Kami', href: '/about' },
      { label: 'Kenali Pasukan Kami', href: '/about#team' },
      { label: 'Perkhidmatan', href: '/services' },
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
      headlineSuffix: 'Berdaftar Yang Boleh Dipercayai',
      subheadline:
        'Recycling Hub mengambil peranti elektronik lama secara percuma, di mana sahaja anda berada — untuk isi rumah yang ingin melupuskan peranti lama dan untuk perniagaan yang menutup keseluruhan pejabat. Setiap kutipan berdaftar dengan DOE dan didokumenkan sepenuhnya.',
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
            'Kutipan di rumah untuk individu, di tapak untuk perniagaan',
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
              rest: ' untuk kutipan di rumah',
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
            'Ingin melupuskan telefon, komputer riba, atau gajet lama? Tempah kutipan percuma di rumah dan dapat bayaran segera melalui DuitNow — tiada minimum, tiada dokumen.',
          features: [
            'Kutipan percuma di rumah',
            'Bayaran DuitNow segera',
            'Semua peranti peribadi diterima',
            'Tiada akaun atau kontrak diperlukan',
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
            'Kutipan mematuhi DOE dan SW110 untuk pejabat, gudang, dan kilang — dengan pemusnahan data bertauliah dan laporan sedia ESG yang boleh dipercayai pasukan pematuhan anda.',
          features: [
            'Kutipan pukal mematuhi DOE/SW110',
            'Pemusnahan data bertauliah dengan sijil bersiri',
            'Laporan ESG & kelestarian disertakan',
            'Dijadualkan mengikut operasi anda',
          ],
          cta: 'Minta Sebut Harga Pukal',
          ctaHref: '/request-quote?service=bulk-industrial-collection',
          highlight: true,
        },
      ],
      footnote:
        'Kutipan individu sentiasa percuma — harga pukal dan perusahaan disahkan selepas penilaian ringkas jumlah anda.',
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
            'Tiada — sama ada satu telefon lama atau satu laci penuh peranti, kutipan individu adalah percuma dan disertakan bayaran DuitNow segera. Tiada akaun atau kontrak diperlukan.',
        },
        {
          question:
            'Apa yang berlaku kepada data saya sebelum peranti dikitar semula?',
          answer:
            'Sebarang peranti yang membawa data — telefon, komputer riba, cakera keras, pelayan — melalui proses pemusnahan bertauliah sebelum dikitar semula. Untuk individu, ini disertakan dalam setiap kutipan. Untuk perniagaan, anda menerima sijil pemusnahan bersiri bagi setiap aset, sebagai bukti ia telah dilakukan.',
        },
        {
          question: 'Bagaimana saya dibayar untuk peranti lama saya?',
          answer:
            'Kutipan individu dibayar segera melalui DuitNow, sejurus peranti anda dikutip — tiada tempoh menunggu, tiada permintaan bayaran manual. Kutipan pukal dan perusahaan adalah berasaskan sebut harga dan bukan dibayar, kerana fokusnya adalah pelupusan mematuhi peraturan dan dokumentasi.',
        },
        {
          question: 'Apakah perbezaan antara kutipan individu dan perniagaan?',
          answer:
            'Kutipan individu adalah untuk isi rumah yang ingin melupuskan peranti peribadi — ia percuma, dengan bayaran segera, tiada minimum. Kutipan perniagaan atau pukal adalah untuk pejabat, gudang, dan kilang, dan dijadualkan mengikut operasi anda dengan sebut harga khusus berdasarkan jumlah dan jenis peranti. Kedua-duanya dikutip di bawah proses yang sama, berdaftar DOE dan mematuhi SW110.',
        },
        {
          question:
            'Apakah dokumentasi yang kami terima untuk tujuan pematuhan atau audit?',
          answer:
            'Kutipan perniagaan dan pukal disertakan rekod rantaian jagaan yang lengkap, sijil pemusnahan bersiri bagi setiap aset yang membawa data, dan laporan pengalihan sedia ESG yang merangkumi tonaj dikitar semula dan pengalihan daripada tapak pelupusan — semuanya boleh diperoleh semula atas permintaan.',
        },
        {
          question:
            'Adakah Recycling Hub benar-benar berlesen untuk mengendalikan e-sisa?',
          answer:
            'Ya — kutipan dan pemprosesan dijalankan di bawah lesen DOE yang berdaftar dan mematuhi peraturan sisa terjadual SW110, bukan operasi tidak formal atau tidak berlesen.',
        },
        {
          question: 'Peranti apakah yang anda terima?',
          answer:
            'Telefon, tablet, komputer riba, desktop, monitor, dan peralatan IT pejabat seperti pelayan, pencetak, dan penghala, ditambah cakera keras, SSD, dan peranti storan lain. Hubungi kami jika anda tidak pasti sama ada item tertentu — terutamanya peralatan besar — diterima.',
        },
        {
          question:
            'Adakah anda mengenakan bayaran untuk kutipan pukal atau perusahaan?',
          answer:
            'Kutipan individu sentiasa percuma. Kutipan pukal dan perusahaan disebut harga berdasarkan jumlah dan jenis peranti — minta sebut harga dan kami akan sahkan harga sebelum apa-apa dijadualkan.',
        },
      ],
    },

    finalCta: {
      eyebrow: 'Sedia Bila-Bila Masa',
      headline:
        'Kutipan Percuma Untuk Anda. Pelupusan Bertauliah Untuk Perniagaan Anda.',
      subtext:
        'Sama ada satu telefon lama atau segudang peralatan yang telah bersara, Recycling Hub menguruskan kutipan, sijil, dan dokumen. Minta sebut harga pukal atau tempah panggilan percuma — kedua-duanya, anda akan mendapat jawapan dalam masa 24 jam.',
      cta: 'Minta Sebut Harga Pukal',
      ctaHref: '/request-quote?service=bulk-industrial-collection',
      whatsapp: 'WhatsApp Kami',
      note: 'Tiada komitmen diperlukan · Sebut harga dalam masa 24 jam · Kutipan individu sentiasa percuma',
    },
  },
};

export { bm };
