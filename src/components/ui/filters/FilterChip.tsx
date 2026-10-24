'use client';

import { LuX } from 'react-icons/lu';

type FilterChipProps = {
  label: string;
  onRemove: () => void;
};

const FilterChip = ({ label, onRemove }: FilterChipProps) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-medium text-brand-700">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
      className="flex size-4 items-center justify-center rounded-full text-brand-500 transition hover:bg-brand-200 hover:text-brand-800"
    >
      <LuX className="size-3" />
    </button>
  </span>
);

export { FilterChip };
export type { FilterChipProps };
