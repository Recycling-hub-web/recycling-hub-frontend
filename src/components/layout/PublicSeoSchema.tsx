import Head from 'next/head';
import { useRouter } from 'next/router';

import { BRAND, SERVICES } from '../../constants/content';
import { useDictionary } from '../../hooks/useDictionary';

const SITE_URL = `https://${BRAND.website}`;
const CITIES = [
  'Kuala Lumpur',
  'Petaling Jaya',
  'Shah Alam',
  'Subang Jaya',
  'Klang',
  'Puchong',
  'Cheras',
  'Cyberjaya',
  'Putrajaya',
];
const PATHS = {
  home: '/',
  services: '/services',
  faq: '/faq',
  quote: '/request-quote',
};

type PublicSeoSchemaProps = { page: keyof typeof PATHS };

const PublicSeoSchema = ({ page }: PublicSeoSchemaProps) => {
  const { locale } = useRouter();
  const { seo, nav, footer, services, faqPage } = useDictionary();
  const localizedUrl = (path: string) =>
    `${SITE_URL}${locale === 'bm' ? '/bm' : ''}${path === '/' && locale === 'bm' ? '' : path}`;
  const url = localizedUrl(PATHS[page]);
  const businessId = `${SITE_URL}/#business`;
  const graph: Record<string, unknown>[] = [];

  if (page === 'home') {
    graph.push({
      '@type': 'LocalBusiness',
      '@id': businessId,
      name: BRAND.name,
      legalName: BRAND.legalName,
      url: `${SITE_URL}/`,
      telephone: BRAND.phone,
      email: BRAND.email,
      areaServed: CITIES.map((name) => ({ '@type': 'City', name })),
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: BRAND.phone,
          contactType: footer.generalEnquiries,
        },
      ],
    });
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: nav.home,
          item: localizedUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: seo[page].title.split(' | ')[0],
          item: url,
        },
      ],
    });
  }

  if (page === 'services') {
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#services`,
      itemListElement: SERVICES.map(({ slug }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          '@id': `${localizedUrl(`/services/${slug}`)}#service`,
          name: services.cards[slug].title,
          description: services.cards[slug].summary,
          url: localizedUrl(`/services/${slug}`),
          provider: { '@id': businessId },
          areaServed: { '@type': 'Place', name: 'Klang Valley' },
        },
      })),
    });
  }

  if (page === 'faq') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      url,
      inLanguage: locale === 'bm' ? 'ms-MY' : 'en-MY',
      mainEntity: faqPage.categories.flatMap(({ items }) =>
        items.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      ),
    });
  }

  return (
    <Head>
      <script
        key="public-seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': graph,
          }).replace(/</g, '\\u003c'),
        }}
      />
    </Head>
  );
};

export { PublicSeoSchema };
