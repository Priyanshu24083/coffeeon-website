"use client";

import { useEffect, useRef } from "react";

export default function CoffeeFramesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 300;
    const frames: HTMLImageElement[] = [];

    // Helper function to pad numbers with leading zeros
    function pad(num: number, size: number) {
      let s = num.toString();
      while (s.length < size) s = "0" + s;
      return s;
    }

    // Preload frames
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/frames/${pad(i, 3)}.png`;

      frames.push(img);
    }

    let currentFrame = 0;
    let animationFrameId: number;
    let lastTime = 0;
    const fps = 60; // target fps
    const frameDuration = 1000 / fps; // ~16ms

    function render(time: number) {
      animationFrameId = requestAnimationFrame(render);

      if (time - lastTime < frameDuration) return; // skip until enough time passed
      lastTime = time;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const img = frames[currentFrame];
      if (img && img.complete) {
        const scale = Math.min(
          canvas!.width / img.width,
          canvas!.height / img.height
        );
        const x = canvas!.width / 2 - (img.width / 2) * scale;
        const y = canvas!.height / 2 - (img.height / 2) * scale;
        ctx!.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

      currentFrame = (currentFrame + 1) % frameCount;
    }

    frames[0].onload = () => render(0);

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full bg-transparent"
    />
  );
}
