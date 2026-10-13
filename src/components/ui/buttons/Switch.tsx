'use client';

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name — e.g. the visible label text next to it. */
  label: string;
  disabled?: boolean;
};

/** A compact on/off switch (role="switch"), same track/thumb look as
 * ToggleInput but without its full-width card — for sitting inline next
 * to a heading or row label. */
const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
}: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${
      checked ? 'bg-brand-600' : 'bg-slate-300'
    }`}
  >
    <span
      className={`absolute start-0 top-0.5 size-5 rounded-full bg-white transition-transform duration-300 ease-out motion-reduce:transition-none ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

export { Switch };
export type { SwitchProps };
