"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ENG" | "AR";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "coffeeon.lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ENG");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "ENG" || stored === "AR") {
        setLangState(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
    try {
      const html = document.documentElement;
      html.setAttribute("lang", lang === "AR" ? "ar" : "en");
      html.setAttribute("dir", lang === "AR" ? "rtl" : "ltr");
    } catch {}
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(() => {
    setLangState((p) => (p === "ENG" ? "AR" : "ENG"));
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, toggleLang }), [lang, setLang, toggleLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}


