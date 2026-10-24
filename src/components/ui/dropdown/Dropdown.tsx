'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type DropdownProps = {
  button: ReactNode;
  children: ReactNode;
  className?: string;
  /** Positioning/animation classes for the panel — must include its own
   * position utility (usually "absolute ..."), since a fixed-width panel
   * anchored to a button that isn't flush against the viewport edge can
   * overflow off-screen on a narrow viewport; a caller needing to avoid
   * that can pass "fixed" instead, scoped to a breakpoint (e.g.
   * "fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:end-0 sm:w-80"). */
  panelClassName?: string;
  /** Close the panel when anything inside it is clicked — for menus whose
   * items navigate or act, as opposed to panels you interact with. */
  closeOnSelect?: boolean;
};

// Fixes from the pasted version: the trigger used `onMouseDown` instead of
// `onClick` (non-standard for a button, interferes with text selection),
// and there was no Escape-key handling despite every other overlay
// component in this kit (Modal, ActionsDropdown) supporting it.
const Dropdown = ({
  button,
  children,
  className = '',
  panelClassName = '',
  closeOnSelect = false,
}: DropdownProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative flex ${className}`}>
      <div className="flex" onClick={() => setOpen((v) => !v)}>
        {button}
      </div>
      <div
        className={`z-10 origin-top-right transition-all duration-300 ease-in-out ${
          open ? 'scale-100' : 'pointer-events-none scale-0'
        } ${panelClassName}`}
        onClick={closeOnSelect ? () => setOpen(false) : undefined}
      >
        {children}
      </div>
    </div>
  );
};

export { Dropdown };
export type { DropdownProps };
