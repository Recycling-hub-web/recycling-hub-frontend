import Link from 'next/link';

import { useDictionary } from '../../../hooks/useDictionary';
import { FaqAccordion } from './FaqAccordion';

const FaqSection = () => {
  const { home } = useDictionary();
  const { faq: content } = home;

  return (
    <FaqAccordion
      items={content.items}
      heading={
        <h2 className="mb-12 text-center font-montserrat text-3xl font-bold leading-tight tracking-[-0.02em] text-neutral-950 md:text-4xl lg:text-5xl">
          {content.headline} <span>{content.headlineAccent}</span>
        </h2>
      }
      footer={
        <div className="mt-8 text-center">
          <Link
            href={content.seeMoreHref}
            className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            {content.seeMoreLabel} →
          </Link>
        </div>
      }
    />
  );
};

export { FaqSection };
