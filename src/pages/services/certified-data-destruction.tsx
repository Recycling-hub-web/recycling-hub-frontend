import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServiceDetailTemplate } from '../../components/public/services/ServiceDetailTemplate';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const CertifiedDataDestructionPage: NextPageWithLayout = () => {
  const { services } = useDictionary();
  return (
    <>
      <Meta {...services.pageMeta['certified-data-destruction']} />
      <ServiceDetailTemplate slug="certified-data-destruction" />
    </>
  );
};

CertifiedDataDestructionPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default CertifiedDataDestructionPage;
