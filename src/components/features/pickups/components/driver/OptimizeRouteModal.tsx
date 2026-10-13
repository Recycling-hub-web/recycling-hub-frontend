'use client';

import { useEffect, useState } from 'react';
import { LuMapPin, LuNavigation } from 'react-icons/lu';

import { SelectField } from '../../../../form/fields/SelectField';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useCollectionPoints, useOptimizeRoute } from '../../hooks';
import type {
  LatLng,
  OptimizeRouteResult,
  PickupRequestListItem,
} from '../../types';
import {
  googleMapsMultiStopUrl,
  wazeNavigateUrl,
} from '../../utils/navigationLinks';

type OptimizeRouteModalProps = {
  open: boolean;
  onClose: () => void;
  selectedRequests: PickupRequestListItem[];
  /** Waze has no multi-stop link — choosing it just closes this modal
   * and hands the optimized order back up so the table can badge each
   * row 1..N; the driver works them in order via each row's own
   * existing per-stop Navigate action. */
  onWazeOrderChosen: (orderedRequestIds: string[]) => void;
};

// Every selected request is on the driver's one open Route (that's
// what the "mine" tab is) — if it already has a resolved destination
// (a previous optimize call on this same route), default to it. If
// not, leave the field blank: the backend can still often infer one
// itself from the requests' own `collection_point` (set at drop-off
// routing time), and only errors if that's ambiguous too.
const inferCollectionPointId = (requests: PickupRequestListItem[]): string =>
  requests[0]?.route?.collection_point?.id ?? '';

const getCurrentPosition = (): Promise<LatLng> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location services are not available on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () =>
        reject(
          new Error('Location permission is required to optimize a route.'),
        ),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });

/** Order a set of the driver's own claimed, scheduled stops into the
 * fastest visiting sequence ending at a collection point, then hand
 * off to whichever navigation app the driver picks. See
 * apps.pickups.services.optimize_route on the backend — nothing
 * computed here is persisted beyond the route's own collection point,
 * so re-optimizing is just opening this again. */
const OptimizeRouteModal = ({
  open,
  onClose,
  selectedRequests,
  onWazeOrderChosen,
}: OptimizeRouteModalProps) => {
  const { collectionPoints, loading: loadingPoints } =
    useCollectionPoints(open);
  const { execute: optimize, loading: optimizing } = useOptimizeRoute();

  const [formData, setFormData] = useState({ collection_point: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [result, setResult] = useState<OptimizeRouteResult | null>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        collection_point: inferCollectionPointId(selectedRequests),
      });
      setErrors({});
      setApiError('');
      setOrigin(null);
      setResult(null);
    }
    // Only reset when the modal opens — selectedRequests can keep
    // changing identity on every parent render otherwise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const collectionPointOptions = collectionPoints.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    setApiError('');
    setErrors({});
    try {
      const here = await getCurrentPosition();
      setOrigin(here);
      const response = await optimize({
        request_ids: selectedRequests.map((r) => r.id),
        collection_point: formData.collection_point || undefined,
        origin: here,
      });
      setResult(response);
    } catch (err) {
      // ApiError and the plain Error getCurrentPosition rejects with
      // both carry a useful .message — anything else gets a fallback.
      setApiError(
        err instanceof Error
          ? err.message
          : 'Could not optimize this route. Please try again.',
      );
    }
  };

  const handleOpenGoogleMaps = () => {
    if (!result || !origin) return;
    window.open(
      googleMapsMultiStopUrl(
        origin,
        result.stops,
        result.collection_point.address || result.destination,
      ),
      '_blank',
      'noopener,noreferrer',
    );
    handleClose();
  };

  const handleOpenWaze = () => {
    if (!result) return;
    onWazeOrderChosen(result.stops.map((s) => s.request_id));
    // Waze has no multi-stop link — open the first leg now, same as
    // the per-row Navigate action, so the driver isn't left with
    // nothing to tap after choosing Waze.
    const first = selectedRequests.find(
      (r) => r.id === result.stops[0]?.request_id,
    );
    if (first) {
      window.open(
        wazeNavigateUrl(first.pickup_address),
        '_blank',
        'noopener,noreferrer',
      );
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Optimize route"
      subtitle={
        result
          ? 'Choose where to open the optimized route.'
          : `Find the fastest order for ${selectedRequests.length} selected stop${selectedRequests.length === 1 ? '' : 's'}.`
      }
      footer={
        result ? (
          <FormActions>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5"
              onClick={handleOpenWaze}
            >
              <LuNavigation className="size-4" />
              Open in Waze
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleOpenGoogleMaps}
            >
              <LuMapPin className="size-4" />
              Open in Google Maps
            </Button>
          </FormActions>
        ) : (
          <FormActions>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClose}
              disabled={optimizing}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={optimizing}>
              {optimizing ? 'Optimizing…' : 'Get optimized route'}
            </Button>
          </FormActions>
        )
      }
    >
      <AlertBanner message={apiError} />
      {!result && (
        <>
          <p className="mb-2 text-xs text-slate-500">
            Where the route ends. Pick a store to change it, or leave it as is
            to keep this route&apos;s current destination.
          </p>
          <SelectField
            label="Collection point"
            field="collection_point"
            required={false}
            options={collectionPointOptions}
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            disabled={loadingPoints || optimizing}
          />
        </>
      )}
      {result && (
        <>
          <ol className="space-y-2 text-sm text-slate-700">
            {result.stops.map((stop, i) => {
              const req = selectedRequests.find(
                (r) => r.id === stop.request_id,
              );
              return (
                <li key={stop.request_id} className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {i + 1}
                  </span>
                  {req?.full_name ?? stop.request_id}
                </li>
              );
            })}
          </ol>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <span className="font-semibold">Ends at:</span>
            <span>{result.collection_point.name}</span>
          </p>
        </>
      )}
    </Modal>
  );
};

export { OptimizeRouteModal };
