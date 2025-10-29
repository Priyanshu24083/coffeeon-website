'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useEffect, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useLanguage } from '@/components/LanguageProvider';

export type CylindricalTextCanvasProps = {
  text?: string;
  textAR?: string;
  centerImage?: string;
  radius?: number;
  height?: number;
  speed?: number;
  background?: string;
  bandFraction?: number;
  imageScale?: number;
  imageInset?: number;
};

function Inner({
  text,
  textAR,
  centerImage,
  radius: baseRadius,
  height: baseHeight,
  speed,
  bandFraction,
  imageScale: baseImageScale,
  imageInset,
}: Required<
  Pick<
    CylindricalTextCanvasProps,
    | 'text'
    | 'textAR'
    | 'centerImage'
    | 'radius'
    | 'height'
    | 'speed'
    | 'imageScale'
    | 'imageInset'
  >
> &
  Pick<CylindricalTextCanvasProps, 'bandFraction'>) {
  const groupRef = useRef<THREE.Group>(null);
  const { gl, size, camera } = useThree();
  const { lang } = useLanguage();

  // Device/media queries + desktop flag
  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1200;
  const isDesktop = size.width >= 1200;
  const isPortrait = size.height > size.width;
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  const isHighDPI = devicePixelRatio > 1.5;

  // Responsive parameters - updated to show complete text ring
  const { radius, height, imageScale, cameraDistance, groupPosition } = useMemo(() => {
    let r = baseRadius,
      h = baseHeight,
      img = baseImageScale,
      dist = 8,
      y = -0.5;

    if (isMobile) {
      if (isPortrait) {
        // Keep cylinder larger, pull camera back more
        r = baseRadius * 0.35;  // Increased from 0.52
        h = baseHeight * 0.85;  // Increased from 0.68
        img = baseImageScale * 0.72;
        dist = 9.5;  // Increased from 5.2
        y = -0.12;
      } else {
        r = baseRadius * 0.4;   // Increased from 0.62
        h = baseHeight * 0.9;   // Increased from 0.72
        img = baseImageScale * 0.82;
        dist = 10;   // Increased from 6.1
        y = -0.18;
      }
    } else if (isTablet) {
      r = baseRadius * 0.75;   // Increased from 0.75
      h = baseHeight * 0.95;   // Increased from 0.83
      img = baseImageScale * 0.88;
      dist = 9.5;  // Increased from 7
      y = -0.25;
    } else if (isDesktop) {
      r = baseRadius * 1;
      h = baseHeight * 1;
      img = baseImageScale * 1;
      dist = 8.5;
      y = -0.5;
    }
    
    // Clamp values to prevent out-of-bounds
    r = THREE.MathUtils.clamp(r, 2.4, 7);
    h = THREE.MathUtils.clamp(h, 2.5, 12);
    img = THREE.MathUtils.clamp(img, 0.35, 1.3);

    return {
      radius: r,
      height: h,
      imageScale: img,
      cameraDistance: dist,
      groupPosition: [0, y, 0] as [number, number, number],
    };
  }, [isMobile, isTablet, isDesktop, isPortrait, baseRadius, baseHeight, baseImageScale]);

  // Camera FOV and position - updated FOV values
  useEffect(() => {
    if (camera) {
      camera.position.setZ(cameraDistance);
      // Only set fov for PerspectiveCamera
      if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        const cam = camera as THREE.PerspectiveCamera;
        if (isMobile && isPortrait) {
          cam.fov = 65;  // Increased from 52
        } else if (isMobile) {
          cam.fov = 60;  // Increased from 47
        } else if (isTablet) {
          cam.fov = 55;  // Increased from 44
        } else {
          cam.fov = 42;
        }
        cam.updateProjectionMatrix();
      }
    }
  }, [camera, cameraDistance, isMobile, isTablet, isDesktop, isPortrait]);

  const isAR = lang === 'AR';
  const ringText =
    isAR
      ? (textAR?.trim() || '• قهوة تتحرك معك، تناسب روتينك، وتشعرك بأنها صُنعت خصيصًا لك •')
      : (text?.trim() || "• Coffee that moves with you, fits your routine, and feels like it's made just for you •");

  const speedPerLang = Math.abs(speed) * (isMobile ? 0.8 : 1);

  // Texture generation with lower resolution for mobile
  const textTexture = useMemo(() => {
    const canvasWidth = isMobile ? (isHighDPI ? 3072 : 2048) : (isTablet ? 3072 : 4096);
    const canvasHeight = isMobile ? (isHighDPI ? 384 : 256) : (isTablet ? 384 : 512);
    const marginX = Math.floor(canvasWidth * 0.08);
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    let baseFontSize: number;
    if (isMobile) {
      baseFontSize = isPortrait ? 120 : 140;
    } else if (isTablet) {
      baseFontSize = 160;
    } else {
      baseFontSize = 180;
    }

    const fontStackAR = `"Tajawal","Cairo","Noto Kufi Arabic","Amiri","Arial",sans-serif`;
    const fontStackEN = `Montserrat, sans-serif`;
    const fontStack = isAR ? fontStackAR : fontStackEN;

    (ctx as any).direction = isAR ? 'rtl' : 'ltr';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    let fontSize = baseFontSize;
    ctx.font = `italic 900 ${fontSize}px ${fontStack}`;
    const chunk = ringText && ringText.length ? ringText : (isAR ? 'نص' : 'TEXT');
    const y = canvasHeight / 2;

    let textWidth = ctx.measureText(chunk).width;
    const maxWidth = canvasWidth - marginX * 2;
    if (textWidth > 0) {
      const scale = Math.min(1, maxWidth / textWidth);
      fontSize = Math.max(isMobile ? 32 : 24, Math.floor(fontSize * scale));
      ctx.font = `italic 900 ${fontSize}px ${fontStack}`;
      textWidth = ctx.measureText(chunk).width;
    }

    const centerX = Math.floor(canvasWidth / 2);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = isMobile ? 4 : 8;
    ctx.shadowOffsetX = isMobile ? 1 : 2;
    ctx.shadowOffsetY = isMobile ? 1 : 2;

    if (isMobile) {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeText(chunk, centerX, y);
    }
    ctx.fillText(chunk, centerX, y);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    if (typeof bandFraction === 'number' && bandFraction > 0 && bandFraction <= 1) {
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.y = bandFraction;
      tex.offset.y = (1 - bandFraction) / 2;
    }
    tex.generateMipmaps = !isMobile;
    tex.minFilter = isMobile ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), isMobile ? 4 : 16);
    tex.needsUpdate = true;
    return tex;
  }, [ringText, bandFraction, gl.capabilities, isAR, isMobile, isTablet, isPortrait, isHighDPI]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y -= delta * speedPerLang;
  });

  const imgTex = useTexture(centerImage);
  imgTex.colorSpace = THREE.SRGBColorSpace;
  useEffect(() => {
    if ((imgTex as any).image) imgTex.needsUpdate = true;
  }, [imgTex, (imgTex as any).image]);

  // Aspect ratio for image plane
  const aspect = useMemo(() => {
    const img = imgTex.image as HTMLImageElement | { width: number; height: number } | undefined;
    return img && (img as any).width && (img as any).height
      ? ((img as any).width as number) / ((img as any).height as number)
      : 1.5;
  }, [(imgTex as any).image]);

  // Prevent image plane from ever overflowing the cylinder's bounds
  const { planeW, planeH } = useMemo(() => {
    const hCircleFit = (2 * radius) / Math.sqrt(1 + aspect * aspect);
    const marginY = isMobile || isTablet ? 0.13 : 0.25;
    const hHeightClamp = Math.max(0, height - marginY);
    const hMax = Math.min(hCircleFit, hHeightClamp);
    const inset = THREE.MathUtils.clamp(imageInset, 0.85, 1);
    const scaled = Math.max(0.17, imageScale);
    const hSize = Math.min(hMax * scaled, hMax) * inset;
    const wSize = hSize * aspect;
    return { planeW: wSize, planeH: hSize };
  }, [radius, height, aspect, imageScale, imageInset, isMobile, isTablet]);

  // Shader material for fade effect
  const fadeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: textTexture },
        fadeStrength: { value: isMobile ? 1.7 : 2.3 },
        opacity: { value: isMobile ? 0.95 : 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float fadeStrength;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          vec3 viewDir = normalize(vViewPosition);
          float facingRatio = dot(vNormal, viewDir);
          float fade = pow(max(0.0, facingRatio), fadeStrength);
          float edgeFade = smoothstep(0.0, 0.3, facingRatio);
          fade = mix(fade, edgeFade, 0.3);
          float alpha = texColor.a * fade * opacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(texColor.rgb, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true,
    });
  }, [textTexture, isMobile]);

  // Geometry smoothness
  const segments = useMemo(() => {
    if (isMobile) return isPortrait ? 64 : 96;
    if (isTablet) return 128;
    return 256;
  }, [isMobile, isTablet, isPortrait]);

  return (
    <>
      <group ref={groupRef} position={groupPosition}>
        <mesh renderOrder={0}>
          <cylinderGeometry args={[radius, radius, height, segments, 1, true]} />
          <meshBasicMaterial
            map={textTexture}
            side={THREE.DoubleSide}
            alphaTest={0.5}
            transparent={false}
            depthWrite={true}
            depthTest={true}
            colorWrite={false}
          />
        </mesh>
        <mesh renderOrder={1}>
          <cylinderGeometry args={[radius, radius, height, segments, 1, true]} />
          <primitive object={fadeMaterial} attach="material" />
        </mesh>
      </group>
      <mesh position={[0, isMobile ? 0.08 : 0, 0]} renderOrder={2}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={imgTex}
          transparent
          alphaTest={0.01}
          depthTest={true}
          depthWrite={false}
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

export default function CylindricalTextCanvas({
  text = "Coffee that moves with you, fits your routine, and feels like it's made just for you",
  textAR = 'قهوة تتحرك معك، تناسب روتينك، وتشعرك بأنها صُنعت خصيصًا لك',
  centerImage = '/icedCup.webp',
  radius = 4.2,
  height = 5,
  speed = 0.65,
  background = '#000000',
  bandFraction,
  imageScale = 1.1,
  imageInset = 0.98,
}: CylindricalTextCanvasProps) {
  return (
    <div className="h-dvh w-dvw min-w-[320px] min-h-[320px] max-w-full max-h-screen bg-black overflow-hidden">
      <Canvas
        dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
        camera={{ fov: 45, position: [0, 0, 8] }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
      >
        <color attach="background" args={[background]} />
        <Suspense fallback={null}>
          <Inner
            text={text}
            textAR={textAR}
            centerImage={centerImage}
            radius={radius}
            height={height}
            speed={speed}
            bandFraction={bandFraction}
            imageScale={imageScale}
            imageInset={imageInset}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
