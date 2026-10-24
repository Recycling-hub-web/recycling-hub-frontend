'use client';

import type { IconType } from 'react-icons';

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconType;
  /** Text color of this option while selected — e.g. red for "Reject". */
  activeClassName?: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  /** Names the group for screen readers, e.g. "Pricing mode". */
  ariaLabel?: string;
  /** Stretch to fill the row — options grow from their own width, so
   * longer labels get more room on narrow screens. */
  fullWidth?: boolean;
  className?: string;
};

/** A pill-shaped "pick one of a few" control — the selected option sits
 * on a white chip. Each option is a toggle button (`aria-pressed`). */
const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel,
  fullWidth = false,
  className = '',
}: SegmentedControlProps<T>) => (
  <div
    role="group"
    aria-label={ariaLabel}
    className={`${fullWidth ? 'flex w-full' : 'inline-flex'} rounded-full border border-slate-200 bg-slate-50 p-1 ${className}`}
  >
    {options.map(
      ({ value: optionValue, label, icon: Icon, activeClassName }) => {
        const active = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            aria-pressed={active}
            disabled={disabled}
            className={`flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1.5 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none sm:px-3.5 ${
              fullWidth ? 'flex-auto' : ''
            } ${
              active
                ? `bg-white ring-1 ring-slate-200 ${activeClassName ?? 'text-brand-600'}`
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {/* Icons only from sm up — on narrow screens the labels need
                the room, so the control never overflows. */}
            {Icon && (
              <Icon
                className="hidden size-4 shrink-0 sm:block"
                aria-hidden="true"
              />
            )}
            <span className="truncate">{label}</span>
          </button>
        );
      },
    )}
  </div>
);

export { SegmentedControl };
export type { SegmentedControlProps, SegmentedOption };
