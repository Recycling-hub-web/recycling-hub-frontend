// Shared by every field below — was copy-pasted verbatim (with tiny regex
// variations) into ~10 files in the pasted source. Reads a value out of
// `formData` by a "path" string like "address.city" or "items[0].name".
const getNestedValue = (
  obj: Record<string, unknown> | undefined | null,
  path: string,
): unknown => {
  if (!obj || !path) return undefined;
  return path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
};

/** The disabled/error/default 3-way border+background state every text-ish
 * field in this kit shares — pulled out once instead of a nested ternary
 * repeated in each field. */
const fieldStateClasses = (disabled: boolean, hasError: boolean): string => {
  if (disabled)
    return 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500';
  if (hasError) return 'border-red-500 bg-red-50';
  return 'border-slate-200 bg-white hover:bg-slate-50';
};

export { fieldStateClasses, getNestedValue };
