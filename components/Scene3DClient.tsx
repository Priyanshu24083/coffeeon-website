"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Center,
  MeshReflectorMaterial,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { DoubleSide, Vector3, MeshStandardMaterial } from "three";
import { a, useSpring } from "@react-spring/three";

interface Props {
  models: any[];
  activeIndex: number;
  setIsHovered: (hovered: boolean) => void;
  handleModelClick: (index: number) => void;
  ACTIVE_SCALE: number;
  ring: { radius: number; sx: number; sz: number };
}

// Hanging bulb component
function HangingBulb() {
  const bulbRef = useRef<any>();
  const lightRef = useRef<any>();
  const targetRef = useRef<any>();

  useFrame((state) => {
    if (bulbRef.current) {
      // Gentle swaying motion
      const time = state.clock.elapsedTime;
      bulbRef.current.position.x = Math.sin(time * 0.3) * 0.05;
      bulbRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
    }
  });

  return (
    <group ref={bulbRef} position={[0, 3.5, 0]}>
      {/* Hanging cord */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 3, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Bulb socket */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.15, 16]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Light bulb */}
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#fff8dc"
          emissive="#fff8dc"
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Target helper for spotlight direction */}
      <mesh ref={targetRef} position={[0, -3.8, 0]} visible={false}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
      </mesh>

      {/* Decorative lights only - no illumination */}
    </group>
  );
}

// Coffee powder dust particles
function CoffeeDust({ shouldAnimate }: { shouldAnimate: boolean }) {
  const particlesRef = useRef<any>();
  const particleCount = 300; // Increased from 100 to 300
  const velocitiesRef = useRef<Float32Array>();
  const [impactTime, setImpactTime] = useState<number | null>(null);

  useEffect(() => {
    if (shouldAnimate) {
      // Machine impact happens after 1.5 seconds (when it hits the ground)
      const timer = setTimeout(() => {
        setImpactTime(Date.now());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  useFrame((state) => {
    if (!particlesRef.current || !shouldAnimate) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;
    const timeSinceImpact = impactTime ? (Date.now() - impactTime) / 1000 : 0;

    // Initialize velocities if not done
    if (!velocitiesRef.current) {
      velocitiesRef.current = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        velocitiesRef.current[i3] = (Math.random() - 0.5) * 0.1; // X velocity
        velocitiesRef.current[i3 + 1] = Math.random() * 0.05; // Y velocity
        velocitiesRef.current[i3 + 2] = (Math.random() - 0.5) * 0.1; // Z velocity
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      if (impactTime && timeSinceImpact < 2) {
        // Explosive dust cloud when machine hits ground
        const explosionForce = Math.max(0, 2 - timeSinceImpact) * 0.3;

        // Apply explosion force
        velocitiesRef.current[i3] += (Math.random() - 0.5) * explosionForce * 0.1;
        velocitiesRef.current[i3 + 1] += Math.random() * explosionForce * 0.2;
        velocitiesRef.current[i3 + 2] += (Math.random() - 0.5) * explosionForce * 0.1;

        // Apply velocities
        positions[i3] += velocitiesRef.current[i3];
        positions[i3 + 1] += velocitiesRef.current[i3 + 1];
        positions[i3 + 2] += velocitiesRef.current[i3 + 2];

        // Apply gravity and air resistance
        velocitiesRef.current[i3] *= 0.98; // Air resistance X
        velocitiesRef.current[i3 + 1] -= 0.005; // Gravity
        velocitiesRef.current[i3 + 1] *= 0.99; // Air resistance Y
        velocitiesRef.current[i3 + 2] *= 0.98; // Air resistance Z
      } else {
        // Normal settling behavior
        positions[i3 + 1] -= 0.008; // Slower falling
        positions[i3] += Math.sin(time + i) * 0.0008; // Subtle drift
        positions[i3 + 2] += Math.cos(time + i) * 0.0008;
      }

      // Reset particles that fall too low or go too far
      if (positions[i3 + 1] < -2 || Math.abs(positions[i3]) > 5 || Math.abs(positions[i3 + 2]) > 5) {
        positions[i3] = (Math.random() - 0.5) * 3;
        positions[i3 + 1] = Math.random() * 0.5;
        positions[i3 + 2] = (Math.random() - 0.5) * 3;

        // Reset velocities
        if (velocitiesRef.current) {
          velocitiesRef.current[i3] = (Math.random() - 0.5) * 0.05;
          velocitiesRef.current[i3 + 1] = Math.random() * 0.02;
          velocitiesRef.current[i3 + 2] = (Math.random() - 0.5) * 0.05;
        }
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 3;
    positions[i * 3 + 1] = Math.random() * 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#8B4513"
        transparent
        opacity={shouldAnimate ? 0.9 : 0}
      />
    </points>
  );
}

// Model component with parallax
function Model({
  path,
  targetPos,
  targetScale,
  onHoverChange,
  onClick,
  isActive,
  isInitialLoad,
  mousePos,
}: {
  path: string;
  targetPos: [number, number, number];
  targetScale: number;
  onHoverChange?: (hovered: boolean) => void;
  onClick?: () => void;
  isActive?: boolean;
  isInitialLoad?: boolean;
  mousePos?: { x: number; y: number };
}) {
  const { scene } = useGLTF(path);
  const groupRef = useRef<any>();

  // Calculate parallax offset based on depth
  const parallaxMultiplier = isActive ? 0.3 : 0.1; // Active model has more parallax
  const parallaxOffset = mousePos ? {
    x: mousePos.x * parallaxMultiplier,
    y: mousePos.y * parallaxMultiplier * 0.5,
    z: mousePos.x * parallaxMultiplier * 0.2
  } : { x: 0, y: 0, z: 0 };

  const finalTargetPos: [number, number, number] = [
    targetPos[0] + parallaxOffset.x,
    targetPos[1] + parallaxOffset.y,
    targetPos[2] + parallaxOffset.z
  ];

  const { position, scale } = useSpring({
    position: isInitialLoad && isActive ? [finalTargetPos[0], finalTargetPos[1] + 8, finalTargetPos[2]] : finalTargetPos,
    scale: [targetScale, targetScale, targetScale],
    config: isInitialLoad && isActive ? { mass: 2, tension: 80, friction: 15 } : { mass: 1, tension: 170, friction: 20 },
  });

  const handleOver = useCallback(
    (e: any) => {
      e.stopPropagation();
      onHoverChange?.(true);
      document.body.style.cursor = 'pointer';
    },
    [onHoverChange]
  );

  const handleOut = useCallback(
    (e: any) => {
      e.stopPropagation();
      onHoverChange?.(false);
      document.body.style.cursor = 'default';
    },
    [onHoverChange]
  );

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      onClick?.();
    },
    [onClick]
  );

  return (
    <a.group
      ref={groupRef}
      position={position as any}
      scale={scale as any}
    >
      <Center
        top={false}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <primitive object={scene} />
      </Center>
    </a.group>
  );
}

// Premium glowing ring with parallax
function RingGlow({ radius, sx, sz, mousePos }: { radius: number; sx: number; sz: number; mousePos?: { x: number; y: number } }) {
  if (!radius) return null;

  // Subtle parallax effect for the ring
  const parallaxOffset = mousePos ? {
    x: mousePos.x * 0.05,
    z: mousePos.y * 0.05
  } : { x: 0, z: 0 };

  return (
    <group
      position={[parallaxOffset.x, -0.98, parallaxOffset.z]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[sx, 1, sz]}
    >
      {/* Inner bright yellow ring */}
      <mesh>
        <ringGeometry args={[radius * 0.985, radius * 1.0, 128]} />
        <meshBasicMaterial
          color={"#ffd700"}
          transparent
          opacity={0.9}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
      {/* Mid golden glow ring */}
      <mesh>
        <ringGeometry args={[radius * 1.0, radius * 1.08, 128]} />
        <meshBasicMaterial
          color={"#ffb347"}
          transparent
          opacity={0.6}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
      {/* Outer amber glow */}
      <mesh>
        <ringGeometry args={[radius * 1.08, radius * 1.15, 64]} />
        <meshBasicMaterial
          color={"#ffa500"}
          transparent
          opacity={0.3}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
      {/* Far outer warm glow */}
      <mesh>
        <ringGeometry args={[radius * 1.15, radius * 1.22, 32]} />
        <meshBasicMaterial
          color={"#ffeb3b"}
          transparent
          opacity={0.15}
          toneMapped={false}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Parallax camera controller
function ParallaxCameraController({ mousePos }: { mousePos: { x: number; y: number } }) {
  const { camera } = useThree();

  useFrame((state) => {
    // Parallax effect based on mouse position
    const targetX = mousePos.x * 2;
    const targetY = 2 + mousePos.y * 1;
    const targetZ = 6 + mousePos.x * 0.5;

    // Smooth camera movement
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    // Look at center with slight parallax offset
    const lookAtX = mousePos.x * 0.5;
    const lookAtY = mousePos.y * 0.3;
    camera.lookAt(lookAtX, lookAtY, 0);
  });

  return null;
}

export default function Scene3DClient({
  models,
  activeIndex,
  setIsHovered,
  handleModelClick,
  ACTIVE_SCALE,
  ring,
}: Props) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000); // Animation duration
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 45 }}
      shadows
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMappingExposure: 1.5,
        outputColorSpace: "srgb"
      }}
    >
      <ParallaxCameraController mousePos={mousePos} />

      {/* Hanging bulb - main lighting */}
      <HangingBulb />

      {/* Cinematic key light - main spotlight */}
      <spotLight
        position={[-2, 3, 7]}
        angle={Math.PI / 4}
        penumbra={1.5}
        intensity={70}
        color="#ffd4a3"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.1}
        shadow-camera-far={25}
        distance={12}
        decay={1.6}
      />

      {/* Cinematic rim light - creates silhouette */}
      <spotLight
        position={[3, 2, -2]}
        angle={Math.PI / 3}
        penumbra={2}
        intensity={40}
        color="#e6f3ff"
        castShadow={false}
        distance={8}
        decay={2.2}
      />

      {/* Atmospheric fill light */}
      <pointLight
        position={[-1, 4, 5]}
        intensity={25}
        color="#fff0e6"
        distance={7}
        decay={2.8}
      />

      {/* Bounce light simulation */}
      <pointLight
        position={[0, 0.5, 4]}
        intensity={18}
        color="#f5e6d3"
        distance={5}
        decay={3.5}
      />

      {/* Background separation light */}
      <pointLight
        position={[0, 1, -3]}
        intensity={12}
        color="#4a4a6a"
        distance={4}
        decay={4}
      />

      {/* Cinematic ambient - very low */}
      <ambientLight intensity={0.04} color="#1a1a2e" />

      {/* Soft directional for gentle fill */}
      <directionalLight
        position={[-3, 5, 4]}
        intensity={0.4}
        color="#ffeaa7"
      />

      {/* Atmospheric haze simulation */}
      <pointLight
        position={[0, 6, 0]}
        intensity={8}
        color="#ddd6fe"
        distance={15}
        decay={1.2}
      />

      {models.map((model, index) => {
        const isActive = index === activeIndex;
        const leftIndex = (activeIndex - 1 + models.length) % models.length;
        const rightIndex = (activeIndex + 1) % models.length;

        let pos: [number, number, number] = [0, -100, 0];
        let scale = 0.5;

        if (isActive) {
          pos = [0, 0.2, 0];
          scale = ACTIVE_SCALE;
        } else if (index === leftIndex) {
          pos = [-4, 0.02, -1];
          scale = 1.3;
        } else if (index === rightIndex) {
          pos = [4, 0.02, -1];
          scale = 1.3;
        }

        return (
          <Model
            key={model.id}
            path={model.path}
            targetPos={pos}
            targetScale={scale}
            onHoverChange={setIsHovered}
            onClick={() => handleModelClick(index)}
            isActive={isActive}
            isInitialLoad={isInitialLoad}
            mousePos={mousePos}
          />
        );
      })}

      <RingGlow radius={ring.radius} sx={ring.sx} sz={ring.sz} mousePos={mousePos} />

      {/* Coffee dust particles */}
      <CoffeeDust shouldAnimate={isInitialLoad} />

      {/* Premium dark reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={80}
          roughness={0.1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0f0f23"
          metalness={0.5}
        />
      </mesh>

      <OrbitControls
        enableZoom={true}
        minZoom={0.5}
        maxZoom={3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        target={[0, 0, 0]}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        enablePan={true}
      />

      <EffectComposer multisampling={8}>
        {/* Dramatic bloom for premium lighting */}
        <Bloom
          intensity={2}
          kernelSize={3}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.4}
          mipmapBlur
          radius={0.85}
        />

        {/* Chromatic aberration for premium edge effect */}
        <ChromaticAberration
          offset={[0.0005, 0.0012]}
        />

        {/* Subtle vignette for focus */}
        <Vignette
          offset={0.5}
          darkness={0.5}
        />
      </EffectComposer>
    </Canvas>
  );
}