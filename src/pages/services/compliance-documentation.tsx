import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServiceDetailTemplate } from '../../components/public/services/ServiceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const ComplianceDocumentationPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Compliance Documentation — Recycling Hub"
      description="Consignment notes and DOE-compliant paperwork issued for every collection, ready for audit."
    />
    <ServiceDetailTemplate slug="compliance-documentation" />
  </>
);

ComplianceDocumentationPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ComplianceDocumentationPage;
