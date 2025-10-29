"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";

export default function MouseFollower() {
  const followerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const pathname = usePathname();

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    // Center follower on pointer
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    // Smooth follow loop
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;
      gsap.set(follower, { x: pos.current.x, y: pos.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Wrap text nodes inside h1, h2, and a into span.wf-word
    const wrapTextNodesWithWordSpans = (root: Element) => {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        (node: Node) => {
          const text = node.textContent ?? "";
          return /\S/.test(text)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      );

      const toReplace: Text[] = [];
      let current: Node | null;
      while ((current = walker.nextNode())) {
        const n = current as Text;
        const parent = n.parentElement;
        if (!parent) continue;
        if (parent.closest(".wf-word")) continue;
        toReplace.push(n);
      }

      for (const textNode of toReplace) {
        const content = textNode.textContent ?? "";
        const parts = content.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        for (const part of parts) {
          if (part.trim().length === 0) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "wf-word";
            span.textContent = part;
            frag.appendChild(span);
          }
        }
        textNode.replaceWith(frag);
      }
    };

    const process = () => {
      document
        .querySelectorAll<HTMLElement>("h1, h2, a")
        .forEach((el) => wrapTextNodesWithWordSpans(el));
    };

    // Initial wrap
    process();

    // Observe DOM for client navigations / lazy content
    const debouncedProcess = (() => {
      let t: number | undefined;
      return () => {
        if (t) window.clearTimeout(t);
        t = window.setTimeout(process, 50);
      };
    })();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList" || m.type === "characterData") {
          debouncedProcess();
          break;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Event delegation for hover effects
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest("a");
      const word = target.closest(".wf-word") as HTMLElement | null;

      // Ring when hovering links
      if (link) {
        gsap.to(follower, {
          backgroundColor: "transparent",
          borderColor: "#FFCF59",
          borderWidth: 1,
          scale: 3,
          boxShadow:
            "0 0 12px rgba(255,207,89,0.9), 0 0 28px rgba(255,207,89,0.6)",
          duration: 0.2,
        });
      }

      // Bloom color on words (h1/h2 or link) — skip dark text
      if (word && (word.closest("h1")  || link)) {
        const computedColor = getComputedStyle(word).color;
        const rgb = computedColor.match(/\d+/g);
        let isDark = false;

        if (rgb && rgb.length >= 3) {
          const [r, g, b] = rgb.map(Number);
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          isDark = brightness < 50; // Treat near-black as dark
        }

        if (!isDark) {
          gsap.to(word, {
            color: "#FFCF59",
            textShadow:
              "0 0 6px rgba(255,207,89,0.8), 0 0 14px rgba(255,207,89,0.6)",
            duration: 0.2,
          });
        }
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const related = e.relatedTarget as HTMLElement | null;

      // Revert follower when leaving a link entirely
      const fromLink = target.closest("a");
      const stillInsideSameLink =
        fromLink && related && related.closest && related.closest("a") === fromLink;
      if (fromLink && !stillInsideSameLink) {
        gsap.to(follower, {
          backgroundColor: "#FFFFFF",
          borderWidth: 0,
          scale: 1,
          boxShadow: "none",
          duration: 0.25,
        });
      }

      // Revert bloom when leaving the specific word
      const word = target.closest(".wf-word") as HTMLElement | null;
      const stillOnSameWord =
        word &&
        related &&
        (related === word ||
          (related as HTMLElement).closest(".wf-word") === word);
      if (word && !stillOnSameWord) {
        gsap.to(word, { color: "", textShadow: "none", duration: 0.25 });
      }
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      observer.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname]);

  return (
    <div
      ref={followerRef}
      className="hidden lg:block fixed top-0 left-0 z-[9999] pointer-events-none rounded-full w-4 h-4 bg-white"
      style={{
        mixBlendMode: "difference",
        borderStyle: "solid",
        borderColor: "transparent",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}
