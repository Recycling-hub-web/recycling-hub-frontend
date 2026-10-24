import Link from 'next/link';

import { BRAND } from '../../../constants/content';
import { useDictionary } from '../../../hooks/useDictionary';
import type { LegalBlock, LegalSection } from '../../../types/legal';

const LegalLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const cls = 'font-medium text-neutral-950 underline underline-offset-2';
  if (href.startsWith('mailto:') || href.startsWith('http')) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
};

const ContactBlock = () => {
  const { legal } = useDictionary();
  return (
    <p>
      {legal.contactLabels.email}{' '}
      <a
        href={`mailto:${BRAND.email}`}
        className="font-medium text-neutral-950 underline underline-offset-2"
      >
        {BRAND.email}
      </a>
      <br />
      {legal.contactLabels.whatsapp} {BRAND.phone}
      <br />
      {legal.contactLabels.website} {BRAND.website}
    </p>
  );
};

const LegalBlockRenderer = ({ block }: { block: LegalBlock }) => {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>;
    case 'p-labeled':
      return (
        <p>
          <span className="font-medium text-neutral-800">{block.label}</span> —{' '}
          {block.rest}
        </p>
      );
    case 'p-link':
      return (
        <p>
          {block.prefix}
          <LegalLink href={block.href}>{block.linkText}</LegalLink>
          {block.suffix}
        </p>
      );
    case 'ul':
      return (
        <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'ul-labeled':
      return (
        <ul className="flex list-inside list-disc flex-col gap-2 pl-1">
          {block.items.map((item) => (
            <li key={item.label}>
              <span className="font-medium text-neutral-800">{item.label}</span>{' '}
              — {item.rest}
            </li>
          ))}
        </ul>
      );
    case 'contact-block':
      return <ContactBlock />;
    default:
      return null;
  }
};

type LegalContentProps = {
  lastUpdatedLine: string;
  sections: LegalSection[];
};

const LegalContent = ({ lastUpdatedLine, sections }: LegalContentProps) => (
  <section className="bg-white py-16 md:py-20">
    <div className="mx-auto max-w-3xl px-5 md:px-8">
      <p className="mb-10 text-xs text-slate-400">{lastUpdatedLine}</p>

      {sections.map((section) => (
        <div
          key={section.title}
          className="border-b border-slate-100 py-10 first:pt-0"
        >
          <h2 className="mb-4 text-lg font-semibold text-neutral-950">
            {section.title}
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600">
            {section.blocks.map((block, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <LegalBlockRenderer key={i} block={block} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export { LegalContent };
