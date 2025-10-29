// app/page.tsx
//Deploy
"use client";

import React from "react";
import CanvasWithPanels from "@/components/Section1";
import Scroll from "@/components/Scroll";
import Section3 from "@/components/Section3";
import Footer from "@/components/Footer";
import Section2 from "@/components/Scroll";
import { useLanguage } from "@/components/LanguageProvider";
import CylinderText from "@/components/Cylinder";
import CylinderTextScene from "@/components/Cylinder";
import CoffeeCylinderText from "@/components/Cylinder";
import CylindricalTextCanvas from "@/components/Cylinder";

export default function Page() {
  const { lang } = useLanguage();
  return (
  <>
  <div dir={lang === "AR" ? "rtl" : "ltr"}>
    <CanvasWithPanels/>
    <CylindricalTextCanvas/>
  <Section3 key={lang}/>
  <Footer/>
  </div>
  </>
  );
}
