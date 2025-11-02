// app/page.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";
import Scroll from "@/components/Scroll";
import Section3 from "@/components/Section3";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";

// Dynamically import 3D / heavy components to disable SSR
const CanvasWithPanels = dynamic(() => import("@/components/Section1"), {
  ssr: false,
  loading: () => null,
});

const CylindricalTextCanvas = dynamic(() => import("@/components/Cylinder"), {
  ssr: false,
  loading: () => null,
});

export default function Page() {
  const { lang } = useLanguage();

  return (
    <div dir={lang === "AR" ? "rtl" : "ltr"}>
      <CanvasWithPanels />
      <CylindricalTextCanvas />
      <Section3 key={lang} />
      <Footer />
    </div>
  );
}
