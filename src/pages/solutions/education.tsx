import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const EducationPage: NextPageWithLayout = () => {
  const { solutions } = useDictionary();
  return (
    <>
      <Meta {...solutions.pageMeta.education} />
      <SolutionDetailTemplate slug="education" />
    </>
  );
};

EducationPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default EducationPage;
