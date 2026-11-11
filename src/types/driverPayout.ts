export type DriverPayoutDetails = {
  id: string;
  payout_method: string;
  payout_account_details: string;
  bank: string | null;
  bank_name: string;
  account_holder_name: string;
  bank_account_number: string;
  bank_branch: string;
  duitnow_id_type: string;
  duitnow_id: string;
  payout_ready: boolean;
};
