'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  /** Blocks the click and dims the row — for actions mid-flight (e.g.
   * resend invite), so the menu can't be used to fire the same request
   * twice while the first is still in the air. */
  disabled?: boolean;
};

type ActionsDropdownProps = {
  items: DropdownItem[];
  label?: string;
};

type Position = { top: number; right: number };

const ActionsDropdown = ({
  items,
  label = 'Actions',
}: ActionsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  const updatePosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      close();
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

  useEffect(() => {
    if (!open) return undefined;
    // Tracks the trigger's position every frame while open, rather than
    // computing it once — the panel is portaled to document.body
    // (fixed-positioned from the trigger's own bounding rect, so a short
    // table's overflow-hidden/overflow-x-auto can't clip it), which means
    // it no longer moves automatically with its trigger the way an
    // absolutely-positioned-in-place panel would. In particular, this
    // app's page-enter animation (.page-transition-enter, a `transform`
    // that runs for ~350ms after every navigation) and ordinary scrolling
    // both move the trigger after the panel first opens — a one-shot
    // position computed mid-animation goes stale and the panel ends up
    // misaligned with the real (by-then-settled) trigger, with whatever
    // page content is actually there intercepting clicks meant for it.
    let frame = requestAnimationFrame(function track() {
      updatePosition();
      frame = requestAnimationFrame(track);
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const toggle = () => {
    if (!open) updatePosition();
    setMounted(true);
    setOpen((v) => !v);
  };

  const handleItemClick = (onClick: () => void, disabled?: boolean) => {
    if (disabled) return;
    close();
    onClick();
  };

  return (
    <>
      <button
        ref={buttonRef}
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

      {mounted &&
        position &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            style={{ top: position.top, right: position.right }}
            className={`fixed z-50 w-52 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-100 transition-all duration-200 ${
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
                    disabled={item.disabled}
                    onClick={() => handleItemClick(item.onClick, item.disabled)}
                    className={`group flex w-full items-center gap-3 rounded-full border border-transparent px-3 py-2.5 text-left text-sm transition-all duration-150 ${item.disabled ? 'cursor-not-allowed opacity-50' : colorClasses.row}`}
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
          </div>,
          document.body,
        )}
    </>
  );
};

export { ActionsDropdown };
export type { ActionsDropdownProps, DropdownItem };
