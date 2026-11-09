import { useState } from 'react';

import { useDictionary } from '../../../../hooks/useDictionary';
import { ApiError } from '../../../../lib/api';
import type { SelectedAddress } from '../../../../lib/geoapify';
import { useToast } from '../../../ui/toast/ToastContext';
import type { OrderPhoto } from '../components/shared/PickupPhotosUploader';
import {
  buildPublicPayload,
  fillTemplate,
  PUBLIC_INITIAL_STATE,
  PUBLIC_STEP_IDS,
  type PublicFieldName,
  type PublicFormState,
  type PublicStepId,
  validatePublicField,
  validatePublicStep,
} from '../models/publicPickupRequestModel';
import { uploadPublicPickupPhoto } from '../services/pickupService';
import { useCreatePickupRequest } from './useCreatePickupRequest';

/** State and behaviour for the public Business / Bulk step form: step
 * navigation, per-step and on-blur validation, photo-upload tracking
 * and submit. On success it resets in place, as before — a visitor may
 * well send another request. */
const usePublicPickupRequestForm = () => {
  const {
    pickupRequest: { form: copy },
  } = useDictionary();
  const toast = useToast();
  const { execute: createRequest, loading: submitting } =
    useCreatePickupRequest();

  const [formData, setFormData] =
    useState<PublicFormState>(PUBLIC_INITIAL_STATE);
  const [photos, setPhotos] = useState<OrderPhoto[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedAddress | null>(null);
  const [apiError, setApiError] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [reached, setReached] = useState(0);
  const [completed, setCompleted] = useState<Set<PublicStepId>>(new Set());
  const [uploading, setUploading] = useState(false);

  const stepId = PUBLIC_STEP_IDS[stepIndex]!;
  const isLastStep = stepIndex === PUBLIC_STEP_IDS.length - 1;
  const steps = PUBLIC_STEP_IDS.map((id) => ({
    id,
    label: copy.steps[id].label,
    description: copy.steps[id].description,
  }));

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const blurField = (field: PublicFieldName) =>
    setErrors((prev) => ({
      ...prev,
      [field]: validatePublicField(field, formData, photos, copy),
    }));

  const changePhotos = (next: OrderPhoto[]) => {
    setPhotos(next);
    if (next.length) setErrors((prev) => ({ ...prev, photos: '' }));
  };

  const checkStep = (id: PublicStepId) => {
    const stepErrors = validatePublicStep(id, formData, photos, copy);
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  /** Continue: validate only this step, mark it done, move on. */
  const next = () => {
    if (!checkStep(stepId)) return;
    setCompleted((prev) => new Set(prev).add(stepId));
    const nextIndex = Math.min(stepIndex + 1, PUBLIC_STEP_IDS.length - 1);
    setStepIndex(nextIndex);
    setReached((r) => Math.max(r, nextIndex));
  };

  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  /** Jump to any step already reached. */
  const goTo = (index: number) => {
    if (index >= 0 && index <= Math.max(reached, stepIndex)) {
      setStepIndex(index);
    }
  };

  const reset = () => {
    setFormData(PUBLIC_INITIAL_STATE);
    setPhotos([]);
    setSelectedLocation(null);
    setErrors({});
    setCompleted(new Set());
    setReached(0);
    setStepIndex(0);
  };

  const submit = async () => {
    setApiError('');
    if (uploading) {
      toast.error(copy.uploadingTitle, copy.uploadingBody);
      return;
    }
    // Re-check every step; land on the first one with a problem.
    const firstInvalid = PUBLIC_STEP_IDS.findIndex(
      (id) => id !== 'review' && !checkStep(id),
    );
    if (firstInvalid !== -1) {
      setStepIndex(firstInvalid);
      toast.error(
        copy.fixStepTitle,
        fillTemplate(copy.fixStepBody, { step: steps[firstInvalid]!.label }),
      );
      return;
    }

    try {
      await createRequest(buildPublicPayload(formData, photos));
      // Stay on the page and reset in place, as before.
      reset();
      toast.success(copy.successMessage);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : copy.errorMessage;
      setApiError(message);
      toast.error(copy.errorMessage, message);
    }
  };

  return {
    copy,
    steps,
    stepId,
    stepIndex,
    isLastStep,
    reached,
    completed,
    formData,
    photos,
    errors,
    selectedLocation,
    setSelectedLocation,
    apiError,
    submitting,
    uploading,
    setUploading,
    upload: uploadPublicPickupPhoto,
    updateField,
    blurField,
    changePhotos,
    next,
    back,
    goTo,
    submit,
  };
};

export { usePublicPickupRequestForm };
