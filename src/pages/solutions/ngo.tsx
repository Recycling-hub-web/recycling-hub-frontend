import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const NgoPage: NextPageWithLayout = () => {
  const { solutions } = useDictionary();
  return (
    <>
      <Meta {...solutions.pageMeta.ngo} />
      <SolutionDetailTemplate slug="ngo" />
    </>
  );
};

NgoPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default NgoPage;
