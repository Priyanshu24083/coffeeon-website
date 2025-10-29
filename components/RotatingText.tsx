"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface RotatingTextCircleProps {
  text: string;
  radius?: number; // radius of circle
}

export default function RotatingTextCircle({ text, radius = 100 }: RotatingTextCircleProps) {
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(circleRef.current, {
        rotation: 360,
        duration: 30, // slow rotation
        repeat: -1,
        ease: "linear",
      });
    });

    return () => ctx.revert();
  }, []);

  // Split text into letters
  const letters = text.split("");

  return (
    <div className="relative w-[250px] h-[250px] mx-auto">
      <div
        ref={circleRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {letters.map((letter, i) => {
          const angle = (360 / letters.length) * i;
          const rad = (angle * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);

          return (
            <span
              key={i}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                transformOrigin: "0 0",
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
    </div>
  );
}
