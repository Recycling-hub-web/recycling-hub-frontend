'use client';

import { useEffect, useState } from 'react';
import {
  LuMapPin,
  LuNavigation,
  LuPackageCheck,
  LuUpload,
} from 'react-icons/lu';

import { SelectField } from '../../../../form/fields/SelectField';
import { PageContainer } from '../../../../layout/PageContainer';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { PageHeader } from '../../../../ui/PageHeader';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../../ui/table';
import { useToast } from '../../../../ui/toast/ToastContext';
import { useUploadStorageFile } from '../../../storageFiles/hooks';
import {
  useCollectionPoints,
  useDropOffRoute,
  usePickupRequests,
} from '../../hooks';
import { itemsSummary } from '../../types';
import {
  googleMapsDirectionsUrl,
  wazeNavigateUrl,
} from '../../utils/navigationLinks';

/** The driver's own batch store drop-off — its own screen, not
 * CollectionTaskDetailsPage/CollectModal reused, since this covers
 * every `collected` request on the driver's current open Route at
 * once, not one task at a time. One proof photo for the whole batch.
 * See apps.pickups.services.drop_off_route on the backend.
 *
 * The route's end point (its collection point) is shown up front with
 * navigation links, and the drop-off records the store actually used —
 * the planned one by default, or a different one the driver picks. */
const RouteDropOffView = () => {
  const toast = useToast();
  const { requests, loading, error, refetch } = usePickupRequests({
    page: 1,
    status: 'collected',
  });
  const { execute: dropOff, loading: submitting } = useDropOffRoute();
  const { execute: upload, loading: uploading } = useUploadStorageFile();
  const { collectionPoints } = useCollectionPoints(true);

  // Every collected request here is on the driver's one open route, so
  // they share its planned end point.
  const plannedStore = requests[0]?.route?.collection_point ?? null;
  const [store, setStore] = useState({ collection_point: '' });
  useEffect(() => {
    if (plannedStore) setStore({ collection_point: plannedStore.id });
  }, [plannedStore?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const chosenStore =
    collectionPoints.find((p) => p.id === store.collection_point) ??
    (plannedStore?.id === store.collection_point ? plannedStore : null);
  const storeOptions = collectionPoints.map((p) => ({
    value: p.id,
    label: p.id === plannedStore?.id ? `${p.name} (planned)` : p.name,
  }));

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deliveredQuantities, setDeliveredQuantities] = useState<
    Record<string, string>
  >({});
  const [proofKey, setProofKey] = useState('');
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [apiError, setApiError] = useState('');

  let uploadLabel = 'Upload proof';
  if (uploading) uploadLabel = 'Uploading…';
  else if (proofKey) uploadLabel = 'Replace proof';

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) =>
      prev.size === requests.length
        ? new Set()
        : new Set(requests.map((r) => r.id)),
    );
  };

  const handleProofChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      setProofKey(result.file_key);
      setProofPreview(URL.createObjectURL(file));
    } catch {
      setApiError('Could not upload the drop-off proof. Please try again.');
    }
  };

  const handleSubmit = async () => {
    setApiError('');
    if (selected.size === 0) {
      setApiError('Select at least one request to drop off.');
      return;
    }
    if (!store.collection_point) {
      setApiError('Choose the store you are dropping off at.');
      return;
    }
    try {
      await dropOff({
        items: Array.from(selected).map((id) => ({
          id,
          delivered_quantity: deliveredQuantities[id] || undefined,
        })),
        proof: proofKey || undefined,
        collection_point: store.collection_point,
      });
      toast.success('Dropped off to store');
      setSelected(new Set());
      setDeliveredQuantities({});
      setProofKey('');
      setProofPreview(null);
      refetch();
    } catch {
      setApiError('Could not complete the drop-off. Please try again.');
    }
  };

  const columnCount = 4;

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error) {
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={refetch}
        />
      );
    }
    if (requests.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="Nothing to drop off"
          subtitle="Requests you've collected will show up here until dropped off at the store."
        />
      );
    }
    return requests.map((r) => (
      <tr key={r.id} className="transition-colors hover:bg-slate-50">
        <td className="p-4">
          <input
            type="checkbox"
            checked={selected.has(r.id)}
            onChange={() => toggleSelect(r.id)}
            className="size-4 rounded border-slate-300"
            aria-label={`Select ${r.full_name}`}
          />
        </td>
        <td className="px-6 py-4 font-medium text-slate-900">{r.full_name}</td>
        <td className="px-6 py-4 text-slate-700">
          {itemsSummary(r.items)} — {r.items[0]?.collected_quantity ?? '—'}{' '}
          collected
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            placeholder="Delivered qty"
            value={deliveredQuantities[r.id] ?? ''}
            onChange={(e) =>
              setDeliveredQuantities((prev) => ({
                ...prev,
                [r.id]: e.target.value,
              }))
            }
            disabled={!selected.has(r.id)}
            className="w-32 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </td>
      </tr>
    ));
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Drop Off to Store"
        subtitle="Check off everything you're dropping off from this route, in one go."
      />

      <AlertBanner message={apiError} />

      {requests.length > 0 && (
        <section
          aria-label="Drop-off store"
          className="mb-4 rounded-xl border border-slate-200 p-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <LuMapPin className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Drop-off store
                </p>
                {chosenStore ? (
                  <>
                    <p className="font-semibold text-slate-900">
                      {chosenStore.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {chosenStore.address}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    No store planned for this route — choose where you&apos;re
                    dropping off.
                  </p>
                )}
                {plannedStore &&
                  store.collection_point &&
                  store.collection_point !== plannedStore.id && (
                    <p className="mt-1 text-xs font-medium text-amber-700">
                      Different from the planned store ({plannedStore.name}).
                    </p>
                  )}
              </div>
            </div>
            {chosenStore && (
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  href={googleMapsDirectionsUrl(chosenStore.address)}
                >
                  <LuNavigation className="size-4" />
                  Google Maps
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  href={wazeNavigateUrl(chosenStore.address)}
                >
                  <LuNavigation className="size-4" />
                  Waze
                </Button>
              </div>
            )}
          </div>
          <div className="mt-3 max-w-sm">
            <SelectField
              label="Dropping off at"
              field="collection_point"
              options={storeOptions}
              formData={store}
              updateFormData={(_, value) =>
                setStore({ collection_point: value })
              }
              disabled={submitting}
            />
          </div>
        </section>
      )}

      <TableWrapper>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">
                {requests.length > 0 && (
                  <input
                    type="checkbox"
                    checked={selected.size === requests.length}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-slate-300"
                    aria-label="Select all"
                  />
                )}
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Requester
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Category / collected
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Delivered quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
        </table>
      </TableWrapper>

      <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {proofPreview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a static asset
            <img
              src={proofPreview}
              alt=""
              className="size-14 shrink-0 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <LuPackageCheck className="size-5" />
            </span>
          )}
          <label
            htmlFor="drop-off-proof-input"
            className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
              uploading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <LuUpload className="size-4" />
            {uploadLabel}
          </label>
          <input
            id="drop-off-proof-input"
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => handleProofChange(e.target.files?.[0])}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            submitting || selected.size === 0 || !store.collection_point
          }
        >
          {submitting
            ? 'Dropping off…'
            : `Drop off to store (${selected.size})`}
        </Button>
      </div>
    </PageContainer>
  );
};

export { RouteDropOffView };
