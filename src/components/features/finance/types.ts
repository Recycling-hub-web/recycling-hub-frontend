type FinanceCollectionRequest = {
  id: string;
  full_name: string;
  category: string;
  pickup_address: string;
};

/** Flat shape from GET /finance/ (FinanceRecordListSerializer) — a
 * priced, approved pickup request, created by
 * CollectionRequestDecisionService.evaluate on the pickups side. */
type FinanceRecordListItem = {
  id: string;
  collection_request: FinanceCollectionRequest;
  price: string;
  created_at: string;
};

export type { FinanceCollectionRequest, FinanceRecordListItem };
