"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Navbar() {
  const { lang, toggleLang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname() || "/";

  // === LANGUAGE TRANSLATION ===
  const t = useMemo(() => {
    if (lang === "AR") {
      return {
        home: "الرئيسية",
        blog: "المدونة",
        contact: "اتصل بنا",
        partner: "الشراكة",
        toggleLabel: "تبديل اللغة",
        homeAria: "الانتقال إلى الرئيسية",
        menuLabel: "فتح/إغلاق القائمة",
      };
    }
    return {
      home: "Home",
      blog: "Blog",
      contact: "Contact",
      partner: "Partner",
      toggleLabel: "Toggle language",
      homeAria: "CoffeeOn home",
      menuLabel: "Toggle menu",
    };
  }, [lang]);

  // === ACTIVE LINK STYLING ===
  const isActive = (href: string) => {
    if (href === "/blog") return pathname.startsWith("/blog");
    return pathname === href;
  };

  const linkClass = (href: string) =>
    `rounded-full px-4 py-2 font-semibold transition-colors ${
      isActive(href) ? "text-[#FFCF59]" : "text-slate-200 hover:text-white"
    }`;

  // === HIDE NAV ON SCROLL DOWN ===
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollY.current && currentScroll > 80) {
        // scrolling down
        setVisible(false);
      } else {
        // scrolling up
        setVisible(true);
      }
      lastScrollY.current = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // === ESC / OUTSIDE CLICK CLOSE MENU ===
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.addEventListener("keydown", onKeyDown);
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current || menuRef.current.contains(target)) return;
      if (btnRef.current && btnRef.current.contains(target)) return;
      setMobileOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocClick);
    };
  }, [mobileOpen, onKeyDown]);

  const handleRouteClick = () => setMobileOpen(false);

  return (
    <nav
      className={`w-full sticky top-0 z-50 px-6 py-3 bg-[#010101] text-[#FFFFFF] shadow-sm transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      dir={lang === "AR" ? "rtl" : "ltr"}
      role="navigation"
      aria-label="Main"
    >
      {/* === DESKTOP NAV === */}
      <div
        className={`hidden lg:flex items-center justify-between ${
          lang === "AR" ? "flex-row-reverse" : ""
        }`}
      >
        {/* Nav Links */}
        <div
          className={`flex gap-6 ${
            lang === "AR" ? "order-2 justify-end" : "order-1 justify-start"
          }`}
        >
          <Link href="/" className={linkClass("/")} aria-current={isActive("/") ? "page" : undefined}>
            {t.home}
          </Link>
          <Link href="/partner" className={linkClass("/partner")} aria-current={isActive("/partner") ? "page" : undefined}>
            {t.partner}
          </Link>
          <Link href="/blog" className={linkClass("/blog")} aria-current={isActive("/blog") ? "page" : undefined}>
            {t.blog}
          </Link>
          <Link href="/contact" className={linkClass("/contact")} aria-current={isActive("/contact") ? "page" : undefined}>
            {t.contact}
          </Link>
        </div>

        {/* Language Toggle */}
        <div
          className={`flex items-center gap-4 ${
            lang === "AR" ? "order-1 justify-start" : "order-2 justify-end"
          }`}
        >
          <button
            onClick={toggleLang}
            className="px-4 py-2 rounded-full border border-gray-400 text-sm font-medium"
            aria-label={t.toggleLabel}
            type="button"
          >
            {lang}
          </button>
        </div>
      </div>

      {/* === MOBILE/TABLET NAV === */}
      <div
        className={`flex w-full items-center justify-between lg:hidden ${
          lang === "AR" ? "flex-row-reverse" : ""
        }`}
      >
        <button
          onClick={toggleLang}
          className="px-3 py-2 rounded-full border border-gray-400 text-sm font-medium"
          aria-label={t.toggleLabel}
          type="button"
        >
          {lang}
        </button>

        <button
          ref={btnRef}
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full p-2 outline-none ring-0 border border-white/15 hover:bg-white/5"
          aria-label={t.menuLabel}
          aria-controls="mobile-menu"
          aria-expanded={mobileOpen}
          aria-haspopup="menu"
        >
          {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* === CENTERED LOGO === */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <Link href="/" className="pointer-events-auto" aria-label={t.homeAria}>
          <Image
            src="/logo.png"
            alt="CoffeeOn Logo"
            width={200}
            height={150}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* === MOBILE/TABLET DROPDOWN === */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="menu"
        aria-label="Mobile"
        className={`lg:hidden absolute inset-x-0 top-full z-30 bg-black/95 border-t border-white/10 shadow-lg transition-all duration-200 ${
          mobileOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-2"
        } ${lang === "AR" ? "text-right" : "text-left"}`}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          <Link href="/" className={linkClass("/")} onClick={handleRouteClick}>
            {t.home}
          </Link>
          <Link href="/partner" className={linkClass("/partner")} onClick={handleRouteClick}>
            {t.partner}
          </Link>
          <Link href="/blog" className={linkClass("/blog")} onClick={handleRouteClick}>
            {t.blog}
          </Link>
          <Link href="/contact" className={linkClass("/contact")} onClick={handleRouteClick}>
            {t.contact}
          </Link>
        </div>
      </div>
    </nav>
  );
}
