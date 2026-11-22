'use client';

import { useEffect, useState } from 'react';

import { SelectField } from '../../../../form/fields/SelectField';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useCollectionPoints, useOptimizeRoute } from '../../hooks';
import type {
  CollectionRequestListItem,
  LatLng,
  OptimizeRouteResult,
} from '../../types';
import { OptimizedRoutePreview } from './OptimizedRoutePreview';

// What went wrong, and what the driver can do about it. Each cause gets
// its own message: they used to all say "permission is required", even
// when permission was granted and GPS was just slow.
const LOCATION_ERRORS: Record<number, string> = {
  1: 'Location is blocked. Allow location for this site in your browser. On an iPhone, also turn on Settings → Privacy & Security → Location Services → your browser (e.g. Chrome or Safari) → "While Using the App". Then try again.',
  2: "Couldn't find your location. Check that Location Services are on for your phone and browser, then try again.",
  3: 'Finding your location took too long. Move closer to a window or turn on Wi-Fi, then try again.',
};

const requestPosition = (options: PositionOptions): Promise<LatLng> =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      reject,
      options,
    );
  });

/** The driver's position, for the route's starting point. Tries precise
 * GPS first; if that's slow or unavailable (common on iPhones indoors),
 * settles for a network-based or recent position, which is plenty to
 * order the stops. A refused permission isn't retried. */
const getCurrentPosition = async (): Promise<LatLng> => {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Location services are not available on this device.');
  }
  try {
    return await requestPosition({
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
  } catch (first) {
    const { code } = first as GeolocationPositionError;
    if (code === 1) throw new Error(LOCATION_ERRORS[1]);
    try {
      return await requestPosition({
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 300000,
      });
    } catch (second) {
      const retryCode = (second as GeolocationPositionError).code;
      throw new Error(LOCATION_ERRORS[retryCode] ?? LOCATION_ERRORS[2]);
    }
  }
};

export const OptimizeRouteModal = ({
  open,
  inlinePreview,
  onClose,
  selectedRequests,
  onOptimized,
}: {
  inlinePreview: boolean;
  open: boolean;
  onClose: () => void;
  selectedRequests: CollectionRequestListItem[];
  onOptimized: (result: OptimizeRouteResult, origin: LatLng) => void;
}) => {
  const { collectionPoints, loading: loadingPoints } =
    useCollectionPoints(open);
  const { execute: optimize } = useOptimizeRoute();
  const [formData, setFormData] = useState({ collection_point: '' });
  const [apiError, setApiError] = useState('');
  const [desktopPreview, setDesktopPreview] = useState<{
    result: OptimizeRouteResult;
    origin: LatLng;
  } | null>(null);
  const [preparing, setPreparing] = useState(false);
  useEffect(() => {
    if (open) {
      setFormData({
        collection_point:
          selectedRequests[0]?.route?.collection_point?.id || '',
      });
      setApiError('');
      setDesktopPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const submit = async () => {
    if (preparing) return;
    setPreparing(true);
    setApiError('');
    try {
      if (!selectedRequests.length || selectedRequests.length > 7)
        throw new Error('Select between 1 and 7 stops.');
      const origin = await getCurrentPosition();
      const result = await optimize({
        request_ids: selectedRequests.map((order) => order.id),
        collection_point: formData.collection_point || undefined,
        origin,
      });
      onOptimized(result, origin);
      if (inlinePreview) onClose();
      else setDesktopPreview({ result, origin });
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Could not optimize route. Please try again.',
      );
    } finally {
      setPreparing(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!preparing) onClose();
      }}
      closeOnBackdrop={!preparing}
      title="Optimize route"
      size={desktopPreview ? 'lg' : 'md'}
      subtitle={`Plan ${selectedRequests.length} selected stops, ending at your collection point.`}
      footer={
        desktopPreview ? undefined : (
          <FormActions>
            <Button
              size="sm"
              variant="secondary"
              disabled={preparing}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={preparing || loadingPoints}
              onClick={submit}
            >
              {preparing ? 'Optimizing…' : 'Get optimized route'}
            </Button>
          </FormActions>
        )
      }
    >
      {desktopPreview ? (
        <OptimizedRoutePreview
          result={desktopPreview.result}
          origin={desktopPreview.origin}
          selectedRequests={selectedRequests}
          showMap={false}
          showWaze
        />
      ) : (
        <>
          <AlertBanner message={apiError} />
          <p className="mb-3 text-sm text-slate-500">
            {inlinePreview
              ? 'Choose the drop-off destination. The map and stop list will appear below your pickups.'
              : 'Choose the drop-off destination to preview your optimized route.'}
          </p>
          <SelectField
            label="Collection point"
            field="collection_point"
            required={false}
            options={collectionPoints.map((point) => ({
              value: point.id,
              label: point.name,
            }))}
            formData={formData}
            updateFormData={(field, value) =>
              setFormData((previous) => ({ ...previous, [field]: value }))
            }
            disabled={preparing || loadingPoints}
          />
        </>
      )}
    </Modal>
  );
};
