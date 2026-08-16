// Shared shape for Terms of Service / Privacy Policy content, used by both
// src/locales/{en,bm}.ts and components/public/legal/LegalContent.tsx.
// Sections vary in internal structure (plain paragraphs, a paragraph with an
// embedded link, bullet lists, bullet lists with a bold label prefix), so
// each section is a list of typed blocks rather than one fixed shape.

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'p-labeled'; label: string; rest: string }
  | {
      type: 'p-link';
      prefix: string;
      linkText: string;
      suffix: string;
      href: string;
    }
  | { type: 'ul'; items: string[] }
  | { type: 'ul-labeled'; items: { label: string; rest: string }[] }
  | { type: 'contact-block' };

export type LegalSection = {
  title: string;
  blocks: LegalBlock[];
};
