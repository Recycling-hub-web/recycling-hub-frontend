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
    />
  );
};

export { FaqSection };
