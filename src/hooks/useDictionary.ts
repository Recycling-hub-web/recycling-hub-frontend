import { useRouter } from 'next/router';

import { bm } from '../locales/bm';
import { en } from '../locales/en';

const useDictionary = () => {
  const { locale } = useRouter();
  return locale === 'bm' ? bm : en;
};

export { useDictionary };
