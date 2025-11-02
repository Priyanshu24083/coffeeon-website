"use client";

import dynamic from "next/dynamic";
import React from "react";
import Scroll from "@/components/Scroll";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

// ✅ Dynamically import all 3D / GSAP-heavy components to disable SSR
const Section1 = dynamic(() => import("@/components/Section1"), {
  ssr: false,
  loading: () => null,
});

const Cylinder = dynamic(() => import("@/components/Cylinder"), {
  ssr: false,
  loading: () => null,
});

const Section3 = dynamic(() => import("@/components/Section3"), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  const { lang } = useLanguage();

  return (
    <div dir={lang === "AR" ? "rtl" : "ltr"}>
      {/* Hero section — 3D intro animation */}
      <Section1 />

      {/* Cylinder animation (client-only 3D) */}
      <Cylinder />

      {/* Scroll-based product showcase */}
      <Scroll />

      {/* 3D rotating text / tagline */}
      <Section3 key={lang} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
