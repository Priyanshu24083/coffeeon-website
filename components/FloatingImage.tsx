// components/FloatingImage.tsx
"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FloatingImageProps = {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  rotate?: number;
};

export default function FloatingImage({
  src,
  width = 200,
  height = 200,
  className = "",
  rotate = 0,
}: FloatingImageProps) {
  const el = useRef<HTMLDivElement | null>(null);
  const [lastMove, setLastMove] = useState(Date.now());
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    let raf = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = event.clientX - innerWidth / 2;
      const offsetY = event.clientY - innerHeight / 2;

      pos.current.tx = offsetX / 40;
      pos.current.ty = offsetY / 40;
      setLastMove(Date.now());
    };

    const loop = () => {
      // simple easing towards target
      pos.current.x += (pos.current.tx - pos.current.x) * 0.12;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.12;

      if (el.current) {
        const rx = (pos.current.y / 50) * 10; // tilt
        const ry = (pos.current.x / 50) * -10;
        el.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rotate}deg)`;
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [rotate]);

  // gentle idle motion when mouse stops
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMove > 1500) {
        pos.current.tx = Math.sin(Date.now() / 1000) * 5;
        pos.current.ty = Math.cos(Date.now() / 1200) * 5;
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lastMove]);

  return (
    <div ref={el} className={`absolute ${className}`}>
      <Image
        src={src}
        alt="Floating"
        width={width}
        height={height}
        className="pointer-events-none object-contain"
        priority
      />
    </div>
  );
}
