import type { FinanceRecordListItem } from './types';

const reimbursementBlocker = (record: FinanceRecordListItem): string => {
  if (record.status === 'reimbursed') return 'Already reimbursed';
  if (!['pending', 'claimed', 'verified'].includes(record.status))
    return 'Not ready for reimbursement';
  if (
    !record.driver ||
    record.actual_amount === null ||
    !record.proof_of_payment?.file_key
  )
    return 'Customer payment and proof have not been recorded';
  if (
    !record.driver.payout_method ||
    !record.driver.payout_account_details.trim()
  )
    return 'Driver payout method and account details are required';
  return '';
};

export { reimbursementBlocker };
