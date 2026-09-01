import { Search } from 'lucide-react';
import type { ChangeEventHandler } from 'react';

type SearchInputProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
};

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchInputProps) => (
  <div className={`relative min-w-[200px] flex-1 ${className}`}>
    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 hover:bg-slate-50 focus:border-brand-500 focus:ring-1 focus:ring-brand-100"
    />
  </div>
);

export { SearchInput };
