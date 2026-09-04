'use client';

import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import { LuChevronRight } from 'react-icons/lu';

import type { BadgeVariant } from '../badges/variants';

const ITEM_COLOR_CLASSES: Record<BadgeVariant, { row: string; icon: string }> =
  {
    success: {
      row: 'hover:border-brand-200 hover:bg-brand-50',
      icon: 'bg-brand-100 text-brand-600 group-hover:bg-brand-200',
    },
    info: {
      row: 'hover:border-blue-200 hover:bg-blue-50',
      icon: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
    },
    danger: {
      row: 'hover:border-red-200 hover:bg-red-50',
      icon: 'bg-red-100 text-red-600 group-hover:bg-red-200',
    },
    warning: {
      row: 'hover:border-amber-200 hover:bg-amber-50',
      icon: 'bg-amber-100 text-amber-600 group-hover:bg-amber-200',
    },
    attention: {
      row: 'hover:border-orange-200 hover:bg-orange-50',
      icon: 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
    },
    neutral: {
      row: 'hover:border-slate-200 hover:bg-slate-50',
      icon: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
    },
  };

type DropdownItem = {
  label: string;
  icon: IconType;
  onClick: () => void;
  /** Reuses the same variant vocabulary as the badge components, so the
   * whole UI kit shares one consistent color-meaning system. */
  color?: BadgeVariant;
};

type ActionsDropdownProps = {
  items: DropdownItem[];
  label?: string;
};

const ActionsDropdown = ({
  items,
  label = 'Actions',
}: ActionsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const toggle = () => {
    setMounted(true);
    setOpen((v) => !v);
  };

  const handleItemClick = (onClick: () => void) => {
    close();
    onClick();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all duration-150 ${
          open
            ? 'border-slate-300 bg-slate-100 text-slate-800 shadow-inner'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        {label}
        <LuChevronRight
          className={`size-4 transition-transform duration-200 ${open ? 'rotate-90' : 'rotate-0'}`}
        />
      </button>

      {mounted && (
        <div
          className={`absolute right-0 top-full z-50 mt-2 w-52 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-100 transition-all duration-200 ${
            open
              ? 'translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
          }`}
          onTransitionEnd={() => {
            if (!open) setMounted(false);
          }}
          role="menu"
        >
          <div className="p-1.5">
            {items.map((item, i) => {
              const colorClasses = ITEM_COLOR_CLASSES[item.color ?? 'info'];
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => handleItemClick(item.onClick)}
                  className={`group flex w-full items-center gap-3 rounded-full border border-transparent px-3 py-2.5 text-left text-sm transition-all duration-150 ${colorClasses.row}`}
                  style={{ transitionDelay: open ? `${i * 30}ms` : '0ms' }}
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${colorClasses.icon}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="font-medium text-slate-900">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export { ActionsDropdown };
export type { ActionsDropdownProps, DropdownItem };
