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
