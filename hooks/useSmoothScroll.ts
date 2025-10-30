"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import Lenis from "lenis";

type UseSmoothScrollOptions = {
  duration?: number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  smooth?: boolean;
  normalizeWheel?: boolean;
  throttleRaf?: boolean;
  lowEnd?: boolean;
  emitScrollEndMs?: number;
  velocitySmoothingAlpha?: number; // 0..1, lower => heavier smoothing
};

/**
 * useSmoothScroll
 * - Creates a Lenis instance and drives its RAF loop.
 * - Emits throttled 'lenis-scroll' and 'lenis-scroll-end' CustomEvents.
 * - Returns a ref object that contains the Lenis instance once initialized: { current: lenis | null }.
 */
export default function useSmoothScroll(opts: UseSmoothScrollOptions = {}): MutableRefObject<any | null> {
  const lenisRef = useRef<any | null>(null);
  const rafRef = useRef<number | null>(null);
  const ticking = useRef(false);
  const lastVelocity = useRef(0);

  useEffect(() => {
    const lowEnd = opts.lowEnd ?? false;

    const settings = {
      duration: opts.duration ?? 1.0,
      wheelMultiplier: opts.wheelMultiplier ?? 0.7,
      touchMultiplier: opts.touchMultiplier ?? 1.2,
      smooth: opts.smooth ?? true,
      normalizeWheel: opts.normalizeWheel ?? true,
    };

    if (lowEnd) {
      settings.duration = opts.duration ?? 0.7;
      settings.wheelMultiplier = opts.wheelMultiplier ?? 0.9;
      settings.smooth = true;
    }

    const lenis = new Lenis({
      duration: settings.duration,
      wheelMultiplier: settings.wheelMultiplier,
      touchMultiplier: settings.touchMultiplier,
      smooth: settings.smooth,
      normalizeWheel: settings.normalizeWheel,
    });

    // expose on the ref
    lenisRef.current = lenis;

    // RAF loop that drives Lenis
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // velocity smoothing alpha (lower -> smoother)
    const alpha = typeof opts.velocitySmoothingAlpha === "number" ? opts.velocitySmoothingAlpha : 0.18;

    // emit scroll payload (throttled to rAF by default)
    const emitScroll = (e: any) => {
      const v = e?.velocity ?? 0;
      lastVelocity.current = lastVelocity.current * (1 - alpha) + v * alpha;

      const payload = {
        scroll: e?.scroll ?? lenis.scroll,
        limit: e?.limit ?? 0,
        delta: e?.delta ?? 0,
        velocity: lastVelocity.current,
      };

      if (opts.throttleRaf === false) {
        window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: payload }));
        return;
      }

      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: payload }));
          ticking.current = false;
        });
      }
    };

    // emit scroll-end with debounce
    let endTimer: any = null;
    const emitScrollEnd = (e: any) => {
      const waitMs = opts.emitScrollEndMs ?? 220;
      clearTimeout(endTimer);
      endTimer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent("lenis-scroll-end", { detail: { scroll: e?.scroll ?? lenis.scroll } }));
      }, waitMs);
    };

    lenis.on("scroll", emitScroll);
    lenis.on("scroll", emitScrollEnd);

    // optional convenience: also attach to window so other code can access directly
    // window.__lenis = lenis; // uncomment if you want a global

    return () => {
      lenis.off("scroll", emitScroll);
      lenis.off("scroll", emitScrollEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        lenis.destroy();
      } catch (err) {
        // ignore
      }
      lenisRef.current = null;
    };
  }, [
    opts.duration,
    opts.wheelMultiplier,
    opts.touchMultiplier,
    opts.smooth,
    opts.normalizeWheel,
    opts.lowEnd,
    opts.throttleRaf,
    opts.emitScrollEndMs,
    opts.velocitySmoothingAlpha,
  ]);

  // Return the ref that will contain the Lenis instance once initialised.
  return lenisRef;
}