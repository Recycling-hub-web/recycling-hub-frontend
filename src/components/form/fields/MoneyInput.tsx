import { fieldStateClasses } from '../utils';

type MoneyInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name — these sit in rows without a visible label above. */
  ariaLabel: string;
  dataField?: string;
  currency?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
};

/** A compact amount input with a currency prefix ("RM"), for rows in a
 * price list rather than a labelled form field (see InputField's own
 * `prefix` for that). */
const MoneyInput = ({
  value,
  onChange,
  ariaLabel,
  dataField,
  currency = 'RM',
  invalid = false,
  disabled = false,
  className = '',
}: MoneyInputProps) => (
  <div className={`relative ${className}`} data-field={dataField}>
    <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-sm font-medium text-slate-500">
      {currency}
    </span>
    <input
      type="number"
      inputMode="decimal"
      min="0"
      step="0.01"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0.00"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      className={`h-10 w-full rounded-lg border pe-3 ps-10 text-sm tabular-nums outline-none transition-colors [appearance:textfield] focus:ring-1 focus:ring-brand-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${fieldStateClasses(disabled, invalid)}`}
    />
  </div>
);

export { MoneyInput };
