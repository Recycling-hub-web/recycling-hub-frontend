# SEO batch 1: review before the next batch

Implemented locally on 7 November 2026. Pages: Home, Services, FAQ and the existing `/request-quote` (plus BM versions). No live URL renamed, no city pages/content-gap articles published, no deployment performed.

> **Policy correction from the user:** pickup requires a minimum of 3 devices. The original batch tables below are historical; their “no minimum” copy is superseded by [the contact/link and minimum correction](contact-links-and-minimum.md). Current checks in `batch-1-checks.json` reflect the corrected policy.

## Result and scope

- EN/BM titles, descriptions and new/edited content live in the existing catalogues. Metadata titles are 36–56 characters; descriptions are 151–155 characters. Primary terms are distinct by page; BM keywords are provisional editorial choices pending Keyword Planner.
- Removed unconfirmed DOE/licensed-collector claims from these four rendered pages. Home now uses real service differentiators instead of registration claims. Other pages retain previously audited claims until their approved batches.
- Home keeps three brief decision-making FAQs and links to the full FAQ. Full FAQ uses native accessible disclosure elements; all answers are server-rendered and the JSON-LD is generated from the same translated catalogue entries. Contact Quick Answers are unchanged.
- Services no longer renders the feature-tabs section containing placeholder customer quotes, zero-landfill guarantees and licensing assertions. It now has a service-intent paragraph with descriptive links to data destruction, bulk collection and quotes; the existing Solutions cross-link is retained. Old feature-tabs catalogue values/component remain unused; no quotes were invented to replace them.
- Quote form prepares a message and navigates to WhatsApp. The visitor must send it there. It no longer pretends that a request has been submitted to a backend or promises a 24-hour response. Form fields and validation remain; phone/company are optional. No message was sent during testing.
- Shared canonical/hreflang fixes apply to all public pages using Meta: self-canonical EN/BM URLs and reciprocal `en-MY`, `ms-MY`, `x-default`. This does not translate pages outside this batch. Shared brand contact values/footer also update sitewide as approved dependencies.
- Shared service card summaries are reused on service-related grids elsewhere; their corrected wording therefore propagates there. No detail-page paragraph rewrite was done in this batch.

## Keyword placement

| Page | EN primary | Secondary placement | BM primary (provisional) |
| --- | --- | --- | --- |
| / | e-waste recycling Malaysia — title, meta, H1, opening paragraph | Service-area H2, hero, benefits text: e-waste pickup Klang Valley; free e-waste pickup; recycle old electronics for cash | kitar semula sisa elektronik — title, meta, H1, opening paragraph |
| /services | e-waste collection services — title, meta, H1, opening paragraph | Commercial service links and disposal H2: certified data destruction Malaysia; e-waste disposal Malaysia | perkhidmatan kutipan e-waste — title, meta, H1, opening paragraph |
| /faq | e-waste recycling FAQ — title, meta, H1, opening paragraph | Question wording in the full Q&A: what e-waste is accepted; is e-waste pickup free | soalan lazim kitar semula e-waste — title, meta, H1, opening paragraph |
| /request-quote | e-waste pickup quote — title, meta, H1, opening paragraph | Hero introduction and IT asset disposal H2: bulk e-waste quote; IT asset disposal quote | sebut harga pickup e-waste — title, meta, H1, opening paragraph |

Consumer terms use readable variants rather than forced exact-match repetitions: old laptop/phone/computer/monitor and chargers/cables in Services; electronics-for-cash in Home; “jual laptop lama” in BM Home. No separate device/location pages were created to chase these terms. No measured search-volume or ranking claim is made.

## Page-by-page EN/BM before and after

All changed paragraph/heading/label catalogue values rendered by these pages are listed below. “Added” means that no matching prior catalogue value existed. FAQ category restructuring changes the positional correspondence; read the full old/new sets rather than assuming identical array positions refer to the same question.

## /

### EN

| Field | Before | After |
| --- | --- | --- |
| Title | Recycling Hub - Certified E-Waste Collection & Disposal in Klang Valley, Malaysia | E-waste recycling Malaysia \| Free pickup \| Recycling Hub |
| Meta description | Recycling Hub provides DOE-registered, certified e-waste collection and disposal — free doorstep pickup for individuals across Klang Valley, and SW110-compliant bulk collection for businesses across Malaysia. | E-waste recycling Malaysia: free pickup in Klang Valley, no minimum quantity and instant DuitNow payment for households. Request your collection today. |
| H1 | Registered E-Waste Recycling in Klang Valley, Malaysia | E-waste recycling Malaysia |

After lengths: title **56**, description **151**.

| Copy path | Before | After |
| --- | --- | --- |
| `home.hero.headlinePill` | E-Waste | Malaysia |
| `home.hero.headlinePrefix` | Registered | E-waste recycling |
| `home.hero.headlineSuffix` | Recycling in Klang Valley, Malaysia |  |
| `home.hero.imageAlt` | (added) | Old televisions and electronic equipment on shelves |
| `home.hero.subheadline` | Recycling Hub picks up old electronics for free across the Klang Valley — for households clearing out a drawer of devices and for businesses decommissioning a whole office. Every collection is DOE-registered and fully documented. | E-waste recycling Malaysia starts at your doorstep. Recycling Hub offers free e-waste pickup in Klang Valley with no minimum quantity and instant DuitNow payment for households. Businesses can arrange bulk collection, certified data destruction and compliance documents. |
| `home.trustStrip.label` | Why Malaysian households and businesses choose Recycling Hub | Pickup options for households and businesses |
| `home.trustStrip.stats[0].label` | Registered E-Waste Collector | Household pickup in Klang Valley |
| `home.trustStrip.stats[0].value` | DOE | Free |
| `home.trustStrip.stats[1].label` | Doorstep Pickup in Klang Valley | Even a single old device |
| `home.trustStrip.stats[1].value` | Free | No minimum |
| `home.trustStrip.stats[2].label` | DuitNow Payment on Collection | Instant household payment |
| `home.trustStrip.stats[2].value` | Instant | DuitNow |
| `home.trustStrip.stats[3].label` | Compliant Enterprise Collection | Bulk collection by quotation |
| `home.trustStrip.stats[3].value` | SW110 | Business |
| `home.whyRecyclingHub.eyebrow` | Why Recycling Hub | Old electronics, a clear next step |
| `home.whyRecyclingHub.features[0].body` | Recycling Hub collects and processes e-waste under a registered DOE license and SW110 scheduled-waste compliance. Every pickup is logged, tracked, and backed by paperwork you can hand to an auditor. | Request collection for your old electronics without a minimum quantity. Share the device type and condition so the team can discuss what you have before pickup. |
| `home.whyRecyclingHub.features[0].icon` | shield | plug |
| `home.whyRecyclingHub.features[0].title` | Licensed Under DOE & SW110 — Every Collection Documented | Clearing out a phone or laptop? |
| `home.whyRecyclingHub.features[1].body` | A single old laptop or a full office decommission — Recycling Hub runs the same licensed, documented process either way. You don't need a separate vendor for personal and enterprise volumes. | Tell us your equipment types, estimated volume and collection address. Business pickup is quoted separately from free household collection. |
| `home.whyRecyclingHub.features[1].icon` | plug | shield |
| `home.whyRecyclingHub.features[1].title` | One Partner, Whether It’s One Phone or a Whole Office | Retiring office equipment? |
| `home.whyRecyclingHub.features[2].body` | Every device carrying data goes through certified destruction with a serialized certificate. Recycling Hub does not resell or retain your data-bearing devices — destruction is verified, not assumed. | Businesses can request certified data destruction and compliance documents. Discuss the data-bearing devices and records you need when requesting a quote. |
| `home.whyRecyclingHub.features[2].title` | Certified Destruction. Zero Data Recovery. | Need certified data destruction? |
| `home.whyRecyclingHub.headline` | The Compliant Way to Get Rid of Old Electronics | Free e-waste pickup for homes. Bulk collection for offices. |
| `home.whyRecyclingHub.subtext` | A scrap dealer or a storage room won't wipe your data, document the collection, or keep it out of a landfill. Recycling Hub handles the entire process — licensed, certified, and documented — for individuals and businesses alike. | Whether you want to recycle old electronics for cash or arrange an office clear-out, choose the collection option that fits your needs. |
| `home.faq.headline` | Frequently Asked | Before you request |
| `home.faq.headlineAccent` | Questions | a pickup |
| `home.faq.items[0].answer` | No — whether it's a single old phone or a drawer full of devices, individual pickup is free across Klang Valley and comes with instant DuitNow payment. There's no account or contract required. | Yes. Household pickup in Klang Valley is free with no minimum quantity, including a single old phone or laptop. |
| `home.faq.items[0].question` | Is there a minimum number of devices for a free pickup? | Can you collect just one device? |
| `home.faq.items[1].answer` | Individual pickups are paid instantly via DuitNow, at the moment your devices are collected — no waiting period, no manual payout request. Bulk and enterprise collection is quote-based rather than paid, since the focus there is compliant disposal and documentation. | Payment is made instantly via DuitNow when we collect your household electronics. Discuss your devices with the team before pickup; business collections are quote-based. |
| `home.faq.items[1].question` | How do I get paid for my old devices? | When is household payment made? |
| `home.faq.items[2].answer` | Yes — collection and processing is carried out under a registered DOE license and SW110 scheduled-waste compliance, not an informal or unlicensed setup. | Share the device types and condition with the team. Our full FAQ explains accepted devices, collection arrangements and business documentation. |
| `home.faq.items[2].question` | Is Recycling Hub actually licensed to handle e-waste? | Unsure whether your electronics can be collected? |
| `home.faq.seeMoreLabel` | See Full FAQ | See all e-waste recycling FAQs |
| `home.serviceArea.businessLink` | (added) | Arrange bulk e-waste collection |
| `home.serviceArea.description` | (added) | Ask about pickup in Kuala Lumpur, Petaling Jaya, Shah Alam, Subang Jaya, Klang, Puchong, Cheras, Cyberjaya and Putrajaya. Share your address so we can confirm collection access and timing. |
| `home.serviceArea.heading` | (added) | E-waste pickup in Klang Valley |
| `home.serviceArea.householdLink` | (added) | Explore doorstep e-waste collection |
| `home.serviceArea.quoteLink` | (added) | Request an e-waste pickup quote |

### BM

| Field | Before | After |
| --- | --- | --- |
| Title | Recycling Hub - Certified E-Waste Collection & Disposal in Klang Valley, Malaysia | Kitar semula sisa elektronik \| Recycling Hub |
| Meta description | Recycling Hub provides DOE-registered, certified e-waste collection and disposal — free doorstep pickup for individuals across Klang Valley, and SW110-compliant bulk collection for businesses across Malaysia. | Kitar semula sisa elektronik di Lembah Klang: pickup percuma tanpa kuantiti minimum untuk isi rumah, bayaran DuitNow serta-merta. Minta kutipan hari ini. |
| H1 | Perkhidmatan Kitar Semula E-Sisa Berdaftar di Klang Valley, Malaysia | Kitar semula sisa elektronik |

After lengths: title **44**, description **153**.

| Copy path | Before | After |
| --- | --- | --- |
| `home.hero.headlinePill` | E-Sisa | sisa elektronik |
| `home.hero.headlinePrefix` | Perkhidmatan Kitar Semula | Kitar semula |
| `home.hero.headlineSuffix` | Berdaftar di Klang Valley, Malaysia |  |
| `home.hero.imageAlt` | (added) | Televisyen lama dan peralatan elektronik di atas rak |
| `home.hero.subheadline` | Recycling Hub mengambil peranti elektronik lama secara percuma di seluruh Klang Valley — untuk isi rumah yang ingin melupuskan peranti lama dan untuk perniagaan yang menutup keseluruhan pejabat. Setiap kutipan berdaftar dengan DOE dan didokumenkan sepenuhnya. | Kitar semula sisa elektronik bermula di depan pintu anda. Recycling Hub menawarkan pickup e-waste percuma di Lembah Klang tanpa kuantiti minimum dan bayaran DuitNow serta-merta untuk isi rumah. Perniagaan boleh mengatur kutipan pukal, pemusnahan data bertauliah dan dokumen pematuhan. |
| `home.trustStrip.label` | Mengapa isi rumah dan perniagaan Malaysia memilih Recycling Hub | Pilihan kutipan untuk isi rumah dan perniagaan |
| `home.trustStrip.stats[0].label` | Pengumpul E-Sisa Berdaftar | Pickup rumah di Lembah Klang |
| `home.trustStrip.stats[0].value` | DOE | Percuma |
| `home.trustStrip.stats[1].label` | Kutipan di Rumah untuk Individu | Satu peranti pun boleh |
| `home.trustStrip.stats[1].value` | Percuma | Tiada minimum |
| `home.trustStrip.stats[2].label` | Bayaran DuitNow Semasa Kutipan | Bayaran isi rumah serta-merta |
| `home.trustStrip.stats[2].value` | Segera | DuitNow |
| `home.trustStrip.stats[3].label` | Kutipan Perusahaan Mematuhi SW110 | Kutipan pukal ikut sebut harga |
| `home.trustStrip.stats[3].value` | SW110 | Perniagaan |
| `home.whyRecyclingHub.eyebrow` | Mengapa Recycling Hub | Langkah seterusnya untuk peranti lama |
| `home.whyRecyclingHub.features[0].body` | Recycling Hub mengumpul dan memproses e-sisa di bawah lesen DOE yang berdaftar dan mematuhi peraturan sisa terjadual SW110. Setiap kutipan direkod, dijejaki, dan disokong dokumen yang boleh anda serahkan kepada juruaudit. | Minta kutipan peranti lama tanpa kuantiti minimum. Kongsi jenis dan keadaan peranti supaya pasukan kami boleh berbincang dengan anda sebelum pickup. |
| `home.whyRecyclingHub.features[0].icon` | shield | plug |
| `home.whyRecyclingHub.features[0].title` | Berlesen Di Bawah DOE & SW110 — Setiap Kutipan Didokumenkan | Ada telefon atau laptop lama? |
| `home.whyRecyclingHub.features[1].body` | Sebuah komputer riba lama atau penutupan pejabat sepenuhnya — Recycling Hub menjalankan proses berlesen dan didokumenkan yang sama dalam kedua-dua keadaan. Anda tidak perlu vendor berasingan untuk jumlah peribadi dan perusahaan. | Beritahu kami jenis peralatan, anggaran kuantiti dan alamat kutipan. Pickup perniagaan diberi sebut harga berasingan daripada kutipan rumah percuma. |
| `home.whyRecyclingHub.features[1].icon` | plug | shield |
| `home.whyRecyclingHub.features[1].title` | Satu Rakan Kongsi, Sama Ada Satu Telefon atau Sebuah Pejabat | Menggantikan peralatan pejabat? |
| `home.whyRecyclingHub.features[2].body` | Setiap peranti yang membawa data melalui proses pemusnahan bertauliah dengan sijil bersiri. Recycling Hub tidak menjual semula atau menyimpan peranti anda yang membawa data — pemusnahan disahkan, bukan diandaikan. | Perniagaan boleh meminta pemusnahan data bertauliah dan dokumen pematuhan. Nyatakan peranti yang menyimpan data dan rekod yang anda perlukan semasa meminta sebut harga. |
| `home.whyRecyclingHub.features[2].title` | Pemusnahan Bertauliah. Sifar Pemulihan Data. | Perlukan pemusnahan data bertauliah? |
| `home.whyRecyclingHub.headline` | Cara Mematuhi Peraturan untuk Melupuskan Peranti Elektronik Lama | Pickup rumah percuma. Kutipan pukal untuk pejabat. |
| `home.whyRecyclingHub.subtext` | Peraih besi buruk atau bilik simpanan tidak akan memadam data anda, mendokumenkan kutipan, atau memastikannya tidak berakhir di tapak pelupusan. Recycling Hub mengendalikan keseluruhan proses — berlesen, bertauliah, dan didokumenkan — untuk individu mahupun perniagaan. | Sama ada anda mahu jual laptop lama atau mengosongkan peralatan pejabat, pilih kutipan yang sesuai dengan keperluan anda. |
| `home.faq.headline` | Soalan | Sebelum anda meminta |
| `home.faq.headlineAccent` | Lazim | pickup |
| `home.faq.items[0].answer` | Tiada — sama ada satu telefon lama atau satu laci penuh peranti, kutipan individu adalah percuma di seluruh Klang Valley dan disertakan bayaran DuitNow segera. Tiada akaun atau kontrak diperlukan. | Boleh. Pickup rumah di Lembah Klang percuma tanpa kuantiti minimum, termasuk satu telefon atau laptop lama. |
| `home.faq.items[0].question` | Adakah terdapat bilangan minimum peranti untuk kutipan percuma? | Boleh kutip satu peranti sahaja? |
| `home.faq.items[1].answer` | Kutipan individu dibayar segera melalui DuitNow, sejurus peranti anda dikutip — tiada tempoh menunggu, tiada permintaan bayaran manual. Kutipan pukal dan perusahaan adalah berasaskan sebut harga dan bukan dibayar, kerana fokusnya adalah pelupusan mematuhi peraturan dan dokumentasi. | Bayaran dibuat serta-merta melalui DuitNow semasa peranti rumah anda dikutip. Bincangkan peranti anda dengan pasukan kami terlebih dahulu; kutipan perniagaan mengikut sebut harga. |
| `home.faq.items[1].question` | Bagaimana saya dibayar untuk peranti lama saya? | Bila bayaran isi rumah dibuat? |
| `home.faq.items[2].answer` | Ya — kutipan dan pemprosesan dijalankan di bawah lesen DOE yang berdaftar dan mematuhi peraturan sisa terjadual SW110, bukan operasi tidak formal atau tidak berlesen. | Kongsi jenis dan keadaan peranti dengan pasukan kami. FAQ penuh menerangkan peranti yang diterima, urusan kutipan dan dokumen perniagaan. |
| `home.faq.items[2].question` | Adakah Recycling Hub benar-benar berlesen untuk mengendalikan e-sisa? | Tidak pasti peranti anda boleh dikutip? |
| `home.faq.seeMoreLabel` | Lihat Semua Soalan Lazim | Lihat semua soalan lazim e-waste |
| `home.serviceArea.businessLink` | (added) | Urus kutipan e-waste pukal |
| `home.serviceArea.description` | (added) | Tanya tentang pickup di Kuala Lumpur, Petaling Jaya, Shah Alam, Subang Jaya, Klang, Puchong, Cheras, Cyberjaya dan Putrajaya. Kongsi alamat anda supaya kami boleh mengesahkan akses dan masa kutipan. |
| `home.serviceArea.heading` | (added) | Pickup e-waste di Lembah Klang |
| `home.serviceArea.householdLink` | (added) | Ketahui perkhidmatan kutipan e-waste di rumah |
| `home.serviceArea.quoteLink` | (added) | Minta sebut harga pickup e-waste |

## /services

### EN

| Field | Before | After |
| --- | --- | --- |
| Title | Services — Recycling Hub E-Waste Collection & Disposal | E-waste collection services \| Recycling Hub |
| Meta description | Licensed e-waste collection, certified data destruction, material recovery, and compliance reporting — Recycling Hub's full service lineup. | Explore e-waste collection services in Klang Valley: free household pickup, bulk collection and certified data destruction for businesses. Request a quote. |
| H1 | Every Stage of the E-Waste Lifecycle, Handled Under One License. | E-waste collection services |

After lengths: title **43**, description **155**.

| Copy path | Before | After |
| --- | --- | --- |
| `services.hero.description` | From the moment a device leaves your hands to the certificate that proves it was destroyed and recycled responsibly, Recycling Hub manages collection, certified destruction, material recovery, and compliance reporting — end to end. | Our e-waste collection services cover doorstep pickup in Klang Valley and bulk collection for businesses. Household pickup is free with no minimum quantity. For office equipment, ask about certified data destruction, material recovery and compliance documents. |
| `services.hero.eyebrow` | What We Do | What we do |
| `services.hero.headline` | Every Stage of the E-Waste Lifecycle, | E-waste collection services |
| `services.hero.headlineAccent` | Handled Under One License. |  |
| `services.trustBar[0]` | DOE-Registered E-Waste Collector | Free household pickup in Klang Valley |
| `services.trustBar[1]` | Certified Data Destruction on Every Collection | Certified data destruction for businesses |
| `services.gridHeading.ourServices.eyebrow` | Our Services | Our services |
| `services.gridHeading.ourServices.headline` | Six Services. One License. | Collection, data destruction and documentation |
| `services.cards.certified-data-destruction.summary` | Physical destruction of data-bearing devices with a serialized certificate and full chain-of-custody tracking. | Certified data destruction for business data-bearing devices. Discuss your storage media and documentation requirements before collection. |
| `services.cards.compliance-documentation.summary` | Consignment notes and DOE-compliant paperwork issued for every collection, ready for audit. | Compliance documents for business e-waste disposal. Confirm the records your organisation needs when requesting a quote. |
| `services.cards.esg-reporting.summary` | Diversion and impact reporting — tonnage recycled, materials recovered, and estimated carbon impact — for your ESG disclosures. | Reporting options for your organisation’s e-waste records. Ask which collection and material information is available for your reporting needs. |
| `services.cards.material-recovery.summary` | Licensed downstream processing that recovers reusable materials and diverts the rest from landfill. | Processing old electronics to recover reusable materials. Discuss the equipment types and recovery options with our team. |
| `services.intent.bulkLink` | (added) | Bulk e-waste collection for businesses |
| `services.intent.dataLink` | (added) | Certified data destruction in Malaysia |
| `services.intent.description` | (added) | For a household clear-out, tell us about your old laptop, phone, computer or monitor. Ask about chargers and cables when booking. Business collections need a quote based on the equipment and volume. |
| `services.intent.heading` | (added) | E-waste disposal for households and businesses |
| `services.intent.quoteLink` | (added) | Request an e-waste pickup quote |
| `services.crossLink.cta` | Browse Solutions | Explore e-waste solutions by sector |
| `services.crossLink.text` | Looking for the right fit by sector instead? | Services explain what we do. Find the right approach for your organisation: |

### BM

| Field | Before | After |
| --- | --- | --- |
| Title | Services — Recycling Hub E-Waste Collection & Disposal | Perkhidmatan kutipan e-waste \| Recycling Hub |
| Meta description | Licensed e-waste collection, certified data destruction, material recovery, and compliance reporting — Recycling Hub's full service lineup. | Perkhidmatan kutipan e-waste di Lembah Klang: pickup rumah percuma, kutipan pukal dan pemusnahan data untuk perniagaan. Hubungi kami untuk sebut harga. |
| H1 | Setiap Peringkat Kitaran Hayat E-Sisa, Diuruskan Di Bawah Satu Lesen. | Perkhidmatan kutipan e-waste |

After lengths: title **44**, description **151**.

| Copy path | Before | After |
| --- | --- | --- |
| `services.hero.description` | Dari saat peranti meninggalkan tangan anda hingga sijil yang membuktikan ia dimusnahkan dan dikitar semula dengan bertanggungjawab, Recycling Hub menguruskan kutipan, pemusnahan bertauliah, pemulihan bahan, dan pelaporan pematuhan — dari hujung ke hujung. | Perkhidmatan kutipan e-waste kami merangkumi pickup di rumah di Lembah Klang dan kutipan pukal untuk perniagaan. Pickup rumah percuma tanpa kuantiti minimum. Untuk peralatan pejabat, tanya tentang pemusnahan data bertauliah, pemulihan bahan dan dokumen pematuhan. |
| `services.hero.eyebrow` | Apa Yang Kami Lakukan | Apa yang kami lakukan |
| `services.hero.headline` | Setiap Peringkat Kitaran Hayat E-Sisa, | Perkhidmatan kutipan e-waste |
| `services.hero.headlineAccent` | Diuruskan Di Bawah Satu Lesen. |  |
| `services.trustBar[0]` | Pengumpul E-Sisa Berdaftar DOE | Pickup rumah percuma di Lembah Klang |
| `services.trustBar[1]` | Pemusnahan Data Bertauliah pada Setiap Kutipan | Pemusnahan data bertauliah untuk perniagaan |
| `services.gridHeading.ourServices.eyebrow` | Perkhidmatan Kami | Perkhidmatan kami |
| `services.gridHeading.ourServices.headline` | Enam Perkhidmatan. Satu Lesen. | Kutipan, pemusnahan data dan dokumentasi |
| `services.cards.certified-data-destruction.summary` | Pemusnahan fizikal peranti membawa data dengan sijil bersiri dan penjejakan rantaian jagaan penuh. | Pemusnahan data bertauliah untuk peranti perniagaan yang menyimpan data. Bincangkan media storan dan keperluan dokumentasi sebelum kutipan. |
| `services.cards.compliance-documentation.summary` | Nota konsainan dan dokumen mematuhi DOE dikeluarkan bagi setiap kutipan, sedia untuk audit. | Dokumen pematuhan bagi pelupusan e-waste perniagaan. Sahkan rekod yang organisasi anda perlukan semasa meminta sebut harga. |
| `services.cards.esg-reporting.summary` | Laporan pengalihan dan impak — tonaj dikitar semula, bahan dipulihkan, dan anggaran kesan karbon — untuk pendedahan ESG anda. | Pilihan laporan untuk rekod e-waste organisasi anda. Tanya maklumat kutipan dan bahan yang tersedia bagi keperluan pelaporan anda. |
| `services.cards.material-recovery.summary` | Pemprosesan muara bawah berlesen yang memulihkan bahan boleh guna semula dan mengalihkan selebihnya daripada tapak pelupusan. | Pemprosesan peranti elektronik lama untuk mendapatkan semula bahan yang boleh digunakan. Bincangkan jenis peralatan dan pilihan pemulihan dengan pasukan kami. |
| `services.intent.bulkLink` | (added) | Kutipan e-waste pukal untuk perniagaan |
| `services.intent.dataLink` | (added) | Pemusnahan data bertauliah di Malaysia |
| `services.intent.description` | (added) | Untuk kutipan rumah, beritahu kami tentang laptop, telefon, komputer atau monitor lama anda. Tanya tentang pengecas dan kabel semasa membuat tempahan. Kutipan perniagaan memerlukan sebut harga mengikut peralatan dan kuantiti. |
| `services.intent.heading` | (added) | Pelupusan e-waste untuk rumah dan perniagaan |
| `services.intent.quoteLink` | (added) | Minta sebut harga pickup e-waste |
| `services.crossLink.cta` | Lihat Penyelesaian | Lihat penyelesaian e-waste mengikut sektor |
| `services.crossLink.text` | Mencari pilihan mengikut sektor pula? | Perkhidmatan menerangkan apa yang kami lakukan. Cari pendekatan untuk organisasi anda: |

## /faq

### EN

| Field | Before | After |
| --- | --- | --- |
| Title | FAQ — Recycling Hub | E-waste recycling FAQ \| Recycling Hub |
| Meta description | Answers to common questions about individual pickup, bulk and enterprise collection, certified data destruction, and certificate requests. | Read our e-waste recycling FAQ for accepted devices, free pickup with no minimum and instant DuitNow payment in Klang Valley. Find answers and book today. |
| H1 | Questions, Answered. | E-waste recycling FAQ |

After lengths: title **37**, description **154**.

| Copy path | Before | After |
| --- | --- | --- |
| `faqPage.categories[0].items[0].answer` | Phones, tablets, laptops, desktops, monitors, and office IT equipment like servers, printers, and routers, plus hard drives, SSDs, and other storage devices. Get in touch if you're unsure whether a specific item — especially large appliances — is covered. | Contact us about phones, tablets, laptops, computers, monitors and office IT equipment. Share a list or photos first, especially for appliances or unusual items, so the team can confirm acceptance. |
| `faqPage.categories[0].items[0].question` | What devices do you accept? | What e-waste is accepted? |
| `faqPage.categories[0].items[1].answer` | Book online or over WhatsApp — it takes under a minute. Tell us roughly what you have and where, and we confirm a collection time. | Our service area is Klang Valley. Share your collection address when enquiring so we can confirm access and collection arrangements. No specific pickup window is guaranteed before confirmation. |
| `faqPage.categories[0].items[1].question` | How do I book a pickup? | Where is pickup available? |
| `faqPage.categories[0].items[2].answer` | Free individual pickup is currently available across Klang Valley. If you're outside that area, get in touch and we'll let you know when coverage expands. Bulk and enterprise collection is assessed by location — request a quote and we'll confirm whether we can serve you. | (removed) |
| `faqPage.categories[0].items[2].question` | Which areas do you serve? | (removed) |
| `faqPage.categories[0].items[3].answer` | Individual pickup is for households clearing out personal devices — it's free across Klang Valley, with instant payment, no minimums. Business or bulk collection is for offices, warehouses, and factories, and is scheduled around your operations with a custom quote based on volume, device types, and location. Both are collected under the same DOE-registered, SW110-compliant process. | (removed) |
| `faqPage.categories[0].items[3].question` | What's the difference between individual and business collection? | (removed) |
| `faqPage.categories[0].name` | Getting Started | Devices and collection areas |
| `faqPage.categories[1].items[0].answer` | No — whether it's a single old phone or a drawer full of devices, individual pickup is free across Klang Valley and comes with instant DuitNow payment. There's no account or contract required. | Household e-waste pickup in Klang Valley is free with no minimum quantity. A single device can be collected. Business or bulk collections are quoted separately. |
| `faqPage.categories[1].items[0].question` | Is there a minimum number of devices for a free pickup? | Is e-waste pickup free, and is there a minimum quantity? |
| `faqPage.categories[1].items[1].answer` | Individual pickups are paid instantly via DuitNow, at the moment your devices are collected — no waiting period, no manual payout request. | Household payment is made instantly via DuitNow on collection. Tell the team what devices you have and their condition before pickup. We do not publish fixed prices for individual devices. |
| `faqPage.categories[1].items[1].question` | How do I get paid for my old devices? | How do I get paid for old electronics? |
| `faqPage.categories[1].items[2].answer` | (added) | Use Request a Pickup or contact the team on WhatsApp. Share the device types and collection address. The team will confirm the collection arrangements with you. |
| `faqPage.categories[1].items[2].question` | (added) | How do I request a pickup? |
| `faqPage.categories[1].name` | Individual Pickup | Household pickup and payment |
| `faqPage.categories[2].items[0].answer` | Individual pickup is always free. Bulk and enterprise collection is quoted based on volume and device types — request a quote and we'll confirm pricing before anything is scheduled. | Business collection is quote-based. Share the device types, estimated quantity and pickup location. Tell us if you need certified data destruction or compliance documents so the quote can reflect those requirements. |
| `faqPage.categories[2].items[0].question` | Do you charge for bulk or enterprise collection? | How is bulk e-waste collection priced? |
| `faqPage.categories[2].items[1].answer` | Business and bulk collections come with full chain-of-custody records, a serialized certificate of destruction for every data-bearing asset, and an ESG-ready diversion report covering tonnage recycled and landfill diverted — all retrievable on request. | Yes. Certified data destruction is available for business collections. Discuss your data-bearing devices and documentation requirements with the team before scheduling collection. |
| `faqPage.categories[2].items[1].question` | What documentation do we get for compliance or audit purposes? | Can businesses request certified data destruction? |
| `faqPage.categories[2].items[2].answer` | (added) | Tell us which collection, data destruction and compliance records your organisation requires. The team will confirm the documents included in your quoted service before collection. |
| `faqPage.categories[2].items[2].question` | (added) | What compliance documents can I request? |
| `faqPage.categories[2].name` | Business & Bulk Collection | Business collection and data |
| `faqPage.categories[3].items[0].answer` | Any data-bearing device — phones, laptops, hard drives, servers — goes through certified destruction before it's recycled. For individuals, that's included in every pickup. For businesses, you receive a serialized certificate of destruction per asset, so you have proof it happened. | Use Track & Trace with your collection reference, if available. Otherwise, describe the collection so the team can locate the record and confirm what documentation is available. |
| `faqPage.categories[3].items[0].question` | What happens to my data before a device is recycled? | How can I check my collection status or request a certificate? |
| `faqPage.categories[3].items[1].answer` | Yes — collection and processing is carried out under a registered DOE license and SW110 scheduled-waste compliance, not an informal or unlicensed setup. | (removed) |
| `faqPage.categories[3].items[1].question` | Is Recycling Hub actually licensed to handle e-waste? | (removed) |
| `faqPage.categories[3].items[2].answer` | Use our Track & Trace / Certificate Request page — submit your booking reference if you have one, or just describe the collection, and we'll email you what you need. | (removed) |
| `faqPage.categories[3].items[2].question` | How do I request a certificate or check my collection status? | (removed) |
| `faqPage.categories[3].name` | Data, Certificates & Compliance | Collection records |
| `faqPage.headline` | Questions, | E-waste recycling FAQ |
| `faqPage.headlineAccent` | Answered. |  |
| `faqPage.subtext` | Everything we're asked most — from booking a free pickup to requesting a certificate for a past collection. Can't find what you need? Reach out and we'll answer directly. | This e-waste recycling FAQ covers household pickup in Klang Valley, business collection and the documents you may need. Household pickup is free with no minimum quantity and instant DuitNow payment. |

### BM

| Field | Before | After |
| --- | --- | --- |
| Title | FAQ — Recycling Hub | Soalan lazim kitar semula e-waste \| Recycling Hub |
| Meta description | Answers to common questions about individual pickup, bulk and enterprise collection, certified data destruction, and certificate requests. | Soalan lazim kitar semula e-waste: peranti diterima, pickup rumah percuma tanpa minimum dan bayaran DuitNow di Lembah Klang. Baca jawapan; minta kutipan. |
| H1 | Soalan, Dijawab. | Soalan lazim kitar semula e-waste |

After lengths: title **49**, description **153**.

| Copy path | Before | After |
| --- | --- | --- |
| `faqPage.categories[0].items[0].answer` | Telefon, tablet, komputer riba, desktop, monitor, dan peralatan IT pejabat seperti pelayan, pencetak, dan penghala, ditambah cakera keras, SSD, dan peranti storan lain. Hubungi kami jika anda tidak pasti sama ada item tertentu — terutamanya peralatan besar — diterima. | Hubungi kami tentang telefon, tablet, laptop, komputer, monitor dan peralatan IT pejabat. Kongsi senarai atau gambar terlebih dahulu, terutama untuk perkakas atau barang luar biasa, supaya pasukan kami boleh mengesahkan penerimaan. |
| `faqPage.categories[0].items[0].question` | Peranti apakah yang anda terima? | Apakah e-waste yang diterima? |
| `faqPage.categories[0].items[1].answer` | Tempah dalam talian atau melalui WhatsApp — ia mengambil masa kurang seminit. Beritahu kami secara kasar apa yang anda ada dan di mana, dan kami sahkan masa kutipan. | Kawasan perkhidmatan kami ialah Lembah Klang. Kongsi alamat kutipan semasa menghubungi kami supaya akses dan urusan kutipan boleh disahkan. Slot pickup tidak dijamin sebelum pengesahan. |
| `faqPage.categories[0].items[1].question` | Bagaimana saya menempah kutipan? | Di manakah pickup tersedia? |
| `faqPage.categories[0].items[2].answer` | Kutipan individu percuma kini tersedia di seluruh Klang Valley. Jika anda berada di luar kawasan itu, hubungi kami dan kami akan maklumkan apabila liputan berkembang. Kutipan pukal dan perusahaan dinilai mengikut lokasi — minta sebut harga dan kami akan sahkan sama ada kami boleh berkhidmat untuk anda. | (removed) |
| `faqPage.categories[0].items[2].question` | Kawasan manakah yang anda khidmati? | (removed) |
| `faqPage.categories[0].items[3].answer` | Kutipan individu adalah untuk isi rumah yang ingin melupuskan peranti peribadi — ia percuma di seluruh Klang Valley, dengan bayaran segera, tiada minimum. Kutipan perniagaan atau pukal adalah untuk pejabat, gudang, dan kilang, dan dijadualkan mengikut operasi dan lokasi anda dengan sebut harga khusus. Kedua-duanya dikutip di bawah proses yang sama, berdaftar DOE dan mematuhi SW110. | (removed) |
| `faqPage.categories[0].items[3].question` | Apakah perbezaan antara kutipan individu dan perniagaan? | (removed) |
| `faqPage.categories[0].name` | Bermula | Peranti dan kawasan kutipan |
| `faqPage.categories[1].items[0].answer` | Tiada — sama ada satu telefon lama atau satu laci penuh peranti, kutipan individu adalah percuma di seluruh Klang Valley dan disertakan bayaran DuitNow segera. Tiada akaun atau kontrak diperlukan. | Pickup e-waste untuk isi rumah di Lembah Klang percuma tanpa kuantiti minimum. Satu peranti pun boleh dikutip. Kutipan perniagaan atau pukal diberi sebut harga berasingan. |
| `faqPage.categories[1].items[0].question` | Adakah terdapat bilangan minimum peranti untuk kutipan percuma? | Adakah pickup e-waste percuma dan ada kuantiti minimum? |
| `faqPage.categories[1].items[1].answer` | Kutipan individu dibayar segera melalui DuitNow, sejurus peranti anda dikutip — tiada tempoh menunggu, tiada permintaan bayaran manual. | Bayaran isi rumah dibuat serta-merta melalui DuitNow semasa kutipan. Beritahu pasukan kami jenis dan keadaan peranti sebelum pickup. Kami tidak menerbitkan harga tetap untuk setiap peranti. |
| `faqPage.categories[1].items[1].question` | Bagaimana saya dibayar untuk peranti lama saya? | Bagaimana saya dibayar untuk peranti lama? |
| `faqPage.categories[1].items[2].answer` | (added) | Gunakan Minta Kutipan atau hubungi pasukan kami melalui WhatsApp. Kongsi jenis peranti dan alamat kutipan. Pasukan kami akan mengesahkan urusan kutipan dengan anda. |
| `faqPage.categories[1].items[2].question` | (added) | Bagaimana saya meminta pickup? |
| `faqPage.categories[1].name` | Kutipan Individu | Pickup rumah dan bayaran |
| `faqPage.categories[2].items[0].answer` | Kutipan individu sentiasa percuma. Kutipan pukal dan perusahaan disebut harga berdasarkan jumlah dan jenis peranti — minta sebut harga dan kami akan sahkan harga sebelum apa-apa dijadualkan. | Kutipan perniagaan mengikut sebut harga. Kongsi jenis peranti, anggaran kuantiti dan lokasi pickup. Nyatakan jika anda memerlukan pemusnahan data bertauliah atau dokumen pematuhan supaya keperluan itu diambil kira. |
| `faqPage.categories[2].items[0].question` | Adakah anda mengenakan bayaran untuk kutipan pukal atau perusahaan? | Bagaimana harga kutipan e-waste pukal ditentukan? |
| `faqPage.categories[2].items[1].answer` | Kutipan perniagaan dan pukal disertakan rekod rantaian jagaan yang lengkap, sijil pemusnahan bersiri bagi setiap aset yang membawa data, dan laporan pengalihan sedia ESG yang merangkumi tonaj dikitar semula dan pengalihan daripada tapak pelupusan — semuanya boleh diperoleh semula atas permintaan. | Boleh. Pemusnahan data bertauliah tersedia untuk kutipan perniagaan. Bincangkan peranti yang menyimpan data dan keperluan dokumentasi dengan pasukan kami sebelum menjadualkan kutipan. |
| `faqPage.categories[2].items[1].question` | Apakah dokumentasi yang kami terima untuk tujuan pematuhan atau audit? | Bolehkah perniagaan meminta pemusnahan data bertauliah? |
| `faqPage.categories[2].items[2].answer` | (added) | Beritahu kami rekod kutipan, pemusnahan data dan pematuhan yang organisasi anda perlukan. Pasukan kami akan mengesahkan dokumen yang termasuk dalam sebut harga sebelum kutipan. |
| `faqPage.categories[2].items[2].question` | (added) | Dokumen pematuhan apa yang boleh saya minta? |
| `faqPage.categories[2].name` | Perniagaan & Kutipan Pukal | Kutipan perniagaan dan data |
| `faqPage.categories[3].items[0].answer` | Sebarang peranti yang membawa data — telefon, komputer riba, cakera keras, pelayan — melalui pemusnahan bertauliah sebelum dikitar semula. Untuk individu, ini disertakan dalam setiap kutipan. Untuk perniagaan, anda menerima sijil pemusnahan bersiri bagi setiap aset, sebagai bukti ia telah dilakukan. | Gunakan Jejak & Kesan dengan nombor rujukan kutipan, jika ada. Jika tiada, terangkan kutipan anda supaya pasukan kami boleh mencari rekod dan mengesahkan dokumen yang tersedia. |
| `faqPage.categories[3].items[0].question` | Apa yang berlaku kepada data saya sebelum peranti dikitar semula? | Bagaimana saya menyemak status kutipan atau meminta sijil? |
| `faqPage.categories[3].items[1].answer` | Ya — kutipan dan pemprosesan dijalankan di bawah lesen DOE yang berdaftar dan mematuhi peraturan sisa terjadual SW110, bukan operasi tidak formal atau tidak berlesen. | (removed) |
| `faqPage.categories[3].items[1].question` | Adakah Recycling Hub benar-benar berlesen untuk mengendalikan e-sisa? | (removed) |
| `faqPage.categories[3].items[2].answer` | Gunakan halaman Jejak & Kesan / Permintaan Sijil kami — hantar rujukan tempahan anda jika ada, atau sekadar terangkan kutipan tersebut, dan kami akan e-melkan apa yang anda perlukan. | (removed) |
| `faqPage.categories[3].items[2].question` | Bagaimana saya boleh meminta sijil atau menyemak status kutipan saya? | (removed) |
| `faqPage.categories[3].name` | Data, Sijil & Pematuhan | Rekod kutipan |
| `faqPage.headline` | Soalan, | Soalan lazim kitar semula e-waste |
| `faqPage.headlineAccent` | Dijawab. |  |
| `faqPage.subtext` | Semua yang paling kerap ditanya — daripada menempah kutipan percuma hingga meminta sijil untuk kutipan lampau. Tidak jumpa apa yang anda perlukan? Hubungi kami dan kami akan jawab terus. | Soalan lazim kitar semula e-waste ini menerangkan pickup rumah di Lembah Klang, kutipan perniagaan dan dokumen yang mungkin anda perlukan. Pickup rumah percuma tanpa kuantiti minimum, dengan bayaran DuitNow serta-merta. |

## /request-quote

### EN

| Field | Before | After |
| --- | --- | --- |
| Title | Request a Quote — Recycling Hub | E-waste pickup quote \| Recycling Hub |
| Meta description | Request a quote for bulk or industrial e-waste collection, certified data destruction, or compliance reporting. | Request an e-waste pickup quote for bulk collection, certified data destruction and documents in Klang Valley. Free household pickup. Enquire on WhatsApp. |
| H1 | Request a Quote. | E-waste pickup quote |

After lengths: title **36**, description **154**.

| Copy path | Before | After |
| --- | --- | --- |
| `requestQuote.footerNote.linkText` | book it directly via WhatsApp | request free household pickup via WhatsApp |
| `requestQuote.form.emailPlaceholder` | (added) | you@example.com |
| `requestQuote.form.submitButton` | Submit Request | Continue on WhatsApp |
| `requestQuote.form.submittedButton` | Request Sent | Open WhatsApp again |
| `requestQuote.form.successMessage` | Request received — we'll confirm pricing and a collection window within 24 hours. | Your enquiry is prepared in WhatsApp. Send the message there to request a quote; this website has not submitted it. |
| `requestQuote.form.whatsappNote` | Prefer to talk it through? WhatsApp us instead. | This form prepares a WhatsApp message. You must send it there. |
| `requestQuote.help.description` | (added) | List your device types, approximate quantity and collection location below. Continue to WhatsApp, review the prepared message and send it to our general enquiries team. |
| `requestQuote.help.heading` | (added) | Need an IT asset disposal quote? |
| `requestQuote.hero.description` | Tell us what you need collected and we’ll confirm pricing and a collection window — usually within 24 hours. | Request an e-waste pickup quote for office or bulk electronics in Klang Valley. Share your equipment types and estimated volume, and mention any certified data destruction or compliance documents you need. Household pickup is free and does not need a bulk e-waste quote. |
| `requestQuote.hero.eyebrow` | Get a Quote | Business and bulk collection |
| `requestQuote.hero.headline` | Request a | E-waste pickup quote |
| `requestQuote.hero.headlineAccent` | Quote. |  |

### BM

| Field | Before | After |
| --- | --- | --- |
| Title | Request a Quote — Recycling Hub | Sebut harga pickup e-waste \| Recycling Hub |
| Meta description | Request a quote for bulk or industrial e-waste collection, certified data destruction, or compliance reporting. | Minta sebut harga pickup e-waste untuk kutipan pukal dan dokumen perniagaan di Lembah Klang. Pickup rumah percuma. Hubungi pasukan kami melalui WhatsApp. |
| H1 | Minta Sebut Harga. | Sebut harga pickup e-waste |

After lengths: title **42**, description **153**.

| Copy path | Before | After |
| --- | --- | --- |
| `requestQuote.footerNote.linkText` | tempah terus melalui WhatsApp | minta pickup rumah percuma melalui WhatsApp |
| `requestQuote.form.emailPlaceholder` | (added) | anda@contoh.com |
| `requestQuote.form.submitButton` | Hantar Permintaan | Teruskan di WhatsApp |
| `requestQuote.form.submittedButton` | Permintaan Dihantar | Buka WhatsApp semula |
| `requestQuote.form.successMessage` | Permintaan diterima — kami akan sahkan harga dan jadual kutipan dalam masa 24 jam. | Pertanyaan anda disediakan di WhatsApp. Hantar mesej di sana untuk meminta sebut harga; laman ini belum menghantarnya. |
| `requestQuote.form.whatsappNote` | Lebih suka berbincang terus? WhatsApp kami sahaja. | Borang ini menyediakan mesej WhatsApp. Anda perlu menghantarnya di sana. |
| `requestQuote.help.description` | (added) | Senaraikan jenis peranti, anggaran kuantiti dan lokasi kutipan di bawah. Teruskan ke WhatsApp, semak mesej yang disediakan dan hantarkannya kepada pasukan pertanyaan umum kami. |
| `requestQuote.help.heading` | (added) | Perlukan sebut harga pelupusan aset IT? |
| `requestQuote.hero.description` | Beritahu kami apa yang perlu dikutip dan kami akan sahkan harga serta jadual kutipan — biasanya dalam masa 24 jam. | Minta sebut harga pickup e-waste untuk peranti pejabat atau kutipan pukal di Lembah Klang. Kongsi jenis peralatan dan anggaran kuantiti, serta keperluan pemusnahan data bertauliah atau dokumen pematuhan. Pickup rumah percuma dan tidak memerlukan sebut harga pukal. |
| `requestQuote.hero.eyebrow` | Dapatkan Sebut Harga | Kutipan perniagaan dan pukal |
| `requestQuote.hero.headline` | Minta | Sebut harga pickup e-waste |
| `requestQuote.hero.headlineAccent` | Sebut Harga. |  |

## Removed Services section

The following earlier quote-card content is no longer rendered on Services. It was explicitly marked in the source as awaiting real client quotes. Entire process tabs were removed, so licensing statements and unsupported fulfilment guarantees in inactive tabs cannot be shown by selecting a tab. The replacement section is documented in Services above.

| Language | Previous quote/attribution | After |
| --- | --- | --- |
| en | We had forty old laptops sitting in a storeroom for two years. Recycling Hub had them collected within a week of booking. — Office Manager, KL trading company | Removed from rendered page; no replacement testimonial. |
| en | The team logged every single unit before it left our building. We had a full manifest the same day. — Facilities Manager, Selangor manufacturer | Removed from rendered page; no replacement testimonial. |
| en | We asked what actually happens after pickup, and Recycling Hub walked us through the whole process — nothing was vague. — Procurement Lead, KL professional services firm | Removed from rendered page; no replacement testimonial. |
| en | We needed proof our old servers were destroyed, not resold. The certificate covered every serial number. — IT Manager, Financial services firm | Removed from rendered page; no replacement testimonial. |
| en | I had a drawer full of old phones. Payment landed in DuitNow before the pickup team even left. — Household Seller, Petaling Jaya | Removed from rendered page; no replacement testimonial. |
| en | When our auditors asked for e-waste disposal records, we had the full documentation within the hour. — Compliance Officer, Klang Valley manufacturer | Removed from rendered page; no replacement testimonial. |
| en | The diversion report dropped straight into our sustainability disclosure with no extra formatting needed. — Sustainability Manager, Malaysian NGO | Removed from rendered page; no replacement testimonial. |
| bm | Kami ada empat puluh komputer riba lama tersimpan di bilik stor selama dua tahun. Recycling Hub berjaya mengutipnya dalam masa seminggu selepas tempahan. — Pengurus Pejabat, Syarikat perdagangan di KL | Removed from rendered page; no replacement testimonial. |
| bm | Pasukan itu merekod setiap unit sebelum ia meninggalkan bangunan kami. Kami dapat manifes penuh pada hari yang sama. — Pengurus Fasiliti, Pengilang di Selangor | Removed from rendered page; no replacement testimonial. |
| bm | Kami bertanya apa yang sebenarnya berlaku selepas kutipan, dan Recycling Hub menerangkan keseluruhan proses itu — tiada yang kabur. — Ketua Perolehan, Firma perkhidmatan profesional di KL | Removed from rendered page; no replacement testimonial. |
| bm | Kami perlukan bukti pelayan lama kami dimusnahkan, bukan dijual semula. Sijil itu merangkumi setiap nombor siri. — Pengurus IT, Firma perkhidmatan kewangan | Removed from rendered page; no replacement testimonial. |
| bm | Saya ada satu laci penuh telefon lama. Bayaran masuk ke DuitNow sebelum pun pasukan kutipan beredar. — Penjual Individu, Petaling Jaya | Removed from rendered page; no replacement testimonial. |
| bm | Apabila juruaudit kami meminta rekod pelupusan e-sisa, kami dapat dokumentasi penuh dalam masa sejam. — Pegawai Pematuhan, Pengilang di Lembah Klang | Removed from rendered page; no replacement testimonial. |
| bm | Laporan pengalihan itu terus digunakan dalam pendedahan kelestarian kami tanpa sebarang format tambahan diperlukan. — Pengurus Kelestarian, NGO di Malaysia | Removed from rendered page; no replacement testimonial. |

## Shared business identity

| Value | Before | After |
| --- | --- | --- |
| Legal name | Recycling Hub Sdn. Bhd. | RECYCLING HUB SDN. BHD. |
| Email | contact@recyclinghub.eco | info@recyclinghub.eco |
| General enquiries | +60 11-6766 3035 | +60 11-6080 3604 |
| Partnerships | Not listed in shared footer | +60 11-2850 3845 |
| WhatsApp destination | 601167663035 | 601160803604 |
| Footer tagline EN | Certified E-Waste Collection & Disposal for Malaysia. | Doorstep e-waste pickup in Klang Valley. |
| Footer tagline BM | Pengumpulan & Pelupusan E-Sisa Bertauliah untuk Malaysia. | Pickup e-waste di rumah di Lembah Klang. |

Footer telephone labels are translated: General enquiries / Pertanyaan umum and Partnerships / Kerjasama. Existing contact-form Quick Answers remain untouched. Static brand identity values and schema field names are language-independent; new visible copy/labels are in the catalogues. The global fallback AppConfig title/description now reference the EN catalogue instead of retaining unsupported credentials.

## Structured data and validation

| Page | Markup implemented | Local validation | External Rich Results Test |
| --- | --- | --- | --- |
| Home EN/BM | LocalBusiness with legal name, correct phone/email, two labelled contact points, nine Klang Valley cities; no street address, ratings, credentials or invented hours | JSON parses; known identity fields and absence of address checked | Home EN code-mode attempt blocked by Google: “Something went wrong — Log in and try again.” No result obtained. BM blocked by the same signed-out session. Missing real address also prevents satisfying Google’s LocalBusiness address requirement. |
| Services EN/BM | BreadcrumbList and ItemList of six Service entries from visible translated service cards | JSON parses; six entries verified | Not completed: Google code test requires a signed-in session. No Service rich-result eligibility is claimed. Individual service-page markup remains for subsequent batches. |
| FAQ EN/BM | BreadcrumbList and FAQPage only here | Every question/answer compared with rendered disclosure content | Not completed: Google code test requires a signed-in session. Google has retired FAQ rich results; markup is retained as requested for structured meaning. |
| Quote EN/BM | BreadcrumbList | JSON parses and locale links checked | Not completed: Google code test requires a signed-in session; no production deployment. |

Source guidance checked on 7 November 2026: [Google’s FAQ rich-result retirement notice](https://developers.google.com/search/updates) and [LocalBusiness required address property](https://developers.google.com/search/docs/appearance/structured-data/local-business). [Google’s localized-version guidance](https://developers.google.com/search/docs/specialty/international/localized-versions) informed reciprocal regional alternates. Local syntactic/consistency checks are not represented as Google Rich Results Test validation. The public tool loaded and accepted the Home EN markup, but running Test Code produced a sign-in error. The remaining seven samples were not submitted after that blocker. [Observed Google sign-in error](screenshots/google-validation-blocker.png).

## Checks

- `npm run check-types`: passed before final production build.
- `node scripts/verify-seo-batch.cjs` with a local server: eight EN/BM page checks for metadata limits/uniqueness, one H1, canonicals, regional alternates, schema shapes and FAQ-answer parity; Home responsiveness at 390/768/1440; required-field validation and intercepted WhatsApp destination/message.
- Browser API requests are stubbed unavailable, so published CMS posts/latest-blog content are not part of these checks. WhatsApp navigation is intercepted; no enquiry is sent.
- `npm run build -- --no-lint`: passed (optimized production build and TypeScript validation).
- Final regression suite against `next start`: passed for all eight EN/BM pages, three viewport widths, keyword placement, reciprocal alternate URLs, schema parity and intercepted WhatsApp handoff. Results: [batch-1-checks.json](batch-1-checks.json).
- Mobile Home and BM Quote screenshots were visually inspected. Existing decorative hero image now has truthful, translated alt text describing old televisions on shelves.

## Visual review

[Home on mobile](screenshots/home-mobile.png) · [BM quote page on mobile](screenshots/quote-bm-mobile.png)

## Still pending / next batch approval

- Google Rich Results Test requires a signed-in session; no validation result was returned. Keyword Planner data and the published blog inventory remain unavailable. BM keyword choices remain provisional.
- No unique city data is available; only one Home service-area section was added, with address/access/timing confirmation language. No fabricated postcode, pickup window or city page.
- Credential claims on About, service detail pages, Solutions, Resources and legal pages remain explicitly flagged in the initial audit. They are not represented as resolved by this four-page batch. Confirm documentation/service specifics before more detailed claims.
- Six utility routes missing noindex remain a separate technical issue from this approved page batch.
- Article schemas, Contact business schema, nested detail-page breadcrumbs, and translation work beyond this batch remain for subsequent approval.
- No new content-gap pages, live slugs, deployments or external communications were created.

Review this batch before approving the next one, as required by Step 9 of the supplied brief.
