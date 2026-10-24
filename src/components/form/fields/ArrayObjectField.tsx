import { Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '../../ui/buttons/Button';
import { IconButton } from '../../ui/buttons/IconButton';
import { getNestedValue } from '../utils';

type RowFieldType = 'text' | 'select' | string;

type RowFieldOption = string | { value: string | number; label: string };

type RowField = {
  key: string;
  label: string;
  type?: RowFieldType;
  placeholder?: string;
  options?: RowFieldOption[];
};

type ArrayObjectFieldProps = {
  label: string;
  subLabel?: string;
  field: string;
  formData: Record<string, unknown>;
  errors?: Record<string, string>;
  updateFormData: (field: string, value: Record<string, unknown>[]) => void;
  fields?: RowField[];
  getDefaultRow?: (
    currentArray: Record<string, unknown>[],
  ) => Record<string, unknown>;
  columns?: 1 | 2 | 3 | 4;
  headerExtra?: ReactNode;
  /** "start" keeps new rows immediately visible without scrolling; "end"
   * appends instead, for fields (like yearly fees) where array position
   * is read as meaningful order elsewhere and shouldn't get scrambled. */
  insertPosition?: 'start' | 'end';
};

// Tailwind's JIT compiler needs the full class name present in source, so
// dynamic columns can't be templated (e.g. `md:grid-cols-${columns}`).
const GRID_COLS_CLASS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

const setArrayFieldValue = (
  array: Record<string, unknown>[],
  index: number,
  key: string,
  value: unknown,
): Record<string, unknown>[] => {
  const newArray = [...array];
  newArray[index] = { ...newArray[index], [key]: value };
  return newArray;
};

const ArrayObjectField = ({
  label,
  subLabel,
  field,
  formData,
  errors,
  updateFormData,
  fields = [],
  getDefaultRow,
  columns = 2,
  headerExtra = null,
  insertPosition = 'start',
}: ArrayObjectFieldProps) => {
  const arrayValue =
    (getNestedValue(formData, field) as
      | Record<string, unknown>[]
      | undefined) || [];

  const buildDefaultRow = (currentArray: Record<string, unknown>[]) => {
    if (getDefaultRow) return getDefaultRow(currentArray);
    return fields.reduce<Record<string, unknown>>((acc, f) => {
      acc[f.key] = '';
      return acc;
    }, {});
  };

  const handleChange = (index: number, key: string, value: unknown) => {
    updateFormData(field, setArrayFieldValue(arrayValue, index, key, value));
  };

  const addRow = () => {
    const newRow = buildDefaultRow(arrayValue);
    updateFormData(
      field,
      insertPosition === 'end'
        ? [...arrayValue, newRow]
        : [newRow, ...arrayValue],
    );
  };

  const removeRow = (index: number) => {
    if (arrayValue.length <= 1) return;
    updateFormData(
      field,
      arrayValue.filter((_, i) => i !== index),
    );
  };

  const addLabel = subLabel ? `Add ${subLabel}` : 'Add';

  return (
    <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/40 p-4">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-semibold text-slate-900">{label}</label>

        <div className="flex items-center gap-3">
          {headerExtra}

          <Button
            variant="secondary"
            onClick={addRow}
            className="!px-4 !py-2 text-xs"
          >
            <span className="flex items-center gap-1.5">
              <Plus className="size-4" />
              {addLabel}
            </span>
          </Button>
        </div>
      </div>

      {arrayValue.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
          No entries yet. Click &ldquo;{addLabel}&rdquo; to add one.
        </div>
      )}

      {arrayValue.map((item, index) => (
        <div
          key={index}
          className="space-y-4 rounded-lg border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {subLabel}
              </span>
            </div>

            <IconButton
              icon={<Trash2 className="size-4" />}
              onClick={() => removeRow(index)}
              disabled={arrayValue.length <= 1}
              variant="ghost"
              aria-label={`Remove ${subLabel ?? 'row'} ${index + 1}`}
              className="hover:bg-red-50 hover:text-red-600"
            />
          </div>

          <div
            className={`grid grid-cols-1 gap-4 ${GRID_COLS_CLASS[columns] || GRID_COLS_CLASS[2]}`}
          >
            {fields.map((f) => {
              const errorPath = `${field}[${index}].${f.key}`;
              const errorMessage = errors?.[errorPath];

              return (
                <div key={f.key} className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    {f.label}
                  </label>

                  {f.type === 'select' ? (
                    <select
                      value={(item?.[f.key] as string | undefined) ?? ''}
                      onChange={(e) =>
                        handleChange(index, f.key, e.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition-colors hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    >
                      {(f.options || []).map((opt) => {
                        const optValue =
                          typeof opt === 'object' ? opt.value : opt;
                        const optLabel =
                          typeof opt === 'object' ? opt.label : opt;
                        return (
                          <option key={optValue} value={optValue}>
                            {optLabel}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      type={f.type || 'text'}
                      value={(item?.[f.key] as string | undefined) ?? ''}
                      placeholder={f.placeholder || ''}
                      onChange={(e) =>
                        handleChange(index, f.key, e.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition-colors hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  )}

                  {errorMessage && (
                    <p className="text-xs text-red-600">{errorMessage}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export { ArrayObjectField };
