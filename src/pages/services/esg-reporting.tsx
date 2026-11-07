import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServiceDetailTemplate } from '../../components/public/services/ServiceDetailTemplate';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const EsgReportingPage: NextPageWithLayout = () => {
  const { services } = useDictionary();
  return (
    <>
      <Meta {...services.pageMeta['esg-reporting']} />
      <ServiceDetailTemplate slug="esg-reporting" />
    </>
  );
};

EsgReportingPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default EsgReportingPage;
