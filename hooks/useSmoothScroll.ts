"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smooth?: boolean;
  smoothTouch?: boolean;
  touchMultiplier?: number;
}

export const useSmoothScroll = (options: LenisOptions = {}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2,
      ...options,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef.current;
};
