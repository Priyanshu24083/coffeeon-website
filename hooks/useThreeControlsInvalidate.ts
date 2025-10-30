"use client";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export function useThreeControlsInvalidate() {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const onPointer = () => invalidate();
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointermove", onPointer, { passive: true });

    // Listen to the custom lenis scroll event dispatched by useSmoothScroll
    const onLenisScroll = () => invalidate();
    window.addEventListener("lenis-scroll", onLenisScroll);

    // Also invalidate when tab returns to visible (so it re-renders at least once)
    const onVisibility = () => {
      if (document.visibilityState === "visible") invalidate();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointermove", onPointer);
      window.removeEventListener("lenis-scroll", onLenisScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [gl, invalidate]);
}