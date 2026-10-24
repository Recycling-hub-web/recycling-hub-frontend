import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { AppConfig } from '../../config/site.config';
import { BRAND } from '../../constants/content';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

const SITE_URL = `https://${BRAND.website}`;

const Meta = (props: IMetaProps) => {
  const router = useRouter();

  const rawPath = router.asPath.split('?')[0]?.split('#')[0] ?? '/';
  const path =
    rawPath === '/bm' || rawPath.startsWith('/bm/')
      ? rawPath.slice(3) || '/'
      : rawPath;

  const canonical = props.canonical ?? `${SITE_URL}${path}`;
  const languageAlternates = [
    { hrefLang: 'en', href: `${SITE_URL}${path}` },
    { hrefLang: 'ms', href: `${SITE_URL}/bm${path}` },
    { hrefLang: 'x-default', href: `${SITE_URL}${path}` },
  ];

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href={`${router.basePath}/apple-touch-icon.png`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${router.basePath}/favicon-32x32.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${router.basePath}/favicon-16x16.png`}
          key="icon16"
        />
        <link
          rel="icon"
          href={`${router.basePath}/favicon.ico`}
          key="favicon"
        />
      </Head>
      <NextSeo
        title={props.title}
        description={props.description}
        canonical={canonical}
        languageAlternates={languageAlternates}
        openGraph={{
          title: props.title,
          description: props.description,
          url: canonical,
          locale: router.locale === 'bm' ? 'ms_MY' : 'en_MY',
          site_name: AppConfig.site_name,
        }}
      />
    </>
  );
};

export { Meta };
