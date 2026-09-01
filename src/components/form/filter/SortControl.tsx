type SortOption = { label: string; value: string };

type SortControlProps = {
  value: string;
  onChange: (val: string) => void;
  options: SortOption[];
  defaultLabel?: string;
  /** Value emitted when the user picks the default option — matches
   * whatever "no sort applied" means to the caller's filter state. */
  defaultValue?: string;
};

// Genericized from a version hardcoded to two specific sort fields
// (commission/tuition) from another project — options are now caller-supplied.
const SortControl = ({
  value,
  onChange,
  options,
  defaultLabel = 'Default sort',
  defaultValue = 'all',
}: SortControlProps) => (
  <div className="flex items-center gap-2">
    <span className="shrink-0 text-sm font-medium text-slate-500">Sort by</span>
    <select
      value={value === defaultValue ? '' : value}
      onChange={(e) => onChange(e.target.value || defaultValue)}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none transition hover:bg-slate-50 focus:ring-1 focus:ring-brand-500"
    >
      <option value="">{defaultLabel}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export { SortControl };
export type { SortOption };
