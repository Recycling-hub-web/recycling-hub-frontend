import Head from 'next/head';
import { useRouter } from 'next/router';

import { BRAND, type SolutionSlug } from '../../constants/content';
import { useDictionary } from '../../hooks/useDictionary';

const SolutionBreadcrumbs = ({ slug }: { slug?: SolutionSlug }) => {
  const { locale } = useRouter();
  const { nav, solutions } = useDictionary();
  const root = `https://${BRAND.website}${locale === 'bm' ? '/bm' : ''}`;
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: nav.home,
      item: `${root}${locale === 'bm' ? '' : '/'}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: nav.solutions,
      item: `${root}/solutions`,
    },
    ...(slug
      ? [
          {
            '@type': 'ListItem',
            position: 3,
            name: solutions.cards[slug].title,
            item: `${root}/solutions/${slug}`,
          },
        ]
      : []),
  ];
  return (
    <Head>
      <script
        key="solution-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items,
          }).replace(/</g, '\\u003c'),
        }}
      />
    </Head>
  );
};

export { SolutionBreadcrumbs };
