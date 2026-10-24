import { PRICING_FAQ } from '../../../constants/content';
import { SectionHeading } from '../../ui/SectionHeading';
import { FaqAccordion } from '../shared/FaqAccordion';

const PricingFaq = () => (
  <FaqAccordion
    items={PRICING_FAQ}
    heading={
      <div className="mb-12 text-center">
        <SectionHeading eyebrow="FAQ" headline="Common Pricing Questions" />
      </div>
    }
  />
);

export { PricingFaq };
