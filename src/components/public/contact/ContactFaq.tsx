import { useDictionary } from '../../../hooks/useDictionary';
import { SectionHeading } from '../../ui/SectionHeading';
import { FaqAccordion } from '../shared/FaqAccordion';

const ContactFaq = () => {
  const {
    contact: { faq },
  } = useDictionary();

  return (
    <FaqAccordion
      items={faq.items}
      heading={
        <div className="mb-12 text-center">
          <SectionHeading eyebrow={faq.eyebrow} headline={faq.headline} />
        </div>
      }
      sectionClassName="bg-neutral-50 py-16 md:py-20"
      answerClassName="text-slate-700"
    />
  );
};

export { ContactFaq };
