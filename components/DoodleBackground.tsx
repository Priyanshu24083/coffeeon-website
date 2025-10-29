"use client";

import { useEffect, useRef } from "react";

export default function DoodleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Doodle shapes
    interface Doodle {
      x: number;
      y: number;
      size: number;
      rotation: number;
      type: "circle" | "star" | "squiggle" | "bean" | "cup";
      opacity: number;
      speed: number;
    }

    const doodles: Doodle[] = [];
    const doodleCount = 30;

    // Create doodles
    for (let i = 0; i < doodleCount; i++) {
      doodles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 30,
        rotation: Math.random() * Math.PI * 2,
        type: ["circle", "star", "squiggle", "bean", "cup"][
          Math.floor(Math.random() * 5)
        ] as Doodle["type"],
        opacity: Math.random() * 0.3 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }

    // Draw doodle shapes
    const drawDoodle = (doodle: Doodle) => {
      ctx.save();
      ctx.translate(doodle.x, doodle.y);
      ctx.rotate(doodle.rotation);
      ctx.strokeStyle = `rgba(251, 191, 36, ${doodle.opacity})`;
      ctx.fillStyle = `rgba(251, 191, 36, ${doodle.opacity * 0.3})`;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      switch (doodle.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, doodle.size / 2, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case "star":
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * doodle.size;
            const y = Math.sin(angle) * doodle.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            const innerAngle = angle + Math.PI / 5;
            const ix = Math.cos(innerAngle) * (doodle.size / 2);
            const iy = Math.sin(innerAngle) * (doodle.size / 2);
            ctx.lineTo(ix, iy);
          }
          ctx.closePath();
          ctx.stroke();
          break;

        case "squiggle":
          ctx.beginPath();
          ctx.moveTo(-doodle.size, 0);
          ctx.bezierCurveTo(
            -doodle.size / 2,
            -doodle.size / 2,
            doodle.size / 2,
            doodle.size / 2,
            doodle.size,
            0
          );
          ctx.stroke();
          break;

        case "bean":
          ctx.beginPath();
          ctx.ellipse(0, 0, doodle.size, doodle.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;

        case "cup":
          ctx.beginPath();
          ctx.moveTo(-doodle.size / 2, -doodle.size / 2);
          ctx.lineTo(-doodle.size / 3, doodle.size / 2);
          ctx.lineTo(doodle.size / 3, doodle.size / 2);
          ctx.lineTo(doodle.size / 2, -doodle.size / 2);
          ctx.closePath();
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    // Animation loop
    let scrollY = window.scrollY;

    const animate = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - scrollY;
      scrollY = currentScrollY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      doodles.forEach((doodle) => {
        // Move doodles based on scroll
        doodle.y -= scrollDelta * doodle.speed;
        doodle.rotation += 0.002;

        // Wrap around
        if (doodle.y < -100) {
          doodle.y = canvas.height + 100;
          doodle.x = Math.random() * canvas.width;
        } else if (doodle.y > canvas.height + 100) {
          doodle.y = -100;
          doodle.x = Math.random() * canvas.width;
        }

        drawDoodle(doodle);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full pointer-events-none"
      style={{
        mixBlendMode: "screen",
        zIndex: 1,
        height: '100vh'
      }}
    />
  );
}