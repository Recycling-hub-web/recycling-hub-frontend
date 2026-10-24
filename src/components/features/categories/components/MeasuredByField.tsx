'use client';

import { QUANTITY_UNIT_LABELS, type QuantityUnit } from '../types';

const UNITS: QuantityUnit[] = ['kg', 'unit'];

type MeasuredByFieldProps = {
  value: QuantityUnit[];
  onChange: (units: QuantityUnit[]) => void;
  error?: string;
  disabled?: boolean;
};

/** How a material is measured — KG, Unit, or both. Order items for this
 * material can only use the units ticked here. */
const MeasuredByField = ({
  value,
  onChange,
  error,
  disabled = false,
}: MeasuredByFieldProps) => {
  const toggle = (unit: QuantityUnit) =>
    onChange(
      value.includes(unit)
        ? value.filter((u) => u !== unit)
        : UNITS.filter((u) => u === unit || value.includes(u)),
    );

  return (
    <div className="mb-4" data-field="allowed_quantity_units">
      <p className="block text-sm font-medium text-slate-900">
        Measured by <span className="text-red-600">*</span>
      </p>
      <p className="mt-0.5 text-xs text-slate-500">
        Order items for this material can only use these units.
      </p>
      <div className="mt-2 flex gap-3">
        {UNITS.map((unit) => (
          <label
            key={unit}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              value.includes(unit)
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-slate-200 text-slate-700 hover:border-slate-300'
            } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              type="checkbox"
              checked={value.includes(unit)}
              onChange={() => toggle(unit)}
              disabled={disabled}
              className="size-4 rounded border-slate-300 text-brand-600"
            />
            {QUANTITY_UNIT_LABELS[unit]}
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export { MeasuredByField };
