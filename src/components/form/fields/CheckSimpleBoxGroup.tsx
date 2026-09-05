import { Search } from 'lucide-react';
import { useState } from 'react';

type CheckSimpleBoxOption = { id: string | number; name: string };

type CheckSimpleBoxGroupProps = {
  label: string;
  field: string;
  options: CheckSimpleBoxOption[];
  formData: Record<string, (string | number)[] | undefined>;
  updateFormData: (field: string, value: (string | number)[]) => void;
  errors?: Record<string, string>;
  required?: boolean;
};

const CheckSimpleBoxGroup = ({
  label,
  field,
  options,
  formData,
  updateFormData,
  errors,
  required = false,
}: CheckSimpleBoxGroupProps) => {
  const selectedIds = formData[field] || [];
  const isSelected = (id: string | number) => selectedIds.includes(id);

  const [search, setSearch] = useState('');

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelection = (id: string | number) => {
    const next = isSelected(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    updateFormData(field, next);
  };

  return (
    <div className="mb-5" data-field={field}>
      <div className="w-full space-y-3 rounded-xl border border-slate-300 bg-white p-3 text-sm">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-900">
            {label} {required && <span className="text-red-600">*</span>}
          </label>

          {filteredOptions.length > 0 && (
            <span className="text-xs text-slate-500">
              {filteredOptions.filter((o) => isSelected(o.id)).length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search value..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 pl-10 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setSearch('')}
            disabled={!search}
            className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-40"
          >
            Clear search
          </button>
        </div>

        <div className="flex flex-wrap gap-2 py-3">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const selected = isSelected(option.id);

              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? 'border-brand-500 bg-brand-100 text-brand-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleSelection(option.id)}
                    className="accent-brand-600"
                  />
                  {option.name}
                </label>
              );
            })
          ) : (
            <div className="w-full rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm text-slate-500">No results found</p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="mt-2 text-xs text-brand-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {errors?.[field] && (
        <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
      )}
    </div>
  );
};

export { CheckSimpleBoxGroup };
