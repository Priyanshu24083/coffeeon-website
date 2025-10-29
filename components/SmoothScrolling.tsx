"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, forwardRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SmoothScrollingProps {
  children: ReactNode;
}

const SmoothScrolling = forwardRef<any, SmoothScrollingProps>(({ children }, ref) => {
  const lenis = useLenis();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!lenis) return;

    // Keep ScrollTrigger in sync with Lenis' virtual scroll
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll as any);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      try { lenis.off("scroll", onScroll as any); } catch {}
      window.removeEventListener("resize", onResize);
    };
  }, [lenis]);

  return (
    <ReactLenis
      ref={ref}
      root
      options={{
        lerp: 1,
        duration: 2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
});

SmoothScrolling.displayName = 'SmoothScrolling';

export default SmoothScrolling;
