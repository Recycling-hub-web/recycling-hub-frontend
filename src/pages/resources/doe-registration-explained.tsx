import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ResourceDetailTemplate } from '../../components/public/resources/ResourceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const DoeRegistrationExplainedPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="What DOE Registration Means for You — Recycling Hub"
      description="Why Recycling Hub's DOE registration matters, and what it protects you from when you hand over e-waste."
    />
    <ResourceDetailTemplate slug="doe-registration-explained" />
  </>
);

DoeRegistrationExplainedPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default DoeRegistrationExplainedPage;
