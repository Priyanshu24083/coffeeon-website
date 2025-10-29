
"use client";

import "./globals.css";
import Navbar from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import LoadingScreen from "@/components/LoadingPage";
import MouseFollower from "@/components/MouseFollower";
import { LanguageProvider } from "@/components/LanguageProvider";
import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
  subsets: ["latin"],          // required
  weight: ["400", "500", "700"], // choose the weights you need
  variable: "--font-montserrat", // optional for Tailwind
});
 


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  return (
    <html lang="en">
      <body className={montserrat.className} suppressHydrationWarning={true}>
        <LanguageProvider>
          <PageTransition key={pathname}>
            <LoadingScreen />
            <MouseFollower />
            <Navbar />
            {children}
          </PageTransition>
        </LanguageProvider>
      </body>
    </html>
  );
}
