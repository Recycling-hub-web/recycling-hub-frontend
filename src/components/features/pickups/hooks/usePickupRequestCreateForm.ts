import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import type { SelectedAddress } from '../../../../lib/geoapify';
import { useToast } from '../../../ui/toast/ToastContext';
import type { DraftOrder } from '../components/admin/NewOrdersFieldArray';
import {
  buildPayload,
  type FieldName,
  type FormState,
  INITIAL_STATE,
  type StepId,
  STEPS,
  successMessage,
  validateField,
  validateOrders,
  validateStepFields,
} from '../models/pickupRequestCreateModel';
import { useCreatePickupRequest } from './useCreatePickupRequest';
import { usePickupCategories } from './usePickupCategories';

type PickupRequestBasePath =
  | '/admin/pickup-requests'
  | '/staff/pickup-requests'
  | '/super-admin/pickup-requests';

/** State and behaviour for the staff "New pickup request" step form:
 * step navigation, per-step and on-blur validation, upload tracking and
 * submit. The view only renders what this returns. */
const usePickupRequestCreateForm = (basePath: PickupRequestBasePath) => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createRequest,
    loading: submitting,
    error,
  } = useCreatePickupRequest();
  const categories = usePickupCategories();

  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedAddress | null>(null);
  const [orders, setOrders] = useState<DraftOrder[]>([]);
  const [orderItemErrors, setOrderItemErrors] = useState<
    Record<string, string>[][]
  >([]);
  const [orderPhotoErrors, setOrderPhotoErrors] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  /** Furthest step reached — any step up to it can be jumped to. */
  const [reached, setReached] = useState(0);
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());
  const [uploading, setUploading] = useState<Set<string>>(new Set());

  const step = STEPS[stepIndex]!;
  const isLastStep = stepIndex === STEPS.length - 1;

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  /** Validate one field when it loses focus — errors appear inline. */
  const blurField = (field: FieldName) => {
    setErrors((prev) => ({ ...prev, [field]: validateField(field, formData) }));
  };

  const setUploadingFor = useCallback((key: string, isUploading: boolean) => {
    setUploading((prev) => {
      const next = new Set(prev);
      if (isUploading) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  /** Validate one step, showing its errors. True when it passes. */
  const checkStep = (id: StepId): boolean => {
    if (id === 'orders') {
      const result = validateOrders(orders, categories.unitsByCategory);
      setOrderItemErrors(result.itemErrors);
      setOrderPhotoErrors(result.photoErrors);
      return result.valid;
    }
    const stepErrors = validateStepFields(id, formData);
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const markDone = (id: StepId) =>
    setCompleted((prev) => new Set(prev).add(id));

  /** Continue: validate only this step, mark it done, move on. */
  const next = () => {
    if (!checkStep(step.id)) return;
    markDone(step.id);
    const nextIndex = Math.min(stepIndex + 1, STEPS.length - 1);
    setStepIndex(nextIndex);
    setReached((r) => Math.max(r, nextIndex));
  };

  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  /** Jump to any step already reached — back to fix something, or
   * forward again after an Edit (submit re-checks every step anyway). */
  const goTo = (index: number) => {
    if (index >= 0 && index <= Math.max(reached, stepIndex)) {
      setStepIndex(index);
    }
  };

  const submit = async () => {
    if (uploading.size > 0) {
      toast.error(
        'Photo still uploading',
        'Wait for the photo to finish uploading, then submit.',
      );
      return;
    }
    // Re-check every step; land on the first one with a problem.
    const firstInvalid = STEPS.findIndex(
      (s) => s.id !== 'review' && !checkStep(s.id),
    );
    if (firstInvalid !== -1) {
      setStepIndex(firstInvalid);
      toast.error(
        'Check this step',
        `${STEPS[firstInvalid]!.label} has something to fix.`,
      );
      return;
    }

    try {
      const result = await createRequest(buildPayload(formData, orders));
      toast.success('Pickup request created', successMessage(formData, orders));
      router.push(`${basePath}/${result.id}`);
    } catch (err) {
      // useCreatePickupRequest also keeps the message in `error`.
      toast.error(
        'Could not create the request',
        err instanceof ApiError ? err.message : undefined,
      );
    }
  };

  return {
    step,
    stepIndex,
    isLastStep,
    completed,
    reached,
    formData,
    errors,
    selectedLocation,
    setSelectedLocation,
    orders,
    setOrders,
    orderItemErrors,
    orderPhotoErrors,
    categories,
    uploading: uploading.size > 0,
    setUploadingFor,
    submitting,
    error,
    updateFormData,
    blurField,
    next,
    back,
    goTo,
    submit,
  };
};

export { usePickupRequestCreateForm };
export type { PickupRequestBasePath };
