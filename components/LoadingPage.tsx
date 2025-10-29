"use client";
import { useEffect, useMemo, useState } from "react";


export default function LoadingScreen() {
  // Timing
  const loadingDuration = 3.0; // seconds for opacity animation

  // States
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const alreadyShown = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try { return window.sessionStorage.getItem('coffeeon.loadingShown') === '1'; } catch { return false; }
  }, []);

  // ViewBox geometry
  const VBX = 100;
  const VBY = 50;
  const VBW = 700;
  const VBH = 650;

  // Cup path
  const cupPathD = `M270.515076,599.549683 
  C225.092834,569.625122 191.181046,530.198425 168.728928,481.107574 
  C156.049576,453.384644 148.261475,424.255371 145.567474,393.782623 
  C141.306458,345.585052 148.096359,299.174591 167.919846,254.934357 
  C188.763931,208.416443 220.128586,170.424301 261.774292,140.989517 
  C295.208466,117.358612 332.273834,102.392792 372.419006,94.787941 
  C376.564636,94.002632 378.618408,95.047638 379.885345,99.432213 
  C386.212646,121.328941 390.068604,143.563965 388.219513,166.365189 
  C384.995026,206.125977 369.171753,239.539597 338.001984,265.421478 
  C310.297791,288.425690 293.804871,317.878540 290.285309,354.064697 
  C286.141571,396.668365 300.135101,432.818451 330.559967,462.352875 
  C351.863739,483.033173 377.730804,494.584717 407.504395,497.901550 
  C471.667603,505.049500 532.246643,462.287231 547.728455,401.450714 
  C561.732239,346.421906 545.357483,300.689209 502.434753,264.293335 
  C481.972473,246.942581 468.038788,225.475449 460.111267,200.146652 
  C449.401337,165.927994 452.276642,131.879166 462.620972,98.057304 
  C463.935028,93.760818 466.733856,94.366394 469.652313,94.915009 
  C489.331177,98.614365 508.596924,103.830399 526.991943,111.810989 
  C606.325073,146.229279 659.462341,204.610489 685.893555,286.930511 
  C693.700928,311.246643 696.995422,336.384521 697.521667,362.041656 
  C698.547363,412.050507 686.779968,458.678131 662.527222,502.226227 
  C645.398315,532.982788 623.020142,559.410583 595.743225,581.700134 
  C562.954773,608.493530 525.979065,626.894653 484.794342,636.564514 
  C454.949615,643.571838 424.756256,645.617798 394.105591,642.594482 
  C349.482971,638.192993 308.533051,623.756165 270.515076,599.549683 
  z`;

  // Animate opacity with progress
  useEffect(() => {
    if (alreadyShown) {
      setDone(true);
      return;
    }
    let start: number | null = null;
    let raf = 0;

    const animate = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / (loadingDuration * 1000));
      const p = Math.round(t * 100);
      setProgress(p);
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        // trigger fade out first, then unmount after fade duration
        const FADE_MS = 700;
        setFadeOut(true);
        try { window.sessionStorage.setItem('coffeeon.loadingShown', '1'); } catch {}
        setTimeout(() => setDone(true), FADE_MS + 50);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [loadingDuration, alreadyShown]);

  // Early return
  if (done) return null;

  const cupOpacity = progress / 100;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black loading-overlay ${fadeOut ? 'hidden' : ''}`}>
      <div className="flex flex-col items-center justify-center gap-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`${VBX} ${VBY} ${VBW} ${VBH}`}
          width="300"
          height="300"
          style={{ opacity: cupOpacity }}
        >
          {/* Filled white cup outline */}
          <path
            d={cupPathD}
            fill="white"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className={`text-white text-4xl font-semibold `}>
          {progress}%
        </div>
      </div>
    </div>
  );
}
