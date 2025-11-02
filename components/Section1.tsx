"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "./LanguageProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ✅ Prevent GSAP from registering on server
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------- Responsive helpers ----------
function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState(defaultValue);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

type BP = "mobile" | "tablet" | "desktop";
function useBreakpoint(): BP {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  return isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
}

// ---------- Config ----------
const ASSETS: Record<
  BP,
  { basePath: string; total: number; loadBatchSize: number; maxDPR: number }
> = {
  mobile: { basePath: "/webp", total: 688, loadBatchSize: 10, maxDPR: 1.5 },
  tablet: { basePath: "/webp", total: 688, loadBatchSize: 15, maxDPR: 2 },
  desktop: { basePath: "/images-webp", total: 688, loadBatchSize: 20, maxDPR: 2 },
};

function filenameCandidates(bp: BP): string[] {
  return ["webp", "wedp", "png", "jpg", "jpeg"];
}

function buildSrc(basePath: string, indexZeroBased: number, ext: string) {
  const n = 1000 + indexZeroBased;
  return `${basePath}/${n}.${ext}`;
}

// ---------- Text Messages ----------
const MESSAGES_ENG = [
  "Save your perfect cup<br/>in the app",
  "Skip the queue",
  "and make every coffee<br/>yours.",
  "Hot, iced, or your own <br/> signature recipe in <br/> under a minute",
  "Real Milk <br/> Fresh beans <br/> Iced Options",
  "Available 24/7",
];

const MESSAGES_AR = [
  "اطلب فنجانك على طريقتك في التطبيق",
  "تخطَّ طوابير الانتظار",
  "واجعل كل كوب قهوة على مزاجك ",
  "ساخنة أو مثلجة أو وصفة على مزاجك في أقل من دقيقة",
  "حليب طازج – حبوب بن طازجة – خيارات مثلجة ",
  "متاحة على مدار الساعة كل أيام الاسبوع",
];

const HIGHLIGHT_WORDS = ["perfect", "cup", "yours", "under", "minute", "Real", "beans", "Iced", "24/7"];
const ITALIC_WORDS = ["yours", "under", "minute", "Available", "24/7"];

export default function CanvasWithPanels() {
  const { lang } = useLanguage();
  const MESSAGES = lang === "AR" ? MESSAGES_AR : MESSAGES_ENG;

  const bp = useBreakpoint();
  const { basePath: defaultBasePath, total: defaultTotal, loadBatchSize, maxDPR } =
    ASSETS[bp];

  const totalFrames = defaultTotal;
  const basePathUsedRef = useRef<string>(defaultBasePath);

  const introSectionRef = useRef<HTMLElement | null>(null);
  const introOverlayRef = useRef<HTMLDivElement | null>(null);
  const introTitle1Ref = useRef<HTMLHeadingElement | null>(null);
  const introTitle2Ref = useRef<HTMLHeadingElement | null>(null);

  const messagesAnchorRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<HTMLParagraphElement[]>([]);
  const messagesTLRef = useRef<gsap.core.Timeline | null>(null);
  const outroOverlayRef = useRef<HTMLDivElement | null>(null);
  const outroTitle2Ref = useRef<HTMLHeadingElement | null>(null);
  const outroTLRef = useRef<gsap.core.Timeline | null>(null);
  const footerWrapRef = useRef<HTMLDivElement | null>(null);
  const footerTLRef = useRef<gsap.core.Timeline | null>(null);

  const canvasLayerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefMobile = useRef<HTMLCanvasElement | null>(null);
  const canvasRefTablet = useRef<HTMLCanvasElement | null>(null);
  const canvasRefDesktop = useRef<HTMLCanvasElement | null>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const frameState = useRef({ currentFrame: 0, targetFrame: 0 });
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef(-1);

  const introTitle1Text =
    lang === "AR" ? "كوفي أون  ليست آلة بيع قهوة عادية." : "CoffeeOn doesn't vend.";
  const introTitle2Text =
    lang === "AR" ? "إنها باريستا ذكية بين يديك." : "It's your smart barista.";

  // ---------- Safe Effects (window checks added everywhere) ----------

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!introTitle1Ref.current || !introTitle2Ref.current) return;

    introTitle1Ref.current.innerHTML = introTitle1Text;
    introTitle2Ref.current.innerHTML = introTitle2Text;

    const ctx = gsap.context(() => {
      gsap.set(introOverlayRef.current, { autoAlpha: 1 });
    }, introOverlayRef);

    return () => ctx.revert();
  }, [lang, introTitle1Text, introTitle2Text]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!images.length) return;

    const ctx = gsap.context(() => {
      // Example scroll animation
      gsap.to(frameState.current, {
        targetFrame: totalFrames - 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#canvas-section",
          start: "top top",
          end: "+=4000",
          scrub: 0.5,
          pin: true,
        },
        onUpdate: () => {
          requestDraw();
        },
      });
    });

    return () => ctx.revert();
  }, [images, totalFrames]);

  const requestDraw = useCallback(() => {
    if (typeof window === "undefined") return;
    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const canvas =
        bp === "mobile"
          ? canvasRefMobile.current
          : bp === "tablet"
          ? canvasRefTablet.current
          : canvasRefDesktop.current;

      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = images[Math.round(frameState.current.currentFrame)];
      if (img) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });
  }, [bp, images]);

  // ---------- Resize Handling ----------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      const canvas =
        bp === "mobile"
          ? canvasRefMobile.current
          : bp === "tablet"
          ? canvasRefTablet.current
          : canvasRefDesktop.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDPR);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [bp, maxDPR]);

  // ---------- Render ----------
  return (
    <>
      {/* Canvas layer */}
      <div ref={canvasLayerRef} className="fixed inset-0 z-0 opacity-0 overflow-hidden">
        {bp === "mobile" && <canvas ref={canvasRefMobile} className="w-full h-full bg-black" />}
        {bp === "tablet" && <canvas ref={canvasRefTablet} className="w-full h-full bg-black" />}
        {bp === "desktop" && <canvas ref={canvasRefDesktop} className="w-full h-full bg-black" />}
      </div>

      {/* Intro */}
      <section ref={introSectionRef} className="relative h-screen w-full overflow-hidden">
        <div
          ref={introOverlayRef}
          className="absolute inset-0 bg-[#010101] text-white overflow-hidden"
        >
          <h1
            ref={introTitle1Ref}
            className="text-[clamp(36px,8vw,100px)] leading-[1.05] font-extrabold tracking-[-0.05em] text-center w-full"
          >
            {introTitle1Text}
          </h1>
          <h1
            ref={introTitle2Ref}
            className="text-[clamp(36px,8vw,100px)] leading-[1.05] font-extrabold tracking-[-0.05em] text-center w-full"
          >
            {introTitle2Text}
          </h1>
        </div>
      </section>

      {/* Canvas section */}
      <section id="canvas-section" className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-20 pointer-events-none select-none text-white overflow-hidden">
          <div
            ref={messagesAnchorRef}
            className="absolute inset-0 leading-[100%] pl-8 md:pl-12"
            style={{
              direction: lang === "AR" ? "rtl" : "ltr",
            }}
          >
            {MESSAGES.map((m, i) => (
              <p
                key={`${lang}-${i}`}
                ref={(el) => {
                  if (el) messageRefs.current[i] = el;
                }}
                className="text-[clamp(21px,3.84vw,58px)] leading-[120%] font-semibold tracking-[-0.05em] max-w-[90vw] md:max-w-[70ch]"
                dangerouslySetInnerHTML={{ __html: m }}
              />
            ))}
          </div>
        </div>

        <div
          ref={outroOverlayRef}
          className="absolute inset-0 z-30 pointer-events-none bg-[#010101] text-white overflow-hidden"
        >
          <h2
            ref={outroTitle2Ref}
            className="text-[clamp(32px,7vw,100px)] leading-[1.08] font-extrabold tracking-[-0.05em] text-center max-w-[90vw] mx-auto italic whitespace-nowrap"
          >
            {lang === "AR" ? (
              <>
                كوفي أون،{" "}
                <span className="text-[rgb(251,191,36)] italic">
                  اصنع قهوتك على مزاجك
                </span>
              </>
            ) : (
              <>
                CoffeeOn,{" "}
                <span className="text-[rgb(251,191,36)] italic">Rule Your Ritual</span>
              </>
            )}
          </h2>
        </div>
      </section>
    </>
  );
}
