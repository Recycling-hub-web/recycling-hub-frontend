import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const HealthcarePage: NextPageWithLayout = () => {
  const { solutions } = useDictionary();
  return (
    <>
      <Meta {...solutions.pageMeta.healthcare} />
      <SolutionDetailTemplate slug="healthcare" />
    </>
  );
};

HealthcarePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default HealthcarePage;
