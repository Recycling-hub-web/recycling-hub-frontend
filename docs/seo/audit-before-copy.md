# SEO audit before copy changes

Date: 7 November 2026 (Asia/Kuala_Lumpur). Scope: current local frontend checkout, including the previously authorized UI changes. No website copy or SEO implementation was changed for this audit.

## Evidence and limits

- 31 static public routes returned HTTP 200 in both languages: 62 URLs. These are indexable candidates, not confirmation of inclusion in Google’s index. All 31 BM pages use the same English title/description as their EN counterpart.
- Six additional EN account utility routes returned HTTP 200 without a robots meta or X-Robots-Tag noindex; included below as accidental indexability candidates. They should not receive marketing keywords. `/login` already has `noindex, nofollow`.
- `/pricing` and `/bm/pricing` are intentionally 404 (`getStaticProps: notFound`). `/dashboard-preview` has an explicit robots noindex. Internal prefixes `/admin`, `/super-admin`, `/staff`, `/driver`, `/receiving`, `/accounting`, `/profile`, `/dashboard` have configured noindex headers and are disallowed by robots.txt. API routes are disallowed. These are excluded from the indexable-page table.
- The brief’s “about 101 pages” is not verified. Internal application routes are not marketing pages. CMS blog posts are dynamic and could add URLs; the production published-post inventory is unavailable.
- Live robots.txt and sitemap.xml could not be retrieved through the web tool; the execution host could not resolve the live hostname. No production crawl, Search Console status, or deployed version is claimed. No sitemap generator or static sitemap was found in this frontend checkout.
- Browser audit used the installed Chromium against the local Next.js server. API requests were deliberately returned as unavailable to avoid dependence on the offline backend. Blog listing/post counts cannot be assessed; homepage/latest-blog cards are omitted by the unavailable API.
- Word counts are estimates from whitespace-split `main.textContent`, excluding navbar/footer and including only content mounted at audit time. Collapsed FAQ answers and inactive feature tabs are not all mounted; blog content is absent. Utility counts use body text. These are reproducible rendered-state estimates, not full editorial word counts.
- “Current keyword” is inferred from the rendered H1/title, not measured rankings or validated search volume. EN/BM presence distinguishes accessible routes from translated content and translated metadata.
- No JSON-LD scripts were found in the audited static public rendered states or the frontend source search. This has not been tested in Google Rich Results Test.

## Content locations

| Content | Current source | Finding |
| --- | --- | --- |
| Most public body copy | `src/locales/en.ts`, `src/locales/bm.ts` | Canonical bilingual catalogues; `useDictionary` selects by Next router locale. |
| Metadata | `src/pages/**/*.tsx`; home uses `src/config/site.config.ts` | Mostly hard-coded English, including BM URLs. Move future edits into the bilingual catalogues. |
| About, pricing and shared brand strings | `src/constants/content.ts` and public components | About body remains English in BM. Pricing is unpublished. Phone, email and WhatsApp differ from the brief. |
| Shared canonical/hreflang implementation | `src/components/layout/Meta.tsx` | BM default canonical points to EN. Hreflang currently `en`, `ms`, `x-default`, not requested regional tags. BM home alternate uses `/bm/` while route convention is `/bm`. |
| Public blog | `src/pages/resources/blog/[slug].tsx`, feature `PublicBlogPostView`, API `/api/v1/blogs/` | Client fetch; generic metadata. CMS meta fields and no_index exist but public rendering does not use them. Missing post errors stay in a normal page rather than a verified HTTP 404. |
| CMS storage | Backend `apps/blogs/models.py`, serializers/views | Database-backed title/content/excerpt/meta fields; model translation fields are Arabic (`title_ar`, `content_ar`), not BM. Full BM blog content support is not currently established. |
| MDX | Repository file search | No MDX content found. Blog seed content is in backend management commands, not an authoritative production post inventory. |

## Every locally identifiable indexable candidate

Full URLs below are intended production equivalents of the locally audited routes. Shared English metadata is repeated deliberately to expose the bilingual duplication.

| URL | Current title | Meta description | H1 | Apparent current primary keyword (inferred) | Word count (approx.) | EN/BM both present? |
| --- | --- | --- | --- | --- | --- | --- |
| https://recyclinghub.eco/about | About — Recycling Hub E-Waste Collection & Disposal | A Malaysia-based team dedicated to DOE-registered, fully documented e-waste collection and disposal for households and businesses. | Three Founders. One Mandate: Built for Malaysia. | three founders. one mandate: built for malaysia. | 360 | Routes yes; body English on both; metadata EN on both |
| https://recyclinghub.eco/bm/about | About — Recycling Hub E-Waste Collection & Disposal | A Malaysia-based team dedicated to DOE-registered, fully documented e-waste collection and disposal for households and businesses. | Three Founders. One Mandate: Built for Malaysia. | three founders. one mandate: built for malaysia. | 360 | Routes yes; body English on both; metadata EN on both |
| https://recyclinghub.eco/contact | Contact — Recycling Hub E-Waste Collection | Have a question about e-waste collection or bulk disposal? We're here to help. Reach us by email or WhatsApp. | Not Sure If You Need This? Let's Find Out. | not sure if you need this? let's find out. | 323 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/contact | Contact — Recycling Hub E-Waste Collection | Have a question about e-waste collection or bulk disposal? We're here to help. Reach us by email or WhatsApp. | Tidak Pasti Sama Ada Anda Memerlukan Ini? Mari Kita Ketahui. | tidak pasti sama ada anda memerlukan ini? mari kita ketahui. | 315 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/faq | FAQ — Recycling Hub | Answers to common questions about individual pickup, bulk and enterprise collection, certified data destruction, and certificate requests. | Questions, Answered. | questions, answered. | 256 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/faq | FAQ — Recycling Hub | Answers to common questions about individual pickup, bulk and enterprise collection, certified data destruction, and certificate requests. | Soalan, Dijawab. | soalan, dijawab. | 243 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/ | Recycling Hub - Certified E-Waste Collection & Disposal in Klang Valley, Malaysia | Recycling Hub provides DOE-registered, certified e-waste collection and disposal — free doorstep pickup for individuals across Klang Valley, and SW110-compliant bulk collection for businesses across Malaysia. | Registered E-Waste Recycling in Klang Valley, Malaysia | registered e-waste recycling in klang valley, malaysia | 545 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm | Recycling Hub - Certified E-Waste Collection & Disposal in Klang Valley, Malaysia | Recycling Hub provides DOE-registered, certified e-waste collection and disposal — free doorstep pickup for individuals across Klang Valley, and SW110-compliant bulk collection for businesses across Malaysia. | Perkhidmatan Kitar Semula E-Sisa Berdaftar di Klang Valley, Malaysia | perkhidmatan kitar semula e-sisa berdaftar di klang valley, malaysia | 536 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/privacy | Privacy Policy — Recycling Hub | How Recycling Hub collects, uses, and protects your personal data in accordance with Malaysia's Personal Data Protection Act 2010. | Privacy Policy | privacy policy | 713 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/privacy | Privacy Policy — Recycling Hub | How Recycling Hub collects, uses, and protects your personal data in accordance with Malaysia's Personal Data Protection Act 2010. | Dasar Privasi | dasar privasi | 715 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/request-pickup | Request a Pickup — Recycling Hub | Request a free, scheduled doorstep collection for your e-waste. No account needed. | Request a Pickup. | request a pickup. | 62 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/request-pickup | Request a Pickup — Recycling Hub | Request a free, scheduled doorstep collection for your e-waste. No account needed. | Minta Kutipan. | minta kutipan. | 61 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/request-quote | Request a Quote — Recycling Hub | Request a quote for bulk or industrial e-waste collection, certified data destruction, or compliance reporting. | Request a Quote. | request a quote. | 74 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/request-quote | Request a Quote — Recycling Hub | Request a quote for bulk or industrial e-waste collection, certified data destruction, or compliance reporting. | Minta Sebut Harga. | minta sebut harga. | 74 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/resources/blog | Blog — Recycling Hub E-Waste Guides & Updates | Recycling tips, e-waste compliance updates, and news from Recycling Hub. | From the blog | from the blog | 14 | Routes yes; body English on both; metadata EN on both |
| https://recyclinghub.eco/bm/resources/blog | Blog — Recycling Hub E-Waste Guides & Updates | Recycling tips, e-waste compliance updates, and news from Recycling Hub. | From the blog | from the blog | 14 | Routes yes; body English on both; metadata EN on both |
| https://recyclinghub.eco/resources/certified-data-destruction-guide | How Certified Data Destruction Works — Recycling Hub | What actually happens to the data on your old phones, laptops, and hard drives before they're recycled. | How Certified Data Destruction Works | how certified data destruction works | 236 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/resources/certified-data-destruction-guide | How Certified Data Destruction Works — Recycling Hub | What actually happens to the data on your old phones, laptops, and hard drives before they're recycled. | Bagaimana Pemusnahan Data Bertauliah Berfungsi | bagaimana pemusnahan data bertauliah berfungsi | 234 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/resources/doe-registration-explained | What DOE Registration Means for You — Recycling Hub | Why Recycling Hub's DOE registration matters, and what it protects you from when you hand over e-waste. | What DOE Registration Means for You | what doe registration means for you | 245 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/resources/doe-registration-explained | What DOE Registration Means for You — Recycling Hub | Why Recycling Hub's DOE registration matters, and what it protects you from when you hand over e-waste. | Apa Maksud Pendaftaran DOE untuk Anda | apa maksud pendaftaran doe untuk anda | 247 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/resources/esg-reporting-for-ewaste | ESG & Sustainability Reporting for E-Waste — Recycling Hub | How e-waste collection data turns into something your sustainability team can put directly into an ESG disclosure. | ESG & Sustainability Reporting for E-Waste | esg & sustainability reporting for e-waste | 211 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/resources/esg-reporting-for-ewaste | ESG & Sustainability Reporting for E-Waste — Recycling Hub | How e-waste collection data turns into something your sustainability team can put directly into an ESG disclosure. | Pelaporan ESG & Kelestarian untuk E-Sisa | pelaporan esg & kelestarian untuk e-sisa | 224 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/resources | Resources — Recycling Hub E-Waste Guides & Compliance | Guides on DOE registration, SW110 compliance, certified data destruction, ESG reporting, and how to prepare for your e-waste pickup. | Guides to Compliant, Documented E-Waste Disposal. | guides to compliant, documented e-waste disposal. | 174 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/resources | Resources — Recycling Hub E-Waste Guides & Compliance | Guides on DOE registration, SW110 compliance, certified data destruction, ESG reporting, and how to prepare for your e-waste pickup. | Panduan untuk Pelupusan E-Sisa yang Mematuhi dan Didokumentasikan. | panduan untuk pelupusan e-sisa yang mematuhi dan didokumentasikan. | 179 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/resources/preparing-devices-for-pickup | How to Prepare Your Devices for Pickup — Recycling Hub | A practical checklist before your free doorstep collection, so pickup goes smoothly and your data stays yours. | How to Prepare Your Devices for Pickup | how to prepare your devices for pickup | 238 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/resources/preparing-devices-for-pickup | How to Prepare Your Devices for Pickup — Recycling Hub | A practical checklist before your free doorstep collection, so pickup goes smoothly and your data stays yours. | Cara Menyediakan Peranti Anda untuk Kutipan | cara menyediakan peranti anda untuk kutipan | 232 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/resources/sw110-compliance-for-businesses | SW110 Compliance for Businesses — Recycling Hub | What SW110 scheduled-waste classification means for offices, warehouses, and factories generating e-waste. | SW110 Compliance for Businesses | sw110 compliance for businesses | 238 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/resources/sw110-compliance-for-businesses | SW110 Compliance for Businesses — Recycling Hub | What SW110 scheduled-waste classification means for offices, warehouses, and factories generating e-waste. | Pematuhan SW110 untuk Perniagaan | pematuhan sw110 untuk perniagaan | 236 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/resources/understanding-your-certificate | Understanding Your Recycling Certificate — Recycling Hub | What's on a Recycling Hub certificate, and how to use it for your own records or an audit. | Understanding Your Recycling Certificate | understanding your recycling certificate | 212 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/resources/understanding-your-certificate | Understanding Your Recycling Certificate — Recycling Hub | What's on a Recycling Hub certificate, and how to use it for your own records or an audit. | Memahami Sijil Kitar Semula Anda | memahami sijil kitar semula anda | 216 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/services/bulk-industrial-collection | Bulk & Industrial Collection — Recycling Hub | Recurring, volume-based e-waste collection for offices, warehouses, and factories, scheduled around your operations. | Bulk & Industrial Collection | bulk & industrial collection | 215 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/services/bulk-industrial-collection | Bulk & Industrial Collection — Recycling Hub | Recurring, volume-based e-waste collection for offices, warehouses, and factories, scheduled around your operations. | Pengumpulan Pukal & Industri | pengumpulan pukal & industri | 228 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/services/certified-data-destruction | Certified Data Destruction — Recycling Hub | Serialized, chain-of-custody-tracked destruction of data-bearing devices before recycling. | Certified Data Destruction | certified data destruction | 217 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/services/certified-data-destruction | Certified Data Destruction — Recycling Hub | Serialized, chain-of-custody-tracked destruction of data-bearing devices before recycling. | Pemusnahan Data Bertauliah | pemusnahan data bertauliah | 230 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/services/collection-pickup | E-Waste Collection & Pickup — Recycling Hub | Free, scheduled doorstep collection for individual and household electronics across Malaysia. | E-Waste Collection & Pickup | e-waste collection & pickup | 257 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/services/collection-pickup | E-Waste Collection & Pickup — Recycling Hub | Free, scheduled doorstep collection for individual and household electronics across Malaysia. | Kutipan & Pengumpulan E-Sisa | kutipan & pengumpulan e-sisa | 278 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/services/compliance-documentation | Compliance Documentation — Recycling Hub | Consignment notes and DOE-compliant paperwork issued for every collection, ready for audit. | Compliance Documentation | compliance documentation | 191 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/services/compliance-documentation | Compliance Documentation — Recycling Hub | Consignment notes and DOE-compliant paperwork issued for every collection, ready for audit. | Dokumentasi Pematuhan | dokumentasi pematuhan | 209 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/services/esg-reporting | ESG & Sustainability Reporting — Recycling Hub | Diversion and impact reporting for every bulk collection, formatted for direct use in ESG disclosures. | ESG & Sustainability Reporting | esg & sustainability reporting | 182 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/services/esg-reporting | ESG & Sustainability Reporting — Recycling Hub | Diversion and impact reporting for every bulk collection, formatted for direct use in ESG disclosures. | Pelaporan ESG & Kelestarian | pelaporan esg & kelestarian | 204 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/services | Services — Recycling Hub E-Waste Collection & Disposal | Licensed e-waste collection, certified data destruction, material recovery, and compliance reporting — Recycling Hub's full service lineup. | Every Stage of the E-Waste Lifecycle, Handled Under One License. | every stage of the e-waste lifecycle, handled under one license. | 265 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/services | Services — Recycling Hub E-Waste Collection & Disposal | Licensed e-waste collection, certified data destruction, material recovery, and compliance reporting — Recycling Hub's full service lineup. | Setiap Peringkat Kitaran Hayat E-Sisa, Diuruskan Di Bawah Satu Lesen. | setiap peringkat kitaran hayat e-sisa, diuruskan di bawah satu lesen. | 282 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/services/material-recovery | Recycling & Material Recovery — Recycling Hub | Licensed downstream processing that recovers reusable materials and keeps e-waste out of landfill. | Recycling & Material Recovery | recycling & material recovery | 205 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/services/material-recovery | Recycling & Material Recovery — Recycling Hub | Licensed downstream processing that recovers reusable materials and keeps e-waste out of landfill. | Kitar Semula & Pemulihan Bahan | kitar semula & pemulihan bahan | 234 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/solutions/corporate-enterprise | Corporate & Enterprise E-Waste Solutions — Recycling Hub | Recurring bulk collection, certified data destruction, and ESG reporting for offices, corporate IT, and manufacturing facilities. | Corporate & Enterprise | corporate & enterprise | 209 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/solutions/corporate-enterprise | Corporate & Enterprise E-Waste Solutions — Recycling Hub | Recurring bulk collection, certified data destruction, and ESG reporting for offices, corporate IT, and manufacturing facilities. | Korporat & Perusahaan | korporat & perusahaan | 233 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/solutions/education | E-Waste Solutions for Education — Recycling Hub | Bulk collection for computer lab upgrades and campus-wide IT refresh cycles, with certified destruction of student and staff data. | Education | education | 197 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/solutions/education | E-Waste Solutions for Education — Recycling Hub | Bulk collection for computer lab upgrades and campus-wide IT refresh cycles, with certified destruction of student and staff data. | Pendidikan | pendidikan | 218 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/solutions/government-glc | E-Waste Solutions for Government & GLC — Recycling Hub | Procurement-ready compliance and transparent documentation for public sector agencies and government-linked companies. | Government & GLC | government & glc | 191 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/solutions/government-glc | E-Waste Solutions for Government & GLC — Recycling Hub | Procurement-ready compliance and transparent documentation for public sector agencies and government-linked companies. | Kerajaan & GLC | kerajaan & glc | 208 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/solutions/healthcare | E-Waste Solutions for Healthcare — Recycling Hub | Chain-of-custody-tracked collection and certified destruction for retired hospital and clinic IT equipment. | Healthcare | healthcare | 200 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/solutions/healthcare | E-Waste Solutions for Healthcare — Recycling Hub | Chain-of-custody-tracked collection and certified destruction for retired hospital and clinic IT equipment. | Penjagaan Kesihatan | penjagaan kesihatan | 216 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/solutions | Solutions — Recycling Hub E-Waste Collection | Tailored e-waste collection, certified data destruction, and compliance reporting for corporate, household, government, education, healthcare, and nonprofit sectors. | Tailored E-Waste Solutions, Sector by Sector. | tailored e-waste solutions, sector by sector. | 149 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/solutions | Solutions — Recycling Hub E-Waste Collection | Tailored e-waste collection, certified data destruction, and compliance reporting for corporate, household, government, education, healthcare, and nonprofit sectors. | Penyelesaian E-Sisa Disesuaikan, Sektor demi Sektor. | penyelesaian e-sisa disesuaikan, sektor demi sektor. | 169 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/solutions/individuals-households | E-Waste Solutions for Individuals & Households — Recycling Hub | Free doorstep pickup and instant DuitNow payment for personal electronics — no minimums, no paperwork. | Individuals & Households | individuals & households | 207 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/solutions/individuals-households | E-Waste Solutions for Individuals & Households — Recycling Hub | Free doorstep pickup and instant DuitNow payment for personal electronics — no minimums, no paperwork. | Individu & Isi Rumah | individu & isi rumah | 221 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/solutions/ngo | E-Waste Solutions for NGOs & Non-Profits — Recycling Hub | Flexible, lower-volume collection at partnership rates for nonprofits and community organizations. | NGO & Non-Profit | ngo & non-profit | 201 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/solutions/ngo | E-Waste Solutions for NGOs & Non-Profits — Recycling Hub | Flexible, lower-volume collection at partnership rates for nonprofits and community organizations. | NGO & Bukan Untung | ngo & bukan untung | 224 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/terms | Terms of Service — Recycling Hub | The terms and conditions governing your use of Recycling Hub's e-waste collection and disposal services. | Terms of Service | terms of service | 982 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/terms | Terms of Service — Recycling Hub | The terms and conditions governing your use of Recycling Hub's e-waste collection and disposal services. | Terma Perkhidmatan | terma perkhidmatan | 935 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/track-trace | Track & Trace / Certificate Request — Recycling Hub | Request a certificate of destruction, an ESG diversion report, or a status update on your e-waste collection. | Request Your Certificate or Status. | request your certificate or status. | 176 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/bm/track-trace | Track & Trace / Certificate Request — Recycling Hub | Request a certificate of destruction, an ESG diversion report, or a status update on your e-waste collection. | Minta Sijil atau Status Anda. | minta sijil atau status anda. | 161 | Routes yes; body translated; metadata EN on both |
| https://recyclinghub.eco/account-locked | Account Locked — Recycling Hub | This account is temporarily locked. | Account temporarily locked | account temporarily locked | 27 | No; EN utility route only |
| https://recyclinghub.eco/forgot-password | Forgot Password — Recycling Hub | Request a password reset link for your Recycling Hub account. | Forgot your password? | forgot your password? | 24 | No; EN utility route only |
| https://recyclinghub.eco/reset-password | Reset Password — Recycling Hub | Reset your Recycling Hub password. | Reset your password | reset your password | 19 | No; EN utility route only |
| https://recyclinghub.eco/set-password | Set Your Password — Recycling Hub | Set your password to finish activating your Recycling Hub account. | Set your password | set your password | 18 | No; EN utility route only |
| https://recyclinghub.eco/unauthorized | Access Denied — Recycling Hub | You don't have access to this page. | You don't have access to this | you don't have access to this | 19 | No; EN utility route only |
| https://recyclinghub.eco/verify-otp | Verify Code — Recycling Hub | Enter your verification code to sign in. | (none) | verify code | 1 | No; EN utility route only |

## Blocking claims and trust findings

The user confirmed in this session that DOE registration is not confirmed. Proposed first-batch treatment: remove claims that Recycling Hub is DOE-registered/licensed/a certified collector, without replacing them with equivalent unsupported wording. Regulatory educational discussion is distinct from claiming company registration; review it in context. No registration number or credentials will be invented.

The following route/language pairs have rendered text or metadata matching DOE/registration/licensing terms. This broad list includes regulatory references that are not necessarily company credential claims. Each row must be reviewed in context. Exact captured snippets are in `audit-evidence.json`; source-only inactive content also requires review.

| Route | Flagged languages | Treatment |
| --- | --- | --- |
| / | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /about | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /contact | bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /faq | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /privacy | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /request-pickup | bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /request-quote | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /resources | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /resources/blog | bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /resources/certified-data-destruction-guide | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /resources/doe-registration-explained | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /resources/esg-reporting-for-ewaste | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /resources/preparing-devices-for-pickup | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /resources/sw110-compliance-for-businesses | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /resources/understanding-your-certificate | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /services | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /services/bulk-industrial-collection | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /services/certified-data-destruction | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /services/collection-pickup | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /services/compliance-documentation | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /services/esg-reporting | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /services/material-recovery | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /solutions | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /solutions/corporate-enterprise | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /solutions/education | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /solutions/government-glc | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /solutions/healthcare | bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /solutions/individuals-households | bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /solutions/ngo | bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /terms | en, bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |
| /track-trace | bm | Review company claims separately from regulation descriptions; remove unverified company credentials in its batch. |

Other findings:

- `BRAND` currently uses `contact@recyclinghub.eco`, `+60 11-6766 3035`, and WhatsApp `601167663035`. Requested replacements: `info@recyclinghub.eco`; General enquiries `+60 11-6080 3604`; Partnerships `+60 11-2850 3845`. Labels must come from both catalogues. Keep legal name `RECYCLING HUB SDN. BHD.` consistent. Do not add a street address without confirmation.
- `home.featureTabs.tabs` includes quotations explicitly marked TODO “replace with real client quote”; `FeatureTabs` renders quote/author cards on Services. Remove these unsupported testimonials in the first batch rather than presenting them as evidence.
- About’s hero claims “Three Founders” and its Foundation/Core Insight sections repeat the scrap-dealer comparison. Confirm the factual founder count separately; consolidate framing when About is approved for its batch.
- No exact phrase “certified physical destruction” was found in frontend source. Physical destruction descriptions do exist; standardize the service name to “certified data destruction” without claiming that software wiping is always reversible.
- Home already has three FAQs, not six. One asserts a registered DOE licence. Replace that unverified credential question with an accepted-electronics question; retain high-intent free-pickup/payment summaries, use `/faq` for full answers. Keep Contact Quick Answers unchanged.
- Services/Solutions already cross-link. Preserve and improve anchors; don’t add redundant competing content.
- `/request-quote` is the actual route. Do not rename to `/request-a-quote`; use existing slug and update the brief’s mapping. The current quote submit handler only sets client success state: no request is sent/stored. Remove unsupported submission/24-hour guarantees or route to a working contact flow in a separately reviewed implementation.
- Many content descriptions promise nationwide collection, while the brief establishes Klang Valley as the service area. Review geography in each batch; do not expand the area without confirmation.

## Proposed keyword ownership (not implemented)

Each EN content page gets a distinct primary term. Legal pages use branded document intent; account utilities should be noindexed and get no marketing keyword. CMS blog terms require the published inventory before final assignment. These are editorial ownership proposals, not claims of keyword volume. BM equivalents remain provisional until Keyword Planner data is supplied/accessible.

| Existing route | Proposed primary (EN) | Secondary keywords |
| --- | --- | --- |
| / | e-waste recycling Malaysia | e-waste pickup Klang Valley; free e-waste pickup; recycle old electronics for cash |
| /services | e-waste collection services | certified data destruction Malaysia; e-waste disposal Malaysia |
| /services/bulk-industrial-collection | bulk e-waste collection Malaysia | corporate IT disposal; scheduled waste disposal Malaysia; office e-waste recycling |
| /solutions | e-waste solutions for businesses | e-waste recycling for government and GLC; e-waste recycling for schools; e-waste recycling for hospitals; e-waste recycling for NGOs |
| /request-quote | e-waste pickup quote | bulk e-waste quote; IT asset disposal quote |
| /faq | e-waste recycling FAQ | what e-waste is accepted; is e-waste pickup free |
| /about | e-waste recycling company Klang Valley | Recycling Hub Sdn Bhd; Klang Valley electronics recycler |
| /contact | book e-waste pickup | e-waste pickup WhatsApp; Recycling Hub general enquiries |
| /track-trace | track e-waste collection | recycling certificate; e-waste collection status |
| /resources | e-waste recycling guide Malaysia | how to recycle electronics; electronic waste guides |
| /request-pickup | e-waste pickup request | request e-waste callback; household collection request |
| /services/collection-pickup | doorstep electronics collection Klang Valley | household e-waste collection; e-waste pickup near me; recycle phone charger and cables |
| /services/certified-data-destruction | certified data destruction Malaysia | hard drive destruction; IT asset data security |
| /services/compliance-documentation | e-waste compliance documentation | e-waste chain of custody; scheduled waste records |
| /services/esg-reporting | e-waste ESG reporting services | recycling diversion reports; corporate recycling reporting |
| /services/material-recovery | electronic waste material recovery | electronics recycling process; recover recyclable materials |
| /solutions/corporate-enterprise | enterprise IT asset disposal solutions | corporate electronics retirement; office IT decommissioning |
| /solutions/education | school e-waste recycling Malaysia | university electronics disposal; campus recycling |
| /solutions/government-glc | government e-waste recycling Malaysia | GLC IT asset disposal; public sector electronics recycling |
| /solutions/healthcare | healthcare electronics recycling Malaysia | hospital IT disposal; healthcare data destruction |
| /solutions/individuals-households | household electronics recycling Klang Valley | recycle old computer; dispose old monitor; recycle old phone for cash |
| /solutions/ngo | NGO electronics recycling Malaysia | non-profit IT disposal; community electronics collection |
| /resources/blog | Recycling Hub news and updates | electronics recycling news; company recycling updates |
| /resources/certified-data-destruction-guide | how certified data destruction works | prepare data-bearing devices; data destruction methods |
| /resources/doe-registration-explained | DOE e-waste registration explained | check collector registration; Malaysia e-waste regulation |
| /resources/esg-reporting-for-ewaste | how to report e-waste in ESG disclosures | e-waste sustainability metrics; recycling reporting guide |
| /resources/preparing-devices-for-pickup | prepare electronics for recycling pickup | e-waste collection checklist; back up devices before recycling |
| /resources/sw110-compliance-for-businesses | SW110 compliance guide for businesses | SW110 e-waste classification; scheduled waste obligations |
| /resources/understanding-your-certificate | how to read a recycling certificate | recycling certificate fields; collection documentation guide |
| /privacy | Recycling Hub privacy policy | personal data handling; customer privacy |
| /terms | Recycling Hub terms of service | collection service terms; recycling service conditions |

Cannibalisation decisions:

- Home owns broad “e-waste recycling Malaysia”. Collection/Pickup owns doorstep collection details. Household Solutions owns audience-specific reuse/payout questions. Keep consumer laptop/phone terms as contextual secondary phrases rather than repeating the home primary everywhere.
- Contact owns “book e-waste pickup” per the brief; `/request-pickup` owns “e-waste pickup request”. Both link clearly to the working collection path. Reassess whether distinct pages add value after the conversion flow is reviewed; no URL consolidation is authorized yet.
- Services owns the service catalogue; Solutions owns sector intent. Bulk collection and enterprise solutions keep operational-service versus sector-selection intent distinct.
- Certified data destruction service owns the commercial keyword. Its resource guide owns “how ... works”. ESG services/guide and compliance service/guide follow the same separation.
- Full FAQ owns “e-waste recycling FAQ”. Home has only short decision-making summaries and an all-FAQ link.
- Track & Trace owns collection tracking. The certificate resource owns interpreting certificate fields.

## First batch proposed for review

Only Home, `/services`, `/faq`, `/request-quote`, plus the shared metadata/brand dependencies needed to render those correctly. No further page batch until approval. Before/after EN and BM copy will be supplied with this batch after this audit has been shown.

1. Move titles/descriptions and all newly edited strings through `en.ts` / `bm.ts`. Keep exactly one H1 and natural primary usage in the opening paragraph. Check title length <=60 and description length 140–155 per language; report any conflict rather than stuffing a consumer differentiator into an unrelated business promise.
2. Remove unconfirmed company credential claims and unsupported service-page testimonial cards within the batch. Keep real service capabilities from the business brief; no invented statistics or payouts.
3. Home: retain three short high-intent questions, remove the licence assertion, link to full FAQ; add one service-area section only. Services: clarify “what we do”, link to Solutions and the existing quote route. FAQ: full categorized answers; FAQPage JSON-LD only here, with exact visible Q&A matching the schema. Quote: business quote intent and truthful next-step wording; its simulated success is a separate functional blocker.
4. Shared SEO: self-canonicals per locale and reciprocal `en-MY`, `ms-MY`, `x-default`. For Home, local-business schema using the confirmed legal name, email/phone and Klang Valley city list, without a placeholder address or invented opening hours. Service and breadcrumb/article schemas are completed page-by-page in subsequent approved batches, using actual content/dates.
5. BM provisional topic directions: Home “kitar semula sisa elektronik”; Services “perkhidmatan kutipan e-waste”; FAQ “soalan lazim kitar semula e-waste”; Quote “sebut harga pickup e-waste”. Use native wording and retain “e-waste”, “pickup”, “DuitNow” where appropriate. No assertion of highest volume without Keyword Planner evidence.

## Location-page proposal (do not publish)

Proposed route shape `/areas/[city]`. No city pages can be justified from the available content. For now list Kuala Lumpur, Petaling Jaya, Shah Alam, Subang Jaya, Klang, Puchong, Cheras, Cyberjaya and Putrajaya in one Home/Services service-area section, subject to operational confirmation of coverage.

For EACH city obtain: covered/excluded postcodes; actual neighbourhoods; typical pickup days/windows and booking lead time; access/condo loading-bay requirements; household versus business availability; a truthful local operational note. Do not infer coverage from a city boundary, invent pickup windows or duplicate a city-name-swapped template.

## Content-gap outlines (draft only, not pages)

These are editorial plans, not published content. No “two highest-volume BM topics” can be selected without Keyword Planner data. Provisional BM drafts below prioritize useful consumer tasks, not verified volume.

| Draft title | Primary keyword | Proposed H2s | Internal links |
| --- | --- | --- | --- |
| What electronics can I recycle? | electronics accepted for recycling | Accepted devices (business-confirmed list); What we cannot accept (confirm); Chargers, cables and accessories; Preparing your collection | Collection/pickup service; FAQ; request-pickup |
| How much can I get for my old laptop or phone? | old electronics payout Malaysia | How devices are evaluated; What affects payment; When DuitNow payment happens; Household payouts versus business quotes | Household Solutions; collection/pickup; request-pickup |
| How to wipe your phone or laptop before recycling | wipe devices before recycling | Back up files; Sign out and remove activation locks; Reset guidance by device; When you cannot turn the device on | Preparing-devices guide; certified data destruction service |
| Where to recycle electronics in KL and Selangor | where to recycle electronics in KL | Confirmed Klang Valley pickup coverage; Home and condo collection; Business collection; Booking and preparation | Home service-area section; collection/pickup; Contact |
| E-waste disposal for offices: a checklist | office e-waste disposal checklist | Inventory and approvals; Data preparation; Quotes and collection access; Records to retain | Bulk collection; compliance documentation; request-quote |
| Barang elektronik apa yang boleh dikitar semula? (provisional BM) | barang elektronik untuk kitar semula | Peranti yang diterima (sahkan); Barang yang tidak diterima (sahkan); Kabel dan pengecas; Persediaan pickup | BM collection/pickup; BM FAQ; BM request-pickup |
| Bagaimana bayaran untuk laptop dan telefon lama ditentukan? (provisional BM) | bayaran kitar semula laptop lama | Penilaian peranti; Faktor bayaran; Bayaran DuitNow; Kutipan rumah dan sebut harga perniagaan | BM household Solutions; BM collection/pickup; BM request-pickup |

Each future draft will answer its question in the first 2–3 sentences. Accepted/excluded lists require confirmation; payout article describes evaluation without prices until real ranges are supplied. Device reset instructions require current manufacturer references when drafted. No new pages or URLs are approved by this outline.

## External validation pending

- Google Keyword Planner: not accessed; BM keyword popularity/volume unverified. Need an account-connected session or exported Malaysia/BM keyword results before final keyword choices.
- Google Rich Results Test: not run. No newly implemented schemas exist in this audit. Validate every applicable deployed URL/schema after the approved batch, record actual results, and distinguish rich-result eligibility from general Schema.org validity.
- Published CMS blog inventory and dates: unavailable; need a reachable public API/export, including canonical URLs, publication/update dates, indexability and BM versions. Do not invent dates or duplicate generic Article schema across unknown posts.
- Production robots/sitemap/index status: unavailable; verify once the live domain is accessible. The local candidate inventory must not be described as a complete production index.

## Approval boundary

The brief explicitly says “Show me this table before you edit anything.” This report and its CSV/evidence are the only new repository files from the SEO task. Website copy is untouched. Review this audit before the first four-page batch; approval for later batches is separately required by Step 9.
