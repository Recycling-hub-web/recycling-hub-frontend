import { SettingToggleInput } from './SettingToggleInput';

type ToggleInputProps = {
  label: string;
  field: string;
  formData: Record<string, unknown>;
  updateFormData: (field: string, value: boolean) => void;
  errors?: Record<string, string>;
};

/** Backwards-compatible entry point for the shared accessible switch. */
const ToggleInput = ({
  label,
  field,
  formData,
  updateFormData,
  errors,
}: ToggleInputProps) => {
  return (
    <SettingToggleInput
      label={label}
      field={field}
      formData={formData}
      updateFormData={updateFormData}
      errors={errors}
      enabledDescription="This setting is enabled."
      disabledDescription="This setting is disabled."
    />
  );
};

export { ToggleInput };
