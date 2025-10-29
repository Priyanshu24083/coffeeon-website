"use client";

import Image from "next/image";
import gsap from "gsap";
import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import FlipLink from "./FlipLink";
import { useLanguage } from "@/components/LanguageProvider";

gsap.registerPlugin(useGSAP);

export default function Footer() {
  const scope = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  useGSAP(
    () => {
      gsap.fromTo(
        ".coffeeon-glow",
        { opacity: 0.35, scale: 0.95 },
        {
          opacity: 0.6,
          scale: 1.05,
          repeat: -1,
          yoyo: true,
          duration: 2.2,
          ease: "power1.inOut",
        }
      );
    },
    { scope }
  );

  const t = useMemo(() => {
    if (lang === "AR") {
      return {
        headlineStart: "عالم ألطف مع ",
        headlineHighlight: "حياة أخلاقية.",
        indexTitle: "الفهرس",
        socialTitle: "منصات",
        infoTitle: "معلومات",
        indexLinks: [
          { label: "الرئيسية", href: "/" },
          { label: "المدونة", href: "/blog" },
          { label: "اتصل بنا", href: "/contact" },
          { label: "الشراكة", href: "/partner" },
        ],
        socialLinks: ["إنستغرام", "فيسبوك", "لينكدإن"],
        privacy: "سياسة الخصوصية",
        terms: "شروط الخدمة",
        siteBy: "الموقع بواسطة CoffeeOn",
      } as const;
    }
    return {
      headlineStart: "Kinder world with ",
      headlineHighlight: "Ethical Life.",
      indexTitle: "Index",
      socialTitle: "Social",
      infoTitle: "Info",
      indexLinks: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
        { label: "Partner", href: "/partner" },
        { label: "FAQ", href: "/faq" },
      ],
      socialLinks: ["Instagram", "Facebook", "Linkedin"],
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      siteBy: "Site by CoffeeOn",
    } as const;
  }, [lang]);

  const infoEmail = "hello@coffeeon.com.sa";

  return (
    <footer
  ref={scope}
  className="relative overflow-hidden bg-[#010101] text-[#FFFFFF]"
  dir={lang === "AR" ? "rtl" : "ltr"}
>
  <div className="relative pt-12 sm:pt-20 pb-6 sm:pb-0">
    <div className="mx-auto max-w-[1400px] px-6">
      {/* Main layout */}
      <div className="flex flex-col lg:flex-row flex-wrap gap-10 items-start justify-between w-full">
        
        {/* Logo */}
        <div className="flex-shrink-0 mx-auto lg:mx-0">
          <Image
            src="/logo.png"
            alt="CoffeeOn Logo"
            width={200}
            height={67}
            className="h-[45px] w-auto"
            priority
          />
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left w-full max-w-xl mx-auto lg:mx-0">
          
          {/* Index */}
          <div>
            <div className="text-sm font-semibold text-slate-100 mb-3">{t.indexTitle}</div>
            <ul className="space-y-2">
              {t.indexLinks.map(({ label, href }) => (
                <li key={label}>
                  <FlipLink href={href} className="text-base sm:text-lg text-slate-300 hover:text-[#FFCF59]">
                    {label}
                  </FlipLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-sm font-semibold text-slate-100 mb-3">{t.socialTitle}</div>
            <ul className="space-y-2">
              {t.socialLinks.map((label) => (
                <li key={label}>
                  <FlipLink href="#" className="text-base sm:text-lg text-slate-300 hover:text-[#FFCF59]">
                    {label}
                  </FlipLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <div className="text-sm font-semibold text-slate-100 mb-3">{t.infoTitle}</div>
            <ul className="space-y-2">
              <li>
                <FlipLink
                  href={`mailto:${infoEmail}`}
                  className="text-base sm:text-lg text-slate-300 break-words hover:text-[#FFCF59]"
                >
                  {infoEmail}
                </FlipLink>
              </li>
            </ul>
          </div>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 items-center justify-center w-full lg:w-auto">
          <button
            className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFCF59] focus:ring-offset-2 focus:ring-offset-[#010101] rounded-lg"
            onClick={() => window.open('https://apps.apple.com/app/coffeeon', '_blank')}
            aria-label="Download CoffeeOn app on the App Store"
          >
            <picture>
              <source srcSet="/appstore.webp" type="image/webp" />
              <Image
                src="/appstore.png"
                alt="Download on the App Store"
                width={140}
                height={42}
                className="h-[60px] sm:h-[70px] w-auto"
              />
            </picture>
          </button>

          <button
            className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FFCF59] focus:ring-offset-2 focus:ring-offset-[#010101] rounded-lg"
            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.coffeeon', '_blank')}
            aria-label="Get CoffeeOn app on Google Play"
          >
            <picture>
              <source srcSet="/playstore.webp" type="image/webp" />
              <Image
                src="/playstore.png"
                alt="Get it on Google Play"
                width={140}
                height={42}
                className="h-[60px] sm:h-[70px] w-auto"
              />
            </picture>
          </button>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-slate-200/20 mt-12 sm:mt-20">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between max-w-6xl px-6 py-6 text-sm text-slate-500 gap-4 text-center md:text-left">
        <div>© {new Date().getFullYear()} CoffeeOn</div>
        <div className="flex flex-wrap justify-center gap-6">
          <FlipLink href="/privacy">{t.privacy}</FlipLink>
          <FlipLink href="/terms">{t.terms}</FlipLink>
        </div>
        <div>{t.siteBy}</div>
      </div>
    </div>
  </div>
</footer>

  );
}