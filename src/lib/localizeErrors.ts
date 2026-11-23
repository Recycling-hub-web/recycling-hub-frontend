/** Translate validation copy at presentation time, preserving fields and array structure. */
type FieldErrors = Record<string, string | undefined>;
type Translate = (message: string) => string;

export function localizeErrors(
  errors: FieldErrors,
  translate: Translate,
): Record<string, string>;
export function localizeErrors(
  errors: FieldErrors[] | undefined,
  translate: Translate,
): Record<string, string>[] | undefined;
export function localizeErrors(
  errors: FieldErrors | undefined,
  translate: Translate,
): Record<string, string> | undefined;
export function localizeErrors(
  errors: FieldErrors | FieldErrors[] | undefined,
  translate: Translate,
): Record<string, string> | Record<string, string>[] | undefined {
  if (!errors) return undefined;
  const translateOne = (fields: FieldErrors) =>
    Object.fromEntries(
      Object.entries(fields).map(([field, message]) => [
        field,
        translate(message ?? ''),
      ]),
    );
  return Array.isArray(errors)
    ? errors.map(translateOne)
    : translateOne(errors);
}
