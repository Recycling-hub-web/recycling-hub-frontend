'use client';

import { MotionConfig } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

import { useReducedMotionPreference } from '../../hooks/useReducedMotionPreference';

export const SmoothScroll = ({
  children,
  root,
  className,
}: {
  children: ReactNode;
  root?: boolean;
  className?: string;
}) => {
  const reducedMotion = useReducedMotionPreference();
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root={root}
        className={className}
        options={{
          lerp: reducedMotion ? 1 : 0.1,
          duration: reducedMotion ? 0 : 1.2,
          smoothWheel: !reducedMotion,
        }}
      >
        {children}
      </ReactLenis>
    </MotionConfig>
  );
};
