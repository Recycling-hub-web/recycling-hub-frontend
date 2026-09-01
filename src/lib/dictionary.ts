import { bm } from '../locales/bm';
import { en } from '../locales/en';

type Locale = 'en' | 'bm';

const DICTIONARIES = { en, bm };

/** Server-side equivalent of src/hooks/useDictionary.ts (which reads
 * next/router's `locale` — Pages Router only). App Router segments get
 * their locale from the `[locale]` route param instead, so this is a
 * plain function, not a hook — call it from a Server Component, or pass
 * its result down into a Client Component as a prop. */
const getDictionary = (locale: Locale) => DICTIONARIES[locale];

type Dictionary = ReturnType<typeof getDictionary>;

export { getDictionary };
export type { Dictionary, Locale };
