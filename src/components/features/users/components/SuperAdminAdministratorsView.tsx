'use client';

import { PageContainer } from '../../../layout/PageContainer';
import { PageHeader } from '../../../ui/PageHeader';
import { AdministratorsPanel } from './AdministratorsPanel';

/** Super Admin's own dedicated page (/super-admin/administrators) for
 * managing Admin/Super Admin accounts — moved out of the Users
 * module's old "Administrators" tab now that Super Admin has its own
 * section separate from Admin (see SuperAdminLayout). A thin page
 * shell: all the real behavior lives in AdministratorsPanel, which is
 * fully self-contained. */
const SuperAdminAdministratorsView = () => (
  <PageContainer variant="table">
    <PageHeader
      title="Administrators"
      subtitle="Admin and Super Admin accounts, and how much of each role's limit is in use."
    />
    <AdministratorsPanel />
  </PageContainer>
);

export { SuperAdminAdministratorsView };
