'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/LanguageProvider';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

const translations = {
  ENG: {
    title: "Terms of Service",
    lastUpdated: "Last updated: October 2025",
    acceptTitle: "1. Acceptance of Terms",
    acceptText: 'By accessing and using <span class="text-white font-medium">Your Company</span>\'s services, you accept and agree to be bound by the terms and provision of this agreement.',
    licenseTitle: "2. Use License",
    licenseText: "Permission is granted to temporarily download one copy of the materials on Your Company's website for personal, non-commercial transitory viewing only.",
    disclaimerTitle: "3. Disclaimer",
    disclaimerText: "The materials on Your Company's website are provided on an 'as is' basis. Your Company makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    limitationsTitle: "4. Limitations",
    limitationsText: "In no event shall Your Company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Your Company's website, even if Your Company or a Your Company authorized representative has been notified orally or in writing of the possibility of such damage.",
    accuracyTitle: "5. Accuracy of Materials",
    accuracyText: "The materials appearing on Your Company's website could include technical, typographical, or photographic errors. Your Company does not warrant that any of the materials on its website are accurate, complete, or current.",
    linksTitle: "6. Links",
    linksText: "Your Company has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Your Company of the site.",
    modificationsTitle: "7. Modifications",
    modificationsText: "Your Company may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.",
    governingTitle: "8. Governing Law",
    governingText: "These terms and conditions are governed by and construed in accordance with the laws of Your Company, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.",
    footer: "© {year} Your Company. All rights reserved.",
  },
  AR: {
    title: "شروط الخدمة",
    lastUpdated: "آخر تحديث: أكتوبر 2025",
    acceptTitle: "1. قبول الشروط",
    acceptText: 'بالوصول إلى خدمات <span class="text-white font-medium">شركتنا</span> واستخدامها، أنت توافق على الالتزام بشروط وأحكام هذه الاتفاقية.',
    licenseTitle: "2. ترخيص الاستخدام",
    licenseText: "يُمنح الإذن بتحميل نسخة واحدة مؤقتة من المواد على موقع شركتنا على الويب للعرض الشخصي غير التجاري فقط.",
    disclaimerTitle: "3. إخلاء المسؤولية",
    disclaimerText: "يتم توفير مواد موقع شركتنا على الويب على أساس 'كما هي'. لا تقدم شركتنا أي ضمانات، صريحة أو ضمنية، وتخلي مسؤوليتها عن جميع الضمانات الأخرى بما في ذلك على سبيل المثال لا الحصر، الضمانات الضمنية أو الشروط المتعلقة بالتجارة، اللياقة لغرض معين، أو عدم انتهاك حقوق الملكية الفكرية أو أي انتهاك آخر للحقوق.",
    limitationsTitle: "4. القيود",
    limitationsText: "في أي حال من الأحوال، لن تكون شركتنا أو مورديها مسؤولين عن أي أضرار (بما في ذلك على سبيل المثال لا الحصر، أضرار فقدان البيانات أو الربح، أو بسبب انقطاع الأعمال) الناشئة عن استخدام أو عدم القدرة على استخدام المواد على موقع شركتنا على الويب، حتى لو تم إخطار شركتنا أو ممثل مصرح به من شركتنا شفهياً أو كتابياً بإمكانية حدوث مثل هذا الضرر.",
    accuracyTitle: "5. دقة المواد",
    accuracyText: "قد تشمل المواد الموجودة على موقع شركتنا على الويب أخطاء فنية أو إملائية أو فوتوغرافية. لا تضمن شركتنا أن أي من المواد على موقعها دقيقة أو كاملة أو حديثة.",
    linksTitle: "6. الروابط",
    linksText: "لم تقم شركتنا بمراجعة جميع المواقع المرتبطة بموقعها على الويب وليست مسؤولة عن محتويات أي موقع مرتبط. لا يعني تضمين أي رابط تأييد شركتنا للموقع.",
    modificationsTitle: "7. التعديلات",
    modificationsText: "قد تقوم شركتنا بمراجعة شروط الخدمة هذه لموقعها على الويب في أي وقت دون إشعار. باستخدام هذا الموقع، أنت توافق على الالتزام بالنسخة الحالية من شروط الخدمة هذه.",
    governingTitle: "8. القانون المعمول به",
    governingText: "تخضع هذه الشروط والأحكام وتُفسر وفقاً لقوانين شركتنا، وأنت توافق بشكل لا رجعة فيه على الاختصاص الحصري للمحاكم في ذلك الولاية أو الموقع.",
    footer: "© {year} شركتنا. جميع الحقوق محفوظة.",
  },
};

const TermsOfService: React.FC = () => {
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
      className="min-h-screen bg-[#010101] text-gray-200 flex flex-col items-center px-6 py-16 overflow-x-hidden"
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
            {t.acceptTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`} dangerouslySetInnerHTML={{ __html: t.acceptText }} />
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.licenseTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.licenseText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.disclaimerTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.disclaimerText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.limitationsTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.limitationsText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.accuracyTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.accuracyText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.linksTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.linksText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>
            {t.modificationsTitle}
          </h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.modificationsText}
          </p>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold text-white mb-2 ${lang === "AR" ? "text-right" : ""}`}>{t.governingTitle}</h2>
          <p className={`text-gray-400 ${lang === "AR" ? "text-right" : ""}`}>
            {t.governingText}
          </p>
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

export default TermsOfService;
