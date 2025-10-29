"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const DURATION = 0.25;
const STAGGER = 0.025;

type FlipLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: string;
};

export default function FlipLink({
  children,
  className,
  ...props
}: FlipLinkProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);
  const hoverTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (topTextRef.current && hoverTextRef.current) {
        const topChildren = topTextRef.current.children;
        const hoverChildren = hoverTextRef.current.children;

        gsap.set(topChildren, { y: 0 });
        gsap.set(hoverChildren, { y: "100%" });

        containerRef.current?.addEventListener("mouseenter", () => {
          gsap.to(topChildren, {
            y: "-100%",
            duration: DURATION,
            ease: "power1.inOut",
            stagger: STAGGER,
          });
          gsap.to(hoverChildren, {
            y: "0%",
            duration: DURATION,
            ease: "power1.inOut",
            stagger: STAGGER,
          });
        });

        containerRef.current?.addEventListener("mouseleave", () => {
          gsap.to(topChildren, {
            y: 0,
            duration: DURATION,
            ease: "power1.inOut",
            stagger: STAGGER,
          });
          gsap.to(hoverChildren, {
            y: "100%",
            duration: DURATION,
            ease: "power1.inOut",
            stagger: STAGGER,
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const text = typeof children === "string" ? children : String(children);

  return (
    <a
      ref={containerRef}
      className={`relative inline-block overflow-hidden ${className ?? ""}`}
      {...props}
    >
      {/* Default Text */}
      <div className="flex" ref={topTextRef} aria-hidden>
        {text.split("").map((ch, i) => (
          <span key={i} className="inline-block">
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>

      {/* Hover Text */}
      <div className="absolute inset-0 flex pointer-events-none" ref={hoverTextRef} aria-hidden>
        {text.split("").map((ch, i) => (
          <span key={i} className="inline-block">
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
    </a>
  );
}
