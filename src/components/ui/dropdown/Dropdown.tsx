'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type DropdownProps = {
  button: ReactNode;
  children: ReactNode;
  className?: string;
  /** Positioning/animation classes for the panel, e.g. "top-11 right-0 w-max". */
  panelClassName?: string;
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
        className={`absolute z-10 origin-top-right transition-all duration-300 ease-in-out ${
          open ? 'scale-100' : 'pointer-events-none scale-0'
        } ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export { Dropdown };
export type { DropdownProps };
