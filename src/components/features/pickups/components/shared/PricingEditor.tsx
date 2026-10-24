'use client';

import { MoneyInput } from '../../../../form/fields/MoneyInput';
import { Switch } from '../../../../ui/buttons/Switch';

/** One material line to price — `key` is whatever the caller uses to
 * store its price (an item id, or a form row index). */
type PriceLine = {
  key: string;
  label: string;
  /** Secondary text, e.g. "10 kg". */
  detail?: string;
  /** data-field for the line's price input (e2e hooks). */
  dataField: string;
};

type PricingEditorProps = {
  lines: PriceLine[];
  /** Price each line separately, instead of one total. Only offered with
   * 2+ lines — a single line prices the same either way. */
  itemized: boolean;
  onItemizedChange: (itemized: boolean) => void;
  total: string;
  onTotalChange: (value: string) => void;
  totalDataField: string;
  prices: Record<string, string>;
  onPriceChange: (key: string, value: string) => void;
  /** Validation message; also outlines the empty/invalid inputs. */
  error?: string;
  disabled?: boolean;
};

const isValidPrice = (value: string | undefined) => {
  const price = Number(value);
  return Boolean(value) && !Number.isNaN(price) && price > 0;
};

/** The approve-price editor shared by the create form's "Evaluate now"
 * section and EvaluateModal: the request's materials as a list with a
 * total row. "Price each item" (2+ materials) gives every line its own
 * RM input and sums them into the total; otherwise the lines are listed
 * read-only and the total row takes the one price. */
const PricingEditor = ({
  lines,
  itemized,
  onItemizedChange,
  total,
  onTotalChange,
  totalDataField,
  prices,
  onPriceChange,
  error,
  disabled = false,
}: PricingEditorProps) => {
  const canItemize = lines.length > 1;
  const perItem = canItemize && itemized;
  const itemizedTotal = lines.reduce(
    (sum, line) =>
      sum + (isValidPrice(prices[line.key]) ? Number(prices[line.key]) : 0),
    0,
  );

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-slate-900">
        Price <span className="text-red-600">*</span>
      </p>

      <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {canItemize && (
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Price each item
              </p>
              <p className="text-xs text-slate-500">
                {perItem
                  ? 'Added up into the total below.'
                  : 'One total for the whole pickup.'}
              </p>
            </div>
            <Switch
              checked={itemized}
              onChange={onItemizedChange}
              label="Price each item"
              disabled={disabled}
            />
          </div>
        )}

        <ul className="divide-y divide-slate-100">
          {lines.map((line) => (
            <li
              key={line.key}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {line.label}
                </p>
                {line.detail && (
                  <p className="text-xs text-slate-500">{line.detail}</p>
                )}
              </div>
              {perItem && (
                <MoneyInput
                  value={prices[line.key] ?? ''}
                  onChange={(value) => onPriceChange(line.key, value)}
                  ariaLabel={`Price for ${line.label}`}
                  dataField={line.dataField}
                  invalid={Boolean(error) && !isValidPrice(prices[line.key])}
                  disabled={disabled}
                  className="w-32 shrink-0 sm:w-40"
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">
            {perItem ? 'Total' : 'Total price'}
          </p>
          {perItem ? (
            <p className="text-base font-semibold tabular-nums text-neutral-950">
              RM {itemizedTotal.toFixed(2)}
            </p>
          ) : (
            <MoneyInput
              value={total}
              onChange={onTotalChange}
              ariaLabel="Total price"
              dataField={totalDataField}
              invalid={Boolean(error)}
              disabled={disabled}
              className="w-32 shrink-0 sm:w-40"
            />
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export { isValidPrice, PricingEditor };
export type { PriceLine, PricingEditorProps };
