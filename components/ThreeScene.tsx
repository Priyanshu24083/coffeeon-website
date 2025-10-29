// app/page.tsx
"use client";

import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  MeshReflectorMaterial,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { DoubleSide } from "three";
import * as THREE from "three";
import { useState, useEffect, useCallback } from "react";
import { a, useSpring } from "@react-spring/three";
import RotatingTextCircle from "@/components/RotatingText";

import localFont from "next/font/local";

const rejouice = localFont({
    src:"../public/font/Rejouice-Headline.ttf"
})
const nb = localFont({
    src:"../public/font/NBInternationalProBoo.ttf"
})

type ModelItem = { id: number; path: string };

const models: ModelItem[] = [
  { id: 1, path: "/models/model1.glb" },
  { id: 2, path: "/models/model2.glb" },
  { id: 3, path: "/models/model3.glb" },
];

// Visual glow rings near floor
function RingGlow({ radius, sx, sz }: { radius: number; sx: number; sz: number }) {
  if (!radius) return null;
  return (
    <group
      position={[0, -0.995, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[sx, 1, sz]}
      renderOrder={10}
    >
      <mesh>
        <ringGeometry args={[radius * 0.985, radius * 1.0, 256]} />
        <meshBasicMaterial
          color={"#ffd84d"}
          transparent
          opacity={0.9}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[radius * 1.0, radius * 1.04, 256]} />
        <meshBasicMaterial
          color={"#ffd84d"}
          transparent
          opacity={0.12}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Optional soft spotlight decal on floor
function FloorSpotlight({
  x = 0,
  radius = 1.2,
  color = "#ffe14a",
  intensity = 0.6,
}: {
  x?: number;
  radius?: number;
  color?: string;
  intensity?: number;
}) {
  return (
    <group position={[x, -0.994, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
      <mesh renderOrder={6}>
        <circleGeometry args={[radius * 0.6, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6 * intensity}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh renderOrder={5}>
        <ringGeometry args={[radius * 0.6, radius, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18 * intensity}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Model({
  path,
  targetPos,
  targetScale,
  onHoverChange,
}: {
  path: string;
  targetPos: [number, number, number];
  targetScale: number;
  onHoverChange: (hovered: boolean) => void;
}) {
  const { scene } = useGLTF(path);

  const { position, scale } = useSpring({
    position: targetPos,
    scale: [targetScale, targetScale, targetScale],
    config: { mass: 1, tension: 120, friction: 30 },
  });

  // Use a.group so we can wrap the primitive with <Center bottom />
  return (
    <a.group
      position={position as any}
      scale={scale as any}
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
    >
      <Center bottom>
        <primitive object={scene.clone()} />
      </Center>
    </a.group>
  );
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragIntensity, setDragIntensity] = useState(0);
  const [isManualControl, setIsManualControl] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const ACTIVE_SCALE = 1.8;

  const ring = { radius: 0.66 * ACTIVE_SCALE, sx: 1, sz: 1 };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleModelClick = useCallback((modelIndex: number) => {
    setActiveIndex(modelIndex);
    setIsManualControl(true);
    setTimeout(() => setIsManualControl(false), 5000); // Resume auto after 5s
  }, []);

  useEffect(() => {
    if (isHovered || isManualControl) return;
    const id = setInterval(() => {
      setActiveIndex((p) => (p + 1) % models.length);
    }, 6000);
    return () => clearInterval(id);
  }, [isHovered, isManualControl]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setActiveIndex((p) => (p - 1 + models.length) % models.length);
        setIsManualControl(true);
        setTimeout(() => setIsManualControl(false), 3000);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((p) => (p + 1) % models.length);
        setIsManualControl(true);
        setTimeout(() => setIsManualControl(false), 3000);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <>
     <div className={`h-full flex flex-col items-center justify-between bg-[#000] text-white relative overflow-hidden ${rejouice.className}`}>
        <div className="absolute -top-12 flex justify-center w-full z-1">
          <Image
            src="/lamplight.avif"
            alt="Lamp Spotlight"
            width={100}
            height={100}
            className="pointer-events-none"
          />
        </div>
        <div className="absolute top-24 flex justify-center w-full z-1">
          <RotatingTextCircle
            text="RULE.YOUR.RITUAL."
            radius={120}
          />
        </div>

        <div className="w-full h-[850px] relative z-1 flex items-center justify-center">
          <Canvas camera={{ position: [0, 2, 6], fov: 55 }}>
            <ambientLight intensity={1.2} />
            <spotLight position={[0, 5, 3]} angle={1} penumbra={0.8} intensity={55} castShadow>
              <object3D attach="target" position={[0, 0, 0]} />
            </spotLight>

            {models.map((model, index) => {
              const isActive = index === activeIndex;
              const leftIndex = (activeIndex - 1 + models.length) % models.length;
              const rightIndex = (activeIndex + 1) % models.length;

              let pos: [number, number, number] = [0, -100, 0];
              let scale = 0.5;

              if (isActive) {
                pos = [0, 1.9, 0]; // sits on floor
                scale = ACTIVE_SCALE;
              } else if (index === leftIndex) {
                pos = [-4.5, 1.4, -1]; // sits on floor
                scale = 1.3;
              } else if (index === rightIndex) {
                pos = [4.5, 1.4, -1]; // sits on floor
                scale = 1.3;
              }

              return (
                <Model
                  key={model.id}
                  path={model.path}
                  targetPos={pos}
                  targetScale={scale}
                  onHoverChange={setIsHovered}
                />
              );
            })}

            <RingGlow radius={ring.radius} sx={ring.sx} sz={ring.sz} />

           <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
  <planeGeometry args={[30, 30]} /> {/* was [12, 8] */}
  <MeshReflectorMaterial
    blur={[300, 200]}
    resolution={1024}
    mixBlur={1}
    mixStrength={70}
    depthScale={0.22}
    minDepthThreshold={0.25}
    maxDepthThreshold={0.95}
    color="#111"
    metalness={0.5}
    roughness={0.7}
  />
</mesh>

            <OrbitControls
              enableZoom={false}
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
              target={[0, 0, 0]}
            />

            <EffectComposer multisampling={2}>
              <Bloom
                intensity={5.0}
                luminanceThreshold={0.15}
                luminanceSmoothing={1.0}
                mipmapBlur
                radius={0.85}
              />
            </EffectComposer>
          </Canvas>
        </div>

        <div className="absolute top-15 flex justify-center w-full z-0.99">
          <Image
            src="/spotlight.avif"
            alt="Spotlight Beam"
            width={700}
            height={700}
            className="pointer-events-none opacity-50"
          />
        </div>
      </div> 
    
    </>
  );
}
