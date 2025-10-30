"use client";

import "./globals.css";
import Navbar from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import LoadingScreen from "@/components/LoadingPage";
import MouseFollower from "@/components/MouseFollower";
import { LanguageProvider } from "@/components/LanguageProvider";
import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import useSmoothScroll from "@/hooks/useSmoothScroll";
import { isLowEndDevice } from "@/lib/device";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Compute device-quality once on client
  const lowEnd = typeof window !== "undefined" ? isLowEndDevice() : false;

  // Initialize Lenis via the hook. The hook returns a ref which will contain the Lenis instance.
  const lenisRef = useSmoothScroll({
    duration: lowEnd ? 0.8 : 1.0,           // tune these: increase duration to slow more
    wheelMultiplier: lowEnd ? 0.9 : 0.6,    // lower -> less jump per wheel tick
    touchMultiplier: 1.2,
    smooth: true,
    normalizeWheel: true,
    throttleRaf: true,
    lowEnd,
    emitScrollEndMs: 240,
    velocitySmoothingAlpha: 0.12,          // lower means heavier smoothing of velocity spikes
  });

  // Wire ScrollTrigger to Lenis using scrollerProxy once Lenis is available.
  useEffect(() => {
    let checkInterval: number | null = null;
    let cleanup = () => {};
    const setupProxy = (lenisInstance: any) => {
      if (!lenisInstance) return;

      const scroller = document.scrollingElement || document.documentElement;

      // Provide a scrollerProxy so ScrollTrigger reads/writes Lenis's virtual scroll
      ScrollTrigger.scrollerProxy(scroller as any, {
        scrollTop(value?: number) {
          if (arguments.length) {
            // write: use immediate to avoid ease jumps
            lenisInstance.scrollTo(value as number, { immediate: true });
          }
          return lenisInstance.scroll;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // If your implementation pins using transforms, change pinType accordingly
        pinType: (scroller as any).style?.transform ? "transform" : "fixed",
      });

      const onLenisScroll = () => {
        ScrollTrigger.update();
      };
      window.addEventListener("lenis-scroll", onLenisScroll);

      const onRefresh = () => {
        // ensure lenis picks up any layout changes
        if (lenisInstance && typeof lenisInstance.raf === "function") lenisInstance.raf(performance.now());
      };
      ScrollTrigger.addEventListener?.("refresh", onRefresh);

      // initial refresh so ScrollTrigger measures sizes correctly
      ScrollTrigger.refresh();

      cleanup = () => {
        window.removeEventListener("lenis-scroll", onLenisScroll);
        ScrollTrigger.removeEventListener?.("refresh", onRefresh);
        // Note: ScrollTrigger does not provide a direct method to "unset" scrollerProxy.
      };
    };

    // If the lenis instance is already ready, set up immediately.
    if (lenisRef?.current) {
      setupProxy(lenisRef.current);
    } else {
      // poll for instance (lenis is initialized in a hook effect so it may be async)
      checkInterval = window.setInterval(() => {
        if (lenisRef?.current) {
          if (checkInterval) clearInterval(checkInterval);
          setupProxy(lenisRef.current);
        }
      }, 80);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      try {
        cleanup();
      } catch {}
    };
  }, [lenisRef]);

  // Keep ScrollTrigger updated on scroll events (safety fallback)
  useEffect(() => {
    const onLenisScroll = () => {
      try {
        ScrollTrigger.update();
      } catch {}
    };
    window.addEventListener("lenis-scroll", onLenisScroll);
    return () => window.removeEventListener("lenis-scroll", onLenisScroll);
  }, []);

  return (
    <html lang="en">
      <body className={montserrat.className} suppressHydrationWarning={true}>
        <LanguageProvider>
          <PageTransition key={pathname}>
            <LoadingScreen />
            <MouseFollower />
            <Navbar />
            {children}
          </PageTransition>
        </LanguageProvider>
      </body>
    </html>
  );
}