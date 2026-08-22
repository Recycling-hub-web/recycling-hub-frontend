import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ResourceDetailTemplate } from '../../components/public/resources/ResourceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const UnderstandingYourCertificatePage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Understanding Your Recycling Certificate — Recycling Hub"
      description="What's on a Recycling Hub certificate, and how to use it for your own records or an audit."
    />
    <ResourceDetailTemplate slug="understanding-your-certificate" />
  </>
);

UnderstandingYourCertificatePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default UnderstandingYourCertificatePage;
