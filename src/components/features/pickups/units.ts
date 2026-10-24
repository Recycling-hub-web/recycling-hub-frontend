/** How a material is measured — mirrors apps.categories.units on the
 * backend. A material category allows "kg", "unit" or both
 * (allowed_quantity_units); every order item uses one of its category's
 * units, quantities must be positive, and a count in units must be a
 * whole number. */

import { QUANTITY_UNIT_LABELS, type QuantityUnit } from '../categories/types';

const QUANTITY_UNITS: QuantityUnit[] = ['kg', 'unit'];

/** category id → the units it allows. */
type UnitsByCategory = Record<string, QuantityUnit[]>;

/** "12.5 kg", "3 units", "1 unit" — a quantity with its unit. */
const formatQuantity = (
  quantity: string | number | null | undefined,
  unit: string | null | undefined,
): string => {
  if (quantity === null || quantity === undefined || quantity === '') {
    return '—';
  }
  const value = Number(quantity);
  // Drop trailing zeros the API's 2-decimal values carry ("3.00" → "3").
  const shown = Number.isFinite(value) ? String(value) : String(quantity);
  if (unit === 'unit') return `${shown} ${value === 1 ? 'unit' : 'units'}`;
  return `${shown} ${unit || 'kg'}`;
};

type ItemDraft = {
  category: string;
  estimated_quantity?: string;
  quantity_unit?: string;
};

/** Errors for one quantity in `unit` — '' when it's fine (or empty). */
const quantityError = (quantity: string | undefined, unit: string): string => {
  const raw = (quantity ?? '').trim();
  if (!raw) return '';
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    return 'Quantity must be more than 0.';
  }
  if (unit === 'unit' && !Number.isInteger(value)) {
    return 'A count in units must be a whole number.';
  }
  return '';
};

/** Per-item field errors — the same rules the API enforces. */
const validateItem = (
  item: ItemDraft,
  unitsByCategory: UnitsByCategory,
): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!item.category) {
    errors.category = 'Category is required.';
    return errors;
  }
  const allowed = unitsByCategory[item.category] ?? QUANTITY_UNITS;
  const unit = item.quantity_unit || (allowed.length === 1 ? allowed[0] : '');
  if (!unit) {
    errors.quantity_unit = 'Choose a unit.';
  } else if (!allowed.includes(unit as QuantityUnit)) {
    errors.quantity_unit = `Measured in ${allowed
      .map((u) => QUANTITY_UNIT_LABELS[u])
      .join(' or ')}.`;
  } else {
    const quantity = quantityError(item.estimated_quantity, unit);
    if (quantity) errors.estimated_quantity = quantity;
  }
  return errors;
};

const validateItems = (
  items: ItemDraft[],
  unitsByCategory: UnitsByCategory,
): Record<string, string>[] =>
  items.map((item) => validateItem(item, unitsByCategory));

const hasItemErrors = (errors: Record<string, string>[]): boolean =>
  errors.some((e) => Object.keys(e).length > 0);

export {
  formatQuantity,
  hasItemErrors,
  QUANTITY_UNIT_LABELS,
  QUANTITY_UNITS,
  quantityError,
  validateItem,
  validateItems,
};
export type { QuantityUnit, UnitsByCategory };
