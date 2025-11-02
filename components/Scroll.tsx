"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/components/LanguageProvider";

// ✅ Only register GSAP on client
if (typeof window !== "undefined" && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type ElRef = React.MutableRefObject<HTMLDivElement | null>;

function Scroll() {
  const { lang } = useLanguage();

  const t = useMemo(() => {
    if (lang === "AR") {
      return {
        heading: "قهوة تتحرك معك، تناسب روتينك، وتشعرك وكأنها صنعت لك خصيصًا",
        dir: "rtl" as const,
      };
    }
    return {
      heading:
        "Coffee that moves with you, fits your routine, and feels like it’s made just for you",
      dir: "ltr" as const,
    };
  }, [lang]);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const c1 = useRef<HTMLDivElement | null>(null);
  const c2 = useRef<HTMLDivElement | null>(null);
  const c3 = useRef<HTMLDivElement | null>(null);
  const c4 = useRef<HTMLDivElement | null>(null);

  // --- Lazy mount when section is visible ---
  const [isInView, setIsInView] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = sentinelRef.current;
    if (!el || isInView) return;

    const obs = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin: "30% 0px", threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isInView]);

  // --- Card positioning helper ---
  const placeCards = () => {
    const placements = [
      { ref: titleRef as ElRef, leftVw: 50, topPct: 50, xPercent: 0 },
      { ref: c1 as ElRef, leftVw: 70, topPct: 22, xPercent: -50 },
      { ref: c2 as ElRef, leftVw: 160, topPct: 58, xPercent: -50 },
      { ref: c3 as ElRef, leftVw: 260, topPct: 30, xPercent: -50 },
      { ref: c4 as ElRef, leftVw: 360, topPct: 65, xPercent: -50 },
    ];

    placements.forEach(({ ref, leftVw, topPct, xPercent }) => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, {
        position: "absolute",
        left: `${leftVw}vw`,
        top: `${topPct}%`,
        xPercent,
        yPercent: -50,
      });
    });
  };

  // --- GSAP Scroll Animations ---
  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      if (!isInView) return;

      const section = sectionRef.current!;
      const track = trackRef.current!;

      const build = () => {
        placeCards();

        const viewportW = section.clientWidth;
        const totalW = track.scrollWidth;
        const distance = Math.max(0, totalW - viewportW);

        gsap.set(track, { x: 0 });
        const xScroll = lang === "AR" ? distance : -distance;

        const tween = gsap.to(track, {
          x: xScroll,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // --- Card parallax ---
        const cards = [
          { el: c1.current, offset: 150 },
          { el: c2.current, offset: 250 },
          { el: c3.current, offset: 350 },
          { el: c4.current, offset: 450 },
        ];

        cards.forEach(({ el, offset }) => {
          if (!el) return;
          gsap.to(el, {
            x: lang === "AR" ? -offset : offset,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance}`,
              scrub: true,
            },
          });
        });

        return tween;
      };

      let tween: gsap.core.Tween | null = null;

      const rebuild = () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = build();
      };

      const ready = (document as any).fonts?.ready ?? Promise.resolve();
      ready.then(() => {
        rebuild();
        ScrollTrigger.refresh();
      });

      ScrollTrigger.addEventListener("refreshInit", rebuild);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", rebuild);
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    },
    { scope: sectionRef, dependencies: [lang, isInView] }
  );

  if (!isInView) {
    return <div ref={sentinelRef} style={{ minHeight: "100vh" }} />;
  }

  return (
    <main
      className="min-h-screen bg-[#010101] text-white p-8 overflow-x-hidden z-20"
      dir={t.dir}
    >
      <section
        ref={sectionRef}
        className="relative h-screen overflow-hidden px-4 sm:px-8"
        style={{ direction: t.dir }}
      >
        <div
          ref={trackRef}
          className="absolute inset-0 h-full flex items-center"
          style={{
            width: "180vw",
            minWidth: "150vw",
          }}
        >
          {/* Heading */}
          <h1
            ref={titleRef}
            className="font-black text-[clamp(40px,9vw,120px)] leading-tight whitespace-nowrap pr-8 sm:pr-24 max-w-[60vw] sm:max-w-[45vw]"
          >
            {t.heading}
          </h1>

          {/* Cards */}
          {[c1, c2, c3, c4].map((ref, i) => (
            <div
              key={i}
              ref={ref}
              className="w-[65vw] sm:w-[38vw] md:w-[30vw] max-w-[400px] aspect-square rounded-2xl overflow-hidden shadow-2xl"
            >
              <picture>
                <source srcSet="/icedCup.webp" type="image/webp" />
                <Image
                  src="/icedCup.png"
                  alt={`Card ${i + 1}`}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ✅ Export dynamically (disable SSR)
export default dynamic(() => Promise.resolve(Scroll), { ssr: false });
