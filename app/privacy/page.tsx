'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/LanguageProvider';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

const translations = {
  ENG: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: October 2025",
    introTitle: "1. Introduction",
    introText: 'At <span class="text-white font-medium">Your Company</span>, we value your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our services.',
    collectTitle: "2. Information We Collect",
    collectList: [
      "Personal details like name and email address",
      "Usage data including browser type and device information",
      "Cookies and tracking technologies for analytics"
    ],
    useTitle: "3. How We Use Your Data",
    useText: "We use your information to improve our platform, personalize your experience, communicate updates, and ensure the best possible service delivery.",
    securityTitle: "4. Data Security",
    securityText: "We employ industry-standard measures to protect your data from unauthorized access, alteration, or destruction. However, no online system is 100% secure, and we cannot guarantee absolute safety.",
    rightsTitle: "5. Your Rights",
    rightsText: 'You have the right to access, update, or delete your personal information at any time. Contact us at <span class="text-amber-400 font-medium">privacy@yourcompany.com</span> for any concerns or requests.',
    changesTitle: "6. Changes to This Policy",
    changesText: "We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised date at the top.",
    contactTitle: "7. Contact",
    contactText: 'If you have questions or feedback about our privacy practices, please contact us at <span class="text-amber-400 font-medium">support@yourcompany.com</span>.',
    footer: "© {year} Your Company. All rights reserved.",
  },
  AR: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: أكتوبر 2025",
    introTitle: "1. مقدمة",
    introText: 'في <span class="text-white font-medium">شركتنا</span>، نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك عند استخدام خدماتنا.',
    collectTitle: "2. المعلومات التي نجمعها",
    collectList: [
      "تفاصيل شخصية مثل الاسم وعنوان البريد الإلكتروني",
      "بيانات الاستخدام بما في ذلك نوع المتصفح ومعلومات الجهاز",
      "ملفات تعريف الارتباط وتقنيات التتبع للتحليلات"
    ],
    useTitle: "3. كيف نستخدم بياناتك",
    useText: "نستخدم معلوماتك لتحسين منصتنا، تخصيص تجربتك، التواصل مع التحديثات، وضمان أفضل خدمة ممكنة.",
    securityTitle: "4. أمان البيانات",
    securityText: "نستخدم إجراءات قياسية في الصناعة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو التدمير. ومع ذلك، لا يوجد نظام عبر الإنترنت آمن 100%، ولا يمكننا ضمان السلامة المطلقة.",
    rightsTitle: "5. حقوقك",
    rightsText: 'لديك الحق في الوصول إلى تحديث أو حذف معلوماتك الشخصية في أي وقت. اتصل بنا على <span class="text-amber-400 font-medium">privacy@yourcompany.com</span> لأي مخاوف أو طلبات.',
    changesTitle: "6. التغييرات على هذه السياسة",
    changesText: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر التحديثات على هذه الصفحة مع تاريخ معدل في الأعلى.",
    contactTitle: "7. الاتصال",
    contactText: 'إذا كان لديك أسئلة أو تعليقات حول ممارسات الخصوصية لدينا، يرجى الاتصال بنا على <span class="text-amber-400 font-medium">support@yourcompany.com</span>.',
    footer: "© {year} شركتنا. جميع الحقوق محفوظة.",
  },
};

const PrivacyPolicy: React.FC = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Header fade-in
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }

    // Body fade-in as it scrolls into view
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
          },
        }
      );
    }
  }, []);

  return (
    <>
    <main
      className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-gray-200 flex flex-col items-center px-6 py-16 overflow-x-hidden"
      dir={lang === "AR" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div ref={headerRef} className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">
          {t.title}
        </h1>
        <p className="text-gray-400 mt-4 text-lg">{t.lastUpdated}</p>
      </div>

      {/* Body */}
      <div
        ref={contentRef}
        className="max-w-3xl mt-12 space-y-10 leading-relaxed text-[17px]"
      >
        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.introTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`} dangerouslySetInnerHTML={{ __html: t.introText }} />
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.collectTitle}
          </h2>
          <ul className={`list-disc ${lang === "AR" ? "pr-5" : "pl-5"} text-gray-400 space-y-1`}>
            {t.collectList.map((item, i) => (
              <li key={i} className={lang === "AR" ? "text-right" : ""}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.useTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.useText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.securityTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.securityText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.rightsTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`} dangerouslySetInnerHTML={{ __html: t.rightsText }} />
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.changesTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.changesText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>{t.contactTitle}</h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`} dangerouslySetInnerHTML={{ __html: t.contactText }} />
        </section>

        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          {t.footer.replace("{year}", new Date().getFullYear().toString())}
        </div>
      </div>
    </main>
    <Footer/>
    </>
  );
};

export default PrivacyPolicy;
