'use client';

import { useEffect, useRef } from 'react';

export function CursorSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Gate: skip on touch-only devices (no fine pointer or hover capability).
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    // Gate: respect the visitor's reduced-motion preference.
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotionQuery.matches) return;

    let rafId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      pendingX = event.clientX;
      pendingY = event.clientY;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        overlay.style.setProperty('--mx', `${pendingX}px`);
        overlay.style.setProperty('--my', `${pendingY}px`);
        rafId = null;
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={overlayRef} className="cursor-spotlight" aria-hidden="true" />;
}
