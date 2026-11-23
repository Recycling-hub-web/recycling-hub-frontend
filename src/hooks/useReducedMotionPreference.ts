'use client';

import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

/** Default to static content during SSR and honor live preference changes. */
export const useReducedMotionPreference = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => true,
  );
