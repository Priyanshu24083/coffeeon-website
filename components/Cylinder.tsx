"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ✅ Only register GSAP on client
if (typeof window !== "undefined" && gsap && !gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Simple animated cylinder text using react-three-fiber and drei
 * Works safely on client (SSR disabled)
 */

function RotatingCylinderText({ lang }: { lang: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  // Rotate animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.5;
  });

  const text = lang === "AR" ? "كوفي أون - اصنع قهوتك على مزاجك" : "CoffeeOn • Rule Your Ritual";

  return (
    <group ref={groupRef}>
      {/* Create multiple text segments around cylinder */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3.5;
        return (
          <Text
            key={i}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
            fontSize={0.5}
            color="#ffcc33"
            font="/fonts/Inter-Bold.woff"
            anchorX="center"
            anchorY="middle"
          >
            {text}
          </Text>
        );
      })}
    </group>
  );
}

function CylinderScene({ lang }: { lang: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ Run GSAP only client-side
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[80vh]">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: "black" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} />
        <motion.group initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1 }}>
          <RotatingCylinderText lang={lang} />
        </motion.group>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}

// ✅ Export as dynamic (SSR disabled for Three.js)
export default dynamic(() => Promise.resolve(CylinderScene), {
  ssr: false,
});
