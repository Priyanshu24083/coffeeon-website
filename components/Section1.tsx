"use client";

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "./LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

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

// Configure per-breakpoint asset folders - ALL USE WEBP NOW
const ASSETS: Record<BP, { basePath: string; total: number; loadBatchSize: number; maxDPR: number }> = {
  mobile:  { basePath: "/webp", total: 688, loadBatchSize: 10, maxDPR: 1.5 },
  tablet:  { basePath: "/webp", total: 688, loadBatchSize: 15, maxDPR: 2 },
  desktop: { basePath: "/images-webp", total: 688, loadBatchSize: 20, maxDPR: 2 },
};

// Filename candidates - WebP primary with fallbacks
function filenameCandidates(bp: BP): string[] {
  return ["webp", "wedp", "png", "jpg", "jpeg"];
}

function buildSrc(basePath: string, indexZeroBased: number, ext: string) {
  const n = 1000 + indexZeroBased;
  return `${basePath}/${n}.${ext}`;
}

// ---------- Messages ----------
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

const HIGHLIGHT_WORDS = ["perfect","cup","yours","under","a","minute","Real","beans","Iced","24/7"];
const ITALIC_WORDS = ["yours","under","a","minute","Available","24/7"];

export default function CanvasWithPanels() {
  const { lang } = useLanguage();
  const MESSAGES = lang === "AR" ? MESSAGES_AR : MESSAGES_ENG;

  const bp = useBreakpoint();
  const { basePath: defaultBasePath, total: defaultTotal, loadBatchSize, maxDPR } = ASSETS[bp];

  const totalFrames = defaultTotal;
  const basePathUsedRef = useRef<string>(defaultBasePath);

  // Intro overlay refs
  const introSectionRef = useRef<HTMLElement | null>(null);
  const introOverlayRef = useRef<HTMLDivElement | null>(null);
  const introTitle1Ref = useRef<HTMLHeadingElement | null>(null);
  const introTitle2Ref = useRef<HTMLHeadingElement | null>(null);

  // Messages overlay refs
  const messagesAnchorRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<HTMLParagraphElement[]>([]);
  const messagesTLRef = useRef<gsap.core.Timeline | null>(null);
  const createdSplitsRef = useRef<any[]>([]);

  // Outro overlay refs
  const outroOverlayRef = useRef<HTMLDivElement | null>(null);
  const outroTitle2Ref = useRef<HTMLHeadingElement | null>(null);
  const outroTLRef = useRef<gsap.core.Timeline | null>(null);

  // Footer reveal refs
  const footerWrapRef = useRef<HTMLDivElement | null>(null);
  const footerTLRef = useRef<gsap.core.Timeline | null>(null);

  // Canvas state
  const canvasLayerRef = useRef<HTMLDivElement | null>(null);
  const canvasRefMobile = useRef<HTMLCanvasElement | null>(null);
  const canvasRefTablet = useRef<HTMLCanvasElement | null>(null);
  const canvasRefDesktop = useRef<HTMLCanvasElement | null>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const frameState = useRef({ currentFrame: 0, targetFrame: 0 });
  
  // Animation frame management
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef(-1);
  const lastFrameDrawnRef = useRef(false);
  const allFramesLoadedRef = useRef(false);

  // Text content
  const introTitle1Text = lang === "AR" ? "كوفي أون  ليست آلة بيع قهوة عادية." : "CoffeeOn doesn't vend.";
  const introTitle2Text = lang === "AR" ? "إنها باريستا ذكية بين يديك." : "It's your smart barista.";

  const splitIntoHoverWords = (text: string) =>
    text.split(" ").map((w) => `<span class="hover-word">${w}</span>`).join(" ");

  // 0) Initial intro titles state
  useLayoutEffect(() => {
    if (introTitle1Ref.current && !introTitle1Ref.current.querySelector(".hover-word")) {
      introTitle1Ref.current.innerHTML = splitIntoHoverWords(introTitle1Text);
    }
    if (introTitle2Ref.current && !introTitle2Ref.current.querySelector(".hover-word")) {
      introTitle2Ref.current.innerHTML = splitIntoHoverWords(introTitle2Text);
    }

    const ctx = gsap.context(() => {
      gsap.set(introOverlayRef.current, { autoAlpha: 1, opacity: 1 });
      gsap.set([introTitle1Ref.current, introTitle2Ref.current], {
        position: "absolute",
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center center",
      });
      gsap.set(introTitle1Ref.current, { autoAlpha: 0.45, scale: 0.96 });
      gsap.set(introTitle2Ref.current, { autoAlpha: 0, scale: 0.92 });
    }, introOverlayRef);

    return () => ctx.revert();
  }, [lang, introTitle1Text, introTitle2Text]);

  // 1) Pinned intro timeline with adjusted scrub
  useLayoutEffect(() => {
    if (!introSectionRef.current) return;

    const ctx = gsap.context(() => {
      const scrubValue = bp === "mobile" ? 0.3 : bp === "tablet" ? 0.4 : 0.5;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introSectionRef.current,
          start: "top top",
          end: bp === "mobile" ? "+=2000" : "+=2500",
          pin: true,
          scrub: scrubValue,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress < 0.95 && introOverlayRef.current) {
              introOverlayRef.current.style.pointerEvents = "auto";
            } else if (introOverlayRef.current) {
              introOverlayRef.current.style.pointerEvents = "none";
            }
          },
        },
        defaults: { ease: "none" },
      });

      tl.set(introOverlayRef.current, { autoAlpha: 1 });

      const tIn = 0.45, tOut = 0.35, gap = 0.05;

      tl.to(introTitle1Ref.current, { autoAlpha: 1, scale: 1.05, duration: tIn }, 0);
      tl.to(introTitle1Ref.current, { autoAlpha: 0, scale: 3.2, duration: tOut, ease: "power2.inOut" }, `>+=${gap}`);
      tl.to(introTitle2Ref.current, { autoAlpha: 1, scale: 1.05, duration: tIn }, `>+=${gap}`);
      tl.to(introTitle2Ref.current, { autoAlpha: 0, scale: 3.2, duration: tOut, ease: "power2.inOut" }, `>+=${gap}`);

      tl.to(introOverlayRef.current, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, ">-0.2");
      tl.to(
        canvasLayerRef.current,
        {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.out",
          onStart: () => { 
            frameState.current.targetFrame = 0;
            requestDraw();
          },
        },
        "<"
      );

      ScrollTrigger.refresh();
    }, introSectionRef);

    return () => ctx.revert();
  }, [bp]);

  // 2) Optimized preload with progressive loading
  useEffect(() => {
    basePathUsedRef.current = defaultBasePath;
    lastFrameDrawnRef.current = false;
    allFramesLoadedRef.current = false;
    setImages([]);
    setFirstFrameReady(false);
    frameState.current.currentFrame = 0;
    frameState.current.targetFrame = 0;
    lastDrawnFrameRef.current = -1;

    let cancelled = false;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    const exts = filenameCandidates(bp);

    // Priority frames
    const priorityFrames = [
      0, 1, 2, 3, 4, 5,
      Math.floor(totalFrames * 0.15),
      Math.floor(totalFrames * 0.25),
      Math.floor(totalFrames * 0.35),
      Math.floor(totalFrames * 0.5),
      Math.floor(totalFrames * 0.65),
      Math.floor(totalFrames * 0.75),
      Math.floor(totalFrames * 0.85),
      totalFrames - 5,
      totalFrames - 4,
      totalFrames - 3,
      totalFrames - 2,
      totalFrames - 1
    ];
    const prioritySet = new Set(priorityFrames);

    const loadOne = (i: number, k = 0) => {
      if (cancelled) return;
      if (k >= exts.length) {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImages(loadedImages);
          allFramesLoadedRef.current = true;
        }
        return;
      }
      
      const img = new Image();
      img.src = buildSrc(basePathUsedRef.current, i, exts[k]);
      img.decoding = "async";
      
      img.onload = () => {
        if (cancelled) return;
        loadedImages[i] = img;
        loadedCount++;
        if (!firstFrameReady && i === 0) {
          setFirstFrameReady(true);
          requestDraw();
        }
        if (loadedCount === totalFrames) {
          setImages(loadedImages);
          allFramesLoadedRef.current = true;
        }
      };
      
      img.onerror = () => {
        if (cancelled) return;
        loadOne(i, k + 1);
      };
    };

    // Load priority frames first
    priorityFrames.forEach(i => loadOne(i, 0));

    // Load remaining frames
    const loadBatch = (start: number, batchSize: number) => {
      const end = Math.min(start + batchSize, totalFrames);
      for (let i = start; i < end; i++) {
        if (!prioritySet.has(i)) loadOne(i, 0);
      }
      if (end < totalFrames) {
        const delay = bp === "mobile" ? 100 : 80;
        setTimeout(() => !cancelled && loadBatch(end, batchSize), delay);
      } else if (!cancelled) {
        setImages(loadedImages);
      }
    };

    setTimeout(() => {
      if (!cancelled) loadBatch(0, loadBatchSize);
    }, 300);

    return () => { cancelled = true; };
  }, [bp, defaultBasePath, totalFrames, loadBatchSize]);

  // 3) Optimized draw function with RAF interpolation
  const requestDraw = useCallback(() => {
    if (rafIdRef.current !== null) return;
    
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      
      const getActiveCanvas = () => {
        if (bp === "mobile") return canvasRefMobile.current;
        if (bp === "tablet") return canvasRefTablet.current;
        return canvasRefDesktop.current;
      };

      const canvas = getActiveCanvas();
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d", { 
        alpha: false,
        desynchronized: true,
        willReadFrequently: false
      });
      
      if (!ctx) return;

      const cssW = canvas.clientWidth || window.innerWidth;
      const cssH = canvas.clientHeight || window.innerHeight;

      if (!firstFrameReady || !images.length) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cssW, cssH);
        return;
      }

      // Smooth interpolation
      const target = frameState.current.targetFrame;
      const current = frameState.current.currentFrame;
      const diff = target - current;
      
      const easeFactor = bp === "mobile" ? 0.15 : 0.2;
      frameState.current.currentFrame += diff * easeFactor;
      
      const frameNum = Math.round(frameState.current.currentFrame);
      
      if (frameNum === lastDrawnFrameRef.current) {
        if (Math.abs(diff) > 0.1) {
          requestDraw();
        }
        return;
      }
      
      lastDrawnFrameRef.current = frameNum;
      
      const clamped = Math.min(Math.max(0, frameNum), totalFrames - 1);
      const img = images[clamped];
      
      if (!img || !img.complete) {
        if (Math.abs(diff) > 0.1) {
          requestDraw();
        }
        return;
      }

      const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
      const drawWidth = img.naturalWidth * scale;
      const drawHeight = img.naturalHeight * scale;
      const offsetX = (cssW - drawWidth) / 2;
      const offsetY = (cssH - drawHeight) / 2;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, cssW, cssH);
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      if (clamped === totalFrames - 1) {
        lastFrameDrawnRef.current = true;
      }
      
      if (Math.abs(diff) > 0.1) {
        requestDraw();
      }
    });
  }, [bp, firstFrameReady, images, totalFrames]);

  // 4) Build sequential messages TL with proper Arabic positioning
  const buildMessages = async () => {
    let SplitTextMod: any;
    try { SplitTextMod = await import("gsap/SplitText"); } catch {}
    const SplitText = SplitTextMod?.SplitText || SplitTextMod?.default;
    if (SplitText) gsap.registerPlugin(SplitText);

    messageRefs.current.forEach((el) => {
      if (lang === "AR") {
        // Arabic: position from left
        gsap.set(el, {
          position: "absolute",
          left: 0,
          right: "auto",
          top: "50%",
          yPercent: -50,
          autoAlpha: 0,
          scale: 1,
          textAlign: "right",
        });
      } else {
        // English: position from left
        gsap.set(el, {
          position: "absolute",
          left: 0,
          right: "auto",
          top: "50%",
          yPercent: -50,
          autoAlpha: 0,
          scale: 1,
          textAlign: "left",
        });
      }
    });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    const enterDur = 0.6, holdDur = 0.6, exitDur = 0.5;

    MESSAGES.forEach((_, i) => {
      const el = messageRefs.current[i];
      if (!el) return;

      let split: any = null;
      if (SplitText) {
        split = new SplitText(el, { type: "words", wordsClass: "word++ inline-block" });
        gsap.set(split.words, { display: "inline-block", yPercent: 120, autoAlpha: 0, filter: "blur(8px)" });

        split.words.forEach((wEl: HTMLElement) => {
          const raw = wEl.textContent || "";
          const normalized = raw.replace(/[^\w/]/g, "");
          if (HIGHLIGHT_WORDS.includes(normalized)) wEl.classList.add("text-amber-400");
          if (ITALIC_WORDS.includes(normalized)) wEl.classList.add("italic");
        });

        createdSplitsRef.current.push(split);
      }

      tl.set(el, { autoAlpha: 1 });

      if (split?.words?.length) {
        tl.to(split.words, {
          yPercent: 0,
          autoAlpha: 1,
          duration: enterDur,
          stagger: 0.05,
          ease: "power2.out",
          filter: "blur(0px)",
        });
      } else {
        tl.fromTo(el, { autoAlpha: 0, y: 12, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: enterDur, ease: "power2.out" });
      }

      tl.to({}, { duration: holdDur });
      tl.to(el, { autoAlpha: 0, scale: 1.06, filter: "blur(8px)", duration: exitDur, ease: "power1.inOut" });
    });

    messagesTLRef.current = tl;
  };

  // 5) Build outro overlay TL
  const buildOutro = async () => {
    let SplitTextMod: any;
    try { SplitTextMod = await import("gsap/SplitText"); } catch {}
    const SplitText = SplitTextMod?.SplitText || SplitTextMod?.default;
    if (SplitText) gsap.registerPlugin(SplitText);

    gsap.set(outroOverlayRef.current, { autoAlpha: 0, opacity: 0 });
    gsap.set(outroTitle2Ref.current, {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
      scale: 1,
      transformOrigin: "center center",
    });

    let splitT2: any = null;
    if (SplitText) {
      const SplitTextCtor = SplitText;
      splitT2 = new SplitTextCtor(outroTitle2Ref.current, { type: "lines", linesClass: "line++" });
      gsap.set(splitT2.lines, { yPercent: 120 });
      createdSplitsRef.current.push(splitT2);
    }

    const tl = gsap.timeline({ paused: true });
    const holdOutro = 1.6;

    tl.to(outroOverlayRef.current, { opacity: 1, autoAlpha: 1, duration: 2, ease: "power2.out" });

    tl.set(outroTitle2Ref.current, { autoAlpha: 1 });
    if (splitT2?.lines?.length) {
      tl.to(splitT2.lines, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" });
    } else {
      tl.fromTo(outroTitle2Ref.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out" });
    }

    tl.to({}, { duration: holdOutro });
    tl.to(outroTitle2Ref.current, { scale: 3.2, autoAlpha: 0, duration: 1.0, ease: "power2.inOut" }, "+=0.15");
    tl.to(canvasLayerRef.current, { autoAlpha: 0, duration: 0.1 }, ">");
    outroTLRef.current = tl;
  };

  // 5b) Build footer reveal TL
  const buildFooterReveal = () => {
    const tl = gsap.timeline({ paused: true });
    gsap.set(footerWrapRef.current, { autoAlpha: 0, y: 60 });
    tl.to(footerWrapRef.current, { autoAlpha: 1, y: 0, duration: 1.0, ease: "power2.out" });
    footerTLRef.current = tl;
  };

  // 6) Optimized canvas scrub with mobile-specific settings
  useEffect(() => {
    if (!images.length) return;

    const mm = gsap.matchMedia();

    const setup = async () => {
      lastFrameDrawnRef.current = false;

      await buildMessages();
      await buildOutro();
      buildFooterReveal();

      const durationMultiplier = bp === "mobile" ? 18 : bp === "tablet" ? 19 : 20;
      const duration = totalFrames * durationMultiplier;

      const idxMsgStart = 1080 - 1000;
      const idxMsgEnd = 1440 - 1000;
      const pMsgStart = idxMsgStart / (totalFrames - 1);
      const pMsgEnd = idxMsgEnd / (totalFrames - 1);

      const idxOutroStart = 1620 - 1000;
      const pOutroStart = idxOutroStart / (totalFrames - 1);
      const pOutroEnd = 1;

      const scrubValue = bp === "mobile" ? 0.2 : bp === "tablet" ? 0.3 : 0.5;

      const tween = gsap.to(frameState.current, {
        targetFrame: totalFrames - 1,
        ease: "none",
        onUpdate: () => {
          requestDraw();
        },
        scrollTrigger: {
          trigger: "#canvas-section",
          start: "top top",
          end: `+=${duration}`,
          scrub: scrubValue,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
            const p = self.progress;
            const denomMsg = Math.max(1e-6, pMsgEnd - pMsgStart);
            const denomOutro = Math.max(1e-6, pOutroEnd - pOutroStart);
            const localMsg = Math.min(1, Math.max(0, (p - pMsgStart) / denomMsg));
            const localOutro = Math.min(1, Math.max(0, (p - pOutroStart) / denomOutro));

            if (messagesTLRef.current) messagesTLRef.current.totalProgress(localMsg);

            const canFinishOutro = lastFrameDrawnRef.current && allFramesLoadedRef.current;
            const gatedOutro = canFinishOutro ? localOutro : Math.min(localOutro, 0.999);

            if (outroTLRef.current) outroTLRef.current.totalProgress(gatedOutro);
            if (footerTLRef.current) footerTLRef.current.totalProgress(gatedOutro);
          },
          onScrubComplete: (self) => {
            if (self.progress >= 1) {
              frameState.current.targetFrame = totalFrames - 1;
              frameState.current.currentFrame = totalFrames - 1;
              requestDraw();
            }
          },
        },
      });

      return () => {
        try { 
          tween.scrollTrigger?.kill(); 
          tween.kill(); 
        } catch {}
      };
    };

    const cleanups: Array<() => void> = [];
    mm.add("(max-width: 767px)", () => { setup().then((c) => c && cleanups.push(c)); });
    mm.add("(min-width: 768px) and (max-width: 1023px)", () => { setup().then((c) => c && cleanups.push(c)); });
    mm.add("(min-width: 1024px)", () => { setup().then((c) => c && cleanups.push(c)); });

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      try { messagesTLRef.current?.kill(); } catch {}
      try { outroTLRef.current?.kill(); } catch {}
      try { footerTLRef.current?.kill(); } catch {}
      mm.revert();
      cleanups.forEach((fn) => { try { fn(); } catch {} });
      createdSplitsRef.current.forEach((s) => { try { s?.revert?.(); } catch {} });
      createdSplitsRef.current = [];
    };
  }, [images, firstFrameReady, bp, totalFrames, lang, requestDraw]);

  // 7) Optimized resize with debouncing
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const canvas =
          bp === "mobile" ? canvasRefMobile.current :
          bp === "tablet" ? canvasRefTablet.current :
          canvasRefDesktop.current;

        if (!canvas) return;

        const dpr = Math.min(window.devicePixelRatio || 1, maxDPR);
        const cssW = window.innerWidth;
        const cssH = window.innerHeight;

        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);

        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;

        const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
        if (ctx) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.scale(dpr, dpr);
        }

        requestDraw();
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }, 200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [bp, maxDPR, requestDraw]);

  return (
    <>
      {/* Optimized canvas layer */}
      <div 
        ref={canvasLayerRef} 
        className="fixed inset-0 z-0 opacity-0 overflow-hidden"
        style={{
          willChange: "opacity",
          contain: "strict",
          contentVisibility: "auto",
        }}
      >
        {bp === "mobile" && (
          <canvas 
            ref={canvasRefMobile} 
            className="w-full h-full bg-black pointer-events-none" 
            style={{ 
              display: "block",
              imageRendering: "auto",
              transform: "translateZ(0)",
            }}
          />
        )}
        {bp === "tablet" && (
          <canvas 
            ref={canvasRefTablet} 
            className="w-full h-full bg-black pointer-events-none" 
            style={{ 
              display: "block",
              imageRendering: "auto",
              transform: "translateZ(0)",
            }}
          />
        )}
        {bp === "desktop" && (
          <canvas 
            ref={canvasRefDesktop} 
            className="w-full h-full bg-black pointer-events-none" 
            style={{ 
              display: "block",
              imageRendering: "auto",
              transform: "translateZ(0)",
            }}
          />
        )}
      </div>

      {/* Intro section */}
      <section 
        ref={introSectionRef} 
        className="relative h-screen w-full overflow-hidden" 
        style={{ 
          zIndex: 30,
          contain: "layout style paint"
        }}
      >
        <div 
          ref={introOverlayRef} 
          className="absolute inset-0 bg-[#010101] text-white overflow-hidden"
        >
          <h1
            ref={introTitle1Ref}
            className="text-[clamp(36px,8vw,100px)] leading-[1.05] font-extrabold tracking-[-0.05em] text-center w-full"
            style={{ 
              willChange: "transform, opacity",
              direction: lang === "AR" ? "rtl" : "ltr"
            }}
          >
            {lang === "AR" ? "كوفي أون  ليست آلة بيع قهوة عادية" : "CoffeeOn doesn't vend."}
          </h1>
          <h1
            ref={introTitle2Ref}
            className="text-[clamp(36px,8vw,100px)] leading-[1.05] font-extrabold tracking-[-0.05em] text-center w-full"
            style={{ 
              willChange: "transform, opacity",
              direction: lang === "AR" ? "rtl" : "ltr"
            }}
          >
            {lang === "AR" ? "إنها باريستا ذكية بين يديك." : "It's your smart barista."}
          </h1>
        </div>
      </section>

      {/* Canvas section */}
      <section 
        id="canvas-section" 
        className="relative h-screen w-full overflow-hidden" 
        style={{ 
          zIndex: 10,
          contain: "layout style"
        }}
      >
        <div className="absolute inset-0 z-20 pointer-events-none select-none text-white overflow-hidden">
          <div 
            ref={messagesAnchorRef} 
            className="absolute inset-0 leading-[100%] pl-8 md:pl-12"
            style={{
              direction: lang === "AR" ? "rtl" : "ltr"
            }}
          >
            {MESSAGES.map((m, i) => (
              <p
                key={`${lang}-${i}`}
                ref={(el) => { if (el) messageRefs.current[i] = el; }}
                className="text-[clamp(21px,3.84vw,58px)] leading-[120%] font-semibold tracking-[-0.05em] max-w-[90vw] md:max-w-[70ch]"
                style={{
                  willChange: "transform, opacity",
                  direction: lang === "AR" ? "rtl" : "ltr",
                  textAlign: lang === "AR" ? "right" : "left",
                  unicodeBidi: "embed",
                }}
                dangerouslySetInnerHTML={{ __html: m }}
              />
            ))}
          </div>
        </div>

        {/* Outro overlay */}
        <div
          ref={outroOverlayRef}
          className="absolute inset-0 z-30 pointer-events-none bg-[#010101] text-white overflow-hidden"
        >
          <h2
            ref={outroTitle2Ref}
            className="text-[clamp(32px,7vw,100px)] leading-[1.08] font-extrabold tracking-[-0.05em] text-center max-w-[90vw] mx-auto italic whitespace-nowrap"
            style={{ 
              willChange: "transform, opacity",
              direction: lang === "AR" ? "rtl" : "ltr"
            }}
          >
            {lang === "AR" ? (
              <>كوفي أون، <span className="text-[rgb(251,191,36)] italic">اصنع قهوتك على مزاجك</span></>
            ) : (
              <>CoffeeOn, <span className="text-[rgb(251,191,36)] italic">Rule Your Ritual</span></>
            )}
          </h2>
        </div>
      </section>
    </>
  );
}
