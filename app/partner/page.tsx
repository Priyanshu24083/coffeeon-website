'use client';

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageProvider';

gsap.registerPlugin(ScrollTrigger);

type CardFeature = { bold: string; desc: string };
type CardInfo = { title: string; desc: string };
type ContentType = {
  heroLead: string;
  partnerCTA: string;
  callButtonText: string;
  title: string;
  para: string;
  yellowTitle: string;
  yellowP1: string;
  yellowP2: string;
  darkTitle: string;
  darkFeatures: CardFeature[];
  bottomTitle: string;
  bottomCards: CardInfo[];
  ctaTitle: string;
  ctaDescription: string;
  smarterTitle: string;
  smarterMain: string;
  smarterPartner: string;
  smarterButton: string;
};

export default function PartnersPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const partnerWordsRef = useRef<HTMLDivElement | null>(null);
  const smarterRef = useRef<HTMLDivElement | null>(null);

  const { lang } = useLanguage();

  // ENGLISH (ORIGINAL)
  const t: { EN: ContentType; AR: ContentType } = {
    EN: {
      heroLead: 'Offer <span class="font-bold text-[#FFD84D]">24/7 premium coffee</span> in your space. No queues. No extra staff. No limits.',
      partnerCTA: "Let's partner and share revenue",
      callButtonText: 'Call if you need a "coffee on the go" solution at your location',
      title: '<span class="font-extrabold">Partner With Us</span>',
      para: '<span>Coffee is a <span class="text-[#ffd84d] font-bold italic">daily ritual</span> that defines the workplace and guest experience. <span class="font-bold text-[#ffd84d]">CoffeeOn</span> lets you take <span class="font-bold text-[#ffd84d]">control of that moment</span>, creating a consistent, memorable, and <span class="font-bold italic">premium coffee culture</span> in your business environment.</span>',
      yellowTitle: '<span class="font-extrabold italic">Premium Coffee, Zero Complexity</span>',
      yellowP1: 'Turn coffee into a <span class="font-bold italic">premium amenity</span> without the overhead of baristas or complex operations.',
      yellowP2: 'From offices to hotels to gyms, CoffeeOn fits seamlessly into any environment and elevates <span class="font-bold italic ">every space with café-quality coffee</span> that adapts to your brand.',
      darkTitle: '<span class="font-extrabold italic">Why Businesses Choose CoffeeOn</span>',
      darkFeatures: [
        { bold: 'Zero-wait convenience', desc: 'App pre-order or instant smart vending' },
        { bold: '24/7 availability', desc: 'Perfect for spaces that never stop' },
        { bold: 'Fast, clean, reliable', desc: 'Consistent quality every time' },
        { bold: 'Personalized profiles', desc: 'One-tap reorders and loyalty via app' },
        { bold: 'AI-powered preferences', desc: 'Flavors evolve with every user' },
        { bold: 'Smart efficiency', desc: 'Optimized ingredients and cost margins' },
        { bold: 'Flexible payment models', desc: 'Subscription or wallet options' }
      ],
      bottomTitle: '<span class="font-extrabold italic">Built for Everyone in Your Space</span>',
      bottomCards: [
        {
          title: '<span class="font-bold">For Employees</span>',
          desc: 'A consistent, premium perk that boosts <span class="font-bold">morale and productivity</span>.'
        },
        {
          title: '<span class="font-bold">For Guests</span>',
          desc: 'A seamless amenity that elevates <span class="font-bold">hospitality, retail, and fitness experiences</span>.'
        },
        {
          title: '<span class="font-bold">For Operators</span>',
          desc: '<span class="font-bold">Café-level quality</span> without baristas, long waits, or added complexity.'
        }
      ],
      ctaTitle: 'The Smarter Coffee Experience',
      ctaDescription: 'Coffee is a <span class="font-bold italic text-[#FFD84D]">daily ritual</span> that defines the workplace and guest experience. <span class="font-bold text-[#FFD84D]">CoffeeOn</span> lets you take <span class="font-bold text-[#FFD84D]">control of that moment</span>, creating a consistent, memorable, and <span class="font-bold italic text-[#FFD84D]">premium coffee culture</span> in your business environment.',
      smarterTitle: '<span class="font-extrabold italic">The Smarter Coffee Experience</span>',
      smarterMain: 'Offer <span class="font-bold italic">24/7 premium coffee</span> in your space. No queues. No extra staff. No limits.',
      smarterPartner: "Let’s partner and share revenue",
      smarterButton: 'Call if you need a “coffee on the go” solution at your location'
    },
    AR: {
      heroLead: 'قدّم <span class="font-bold text-[#FFD84D]">قهوة فاخرة طوال اليوم</span> في مكانك. بدون انتظار. بدون موظفين إضافيين. بدون حدود.', // From spreadsheet
      partnerCTA: 'فلنتشارك في الشراكة وتقاسم الإيرادات', // Spreadsheet
      callButtonText: 'اتصل إذا كنت بحاجة لحل "قهوة أثناء التنقل" في موقعك', // Spreadsheet
      title: '<span class="font-extrabold">كن شريكًا معنا</span>', // Spreadsheet
      para: '<span>القهوة هي <span class="text-[#ffd84d] font-bold italic">طقس يومي</span> يحدد مكان العمل وتجربة الضيوف. <span class="font-bold text-[#ffd84d]">قهوة أون</span> تتيح لك <span class="font-bold text-[#ffd84d]">التحكم في هذه اللحظة</span>، لتخلق ثقافة قهوة مميزة وراقية لا تُنسى في بيئة عملك.</span>', // Spreadsheet
      yellowTitle: '<span class="font-extrabold italic">قهوة فاخرة، بلا تعقيد</span>', // Spreadsheet
      yellowP1: 'حول القهوة إلى <span class="font-bold italic">ميزة فاخرة</span> دون الحاجة إلى باريستا أو عمليات معقدة.', // Spreadsheet
      yellowP2: 'من المكاتب إلى الفنادق وصالات الألعاب الرياضية، قهوة أون تتناسب بسلاسة مع أي بيئة وتُرفع الجودة في <span class="font-bold italic ">كل مكان مع قهوة بمستوى المقاهي</span> تتكيف مع علامتك التجارية.', // Spreadsheet
      darkTitle: '<span class="font-extrabold italic">لماذا تختار الشركات قهوة أون</span>', // Spreadsheet
      darkFeatures: [
        { bold: 'راحة بدون انتظار', desc: 'طلب مسبق عبر التطبيق أو البيع الذكي الفوري' }, // Spreadsheet
        { bold: 'توافر على مدار الساعة', desc: 'مثالي للأماكن التي لا تغلق' }, // Spreadsheet
        { bold: 'سرعة ونظافة وموثوقية', desc: 'جودة ثابتة في كل مرة' }, // Spreadsheet
        { bold: 'ملفات شخصية مخصصة', desc: 'إعادة الطلب بضغطة واحدة وبرامج ولاء عبر التطبيق' }, // Spreadsheet
        { bold: 'تفضيلات مدعومة بالذكاء الاصطناعي', desc: 'النَكهات تتطور مع كل مستخدم' }, // Spreadsheet
        { bold: 'كفاءة ذكية', desc: 'مكونات محسّنة وهوامش تكلفة' }, // Spreadsheet
        { bold: 'نماذج دفع مرنة', desc: 'اشتراك أو خيارات محفظة إلكترونية' } // Spreadsheet
      ],
      bottomTitle: '<span class="font-extrabold italic">مصممة للجميع في مكانك</span>', // Spreadsheet
      bottomCards: [
        {
          title: '<span class="font-bold">للموظفين</span>',
          desc: 'ميزة فاخرة ثابتة تعزز <span class="font-bold">المعنويات والإنتاجية</span>.' // Spreadsheet
        },
        {
          title: '<span class="font-bold">للضيوف</span>',
          desc: 'ميزة سلسة ترفع تجربة <span class="font-bold">الضيافة والتجزئة واللياقة البدنية</span>.' // Spreadsheet
        },
        {
          title: '<span class="font-bold">للمشغلين</span>',
          desc: '<span class="font-bold">جودة بمستوى المقاهي</span> بدون باريستا أو انتظار طويل أو تعقيد إضافي.' // Spreadsheet
        }
      ],
      ctaTitle: 'تجربة القهوة الذكية', // Spreadsheet
      ctaDescription: 'القهوة هي <span class="font-bold italic text-[#FFD84D]">طقس يومي</span> يحدد مكان العمل وتجربة الضيوف. <span class="font-bold text-[#FFD84D]">قهوة أون</span> تتيح لك <span class="font-bold text-[#FFD84D]">التحكم في هذه اللحظة</span>، لتخلق ثقافة قهوة مميزة وراقية لا تُنسى في بيئة عملك.', // Spreadsheet
      smarterTitle: '<span class="font-extrabold italic">تجربة القهوة الذكية</span>', // Spreadsheet
      smarterMain: 'قدّم <span class="font-bold italic">قهوة فاخرة طوال اليوم</span> في مكانك. بدون انتظار، بدون موظفين إضافيين، بدون حدود.', // Spreadsheet
      smarterPartner: "فلنتشارك في الشراكة وتقاسم الإيرادات", // Spreadsheet
      smarterButton: 'اتصل إذا كنت بحاجة لحل "قهوة أثناء التنقل" في موقعك' // Spreadsheet
    }
  };

   const S = lang === 'AR' ? t.AR : t.EN;

  // Stage and layered cards
  const stageRef = useRef<HTMLDivElement | null>(null);
  const yellowRef = useRef<HTMLDivElement | null>(null);
  const darkLayerRef = useRef<HTMLDivElement | null>(null);
  const darkCardRef = useRef<HTMLDivElement | null>(null);
  const bottomLayerRef = useRef<HTMLDivElement | null>(null);

  // New image div refs
  const image1Ref = useRef<HTMLDivElement | null>(null);
  const image2Ref = useRef<HTMLDivElement | null>(null);
  const image3Ref = useRef<HTMLDivElement | null>(null);

  const GAP_PX = 40;

  function renderWords(text: string) {
    return text.split(/\s+/).map((w, i) => (
      <span key={i} className="inline-block mx-1 opacity-0 text-[#FFD84D] font-extrabold">
        {w}
      </span>
    ));
  }

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    let splitTitle: any;
    let splitLines: any;
    let splitWordSets: any[] = [];
    let words: HTMLElement[] = [];
    let timeoutId: NodeJS.Timeout;
    let loadHandler: (() => void) | undefined;
    let heroTl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      const init = async () => {
        await new Promise((resolve) => {
          timeoutId = setTimeout(resolve, 50);
        });
        let SplitTextMod: any;
        try {
          SplitTextMod = await import('gsap/SplitText');
        } catch {}
        const SplitText = SplitTextMod?.SplitText || SplitTextMod?.default;

        gsap.set(stageRef.current, {
          height: '24vh',
          autoAlpha: 0,
          y: 60,
          scale: 0.96,
        });
        gsap.set(yellowRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(darkLayerRef.current, { xPercent: 100 });
        gsap.set(bottomLayerRef.current, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(smarterRef.current, { clipPath: 'inset(100% 0% 0% 0%)' });

        // Set initial clipPath for image divs (hidden from right)
        gsap.set(image1Ref.current, { clipPath: 'inset(0% 0% 0% 100%)' });
        gsap.set(image2Ref.current, { clipPath: 'inset(0% 0% 0% 100%)' });
        gsap.set(image3Ref.current, { clipPath: 'inset(0% 0% 0% 100%)' });

        gsap.set(titleRef.current, {
          transformOrigin: 'center center',
          autoAlpha: 1,
        });
        gsap.set(paraRef.current, { autoAlpha: 0 });
        gsap.set(darkCardRef.current, { autoAlpha: 1 });

        if (SplitText) {
          gsap.registerPlugin(SplitText);
          splitTitle = new SplitText(titleRef.current, {
            type: 'lines',
            linesClass: 'line++',
          });
          gsap.set(splitTitle.lines, { yPercent: 120 });

          const headingTL = gsap
            .timeline({ defaults: { ease: 'power2.out' } })
            .to(splitTitle.lines, { yPercent: 0, duration: 1, stagger: 0.08 });

          ScrollTrigger.create({
            trigger: titleRef.current,
            start: 'top 80%',
            animation: headingTL,
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          });

          splitLines = new SplitText(paraRef.current, {
            type: 'lines',
            linesClass: 'line++',
          });

          splitWordSets = splitLines.lines.map(
            (lineEl: HTMLElement) =>
              new SplitText(lineEl, { type: 'words', wordsClass: 'word++' }),
          );

          words = splitWordSets.flatMap((w: any) => w.words || []);
          gsap.set(words, {
            display: 'inline-block',
            yPercent: 120,
            autoAlpha: 0,
          });
        }

        // Pinned, scrubbed sequence
        const scrollTL = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=4200',
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          defaults: { ease: 'none' },
        });

        // 1) Heading scales up
        scrollTL.to(titleRef.current, {
          scale: 6,
          yPercent: -10,
          duration: 2,
          ease: 'power2.inOut',
        });

        // 1b) Fade heading out
        scrollTL.to(titleRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          ease: 'power1.out',
        });

        // 2) Paragraph in
        scrollTL.addLabel('showPara');
        scrollTL.set(paraRef.current, { autoAlpha: 1 }, '<-0.2');

        if (words.length) {
          scrollTL.to(
            words,
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: 'power2.out',
            },
            '<',
          );
        } else {
          scrollTL.fromTo(
            paraRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.8, ease: 'power2.out' },
            '<',
          );
        }

        // 3) Fade paragraph out
        scrollTL.to(paraRef.current, { autoAlpha: 0, duration: 0.6 }, '+=0.2');

        // 4) Stage in
        scrollTL.fromTo(
          stageRef.current,
          { autoAlpha: 0, y: 60, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
        );

        scrollTL.to(stageRef.current, { height: '80vh', duration: 2, ease: 'none' });

        // Reveal yellow card out, dark in
        scrollTL.addLabel('swap');
        scrollTL.to(
          yellowRef.current,
          { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.5, ease: 'none' },
          'swap',
        );
        scrollTL.to(
          image1Ref.current,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' },
          'swap',
        );
        scrollTL.to(
          darkLayerRef.current,
          { xPercent: 0, duration: 1.5, ease: 'none' },
          '+=0.5',
        );

        // Reveal bottom layer upward
        scrollTL.addLabel('swap2', '+=0.3');
        scrollTL.to(
          image2Ref.current,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' },
          'swap2',
        );
        scrollTL.to(
          bottomLayerRef.current,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'none' },
          '+=0.5',
        );

        // Reveal Smarter card last!
        scrollTL.addLabel('swapSmarter', '+=0.3');
        scrollTL.to(
          image3Ref.current,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' },
          'swapSmarter',
        );
        scrollTL.to(
          smarterRef.current,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'none' },
          '+=0.5',
        );

        ScrollTrigger.refresh();

        if ('fonts' in document) {
          (document as any).fonts.ready.finally(() => {
            setTimeout(() => ScrollTrigger.refresh(), 100);
          });
        }
        const loadListener = () => {
          setTimeout(() => ScrollTrigger.refresh(), 200);
        };
        loadHandler = loadListener;
        window.addEventListener('load', loadListener);
      };

      void init();

      try {
        const wordsEls = partnerWordsRef.current?.querySelectorAll('span') || [];
        gsap.set(wordsEls, { opacity: 0, y: 6 });

        heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        heroTl.to(wordsEls, { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 });

        ScrollTrigger.create({
          trigger: partnerWordsRef.current,
          start: 'top 80%',
          animation: heroTl,
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        });
      } catch (e) {}
    }, sectionRef);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (loadHandler) {
        window.removeEventListener('load', loadHandler);
      }
      ScrollTrigger.getAll().forEach((st) => {
        try {
          st.kill();
        } catch {}
      });
      try {
        ctx.revert();
      } catch {}
      try {
        heroTl?.scrollTrigger?.kill();
      } catch {}
      try {
        heroTl?.kill();
      } catch {}
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="min-h-screen relative bg-neutral-950 text-white overflow-x-hidden"
    >
      <section
        ref={sectionRef}
        className="relative h-screen w-full grid place-items-center p-4 sm:p-6 md:p-8 lg:p-12 overflow-visible"
      >
        {/* Title */}
        <h1
          ref={titleRef}
          className="text-[clamp(32px,8vw,120px)] leading-[1.05] text-center tracking-[-0.02em]"
          dangerouslySetInnerHTML={{ __html: S.title }}
        />
        {/* Centered paragraph overlay */}
       <p
  ref={paraRef}
  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] px-4 sm:px-6 text-center text-[clamp(14px,1.8vw,24px)] leading-relaxed sm:leading-[1.7] italic break-words"
  dangerouslySetInnerHTML={{ __html: S.para }}
/>

        {/* Stage - Card stack */}
        <div
          ref={stageRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-[5vh] w-full max-w-[80vw] opacity-0"
          style={{ height: '24vh' }}
        >
          <div className="relative h-full w-full rounded-[28px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
            {/* Yellow Card */}
             <div
              ref={yellowRef}
              className="absolute inset-0 z-10 bg-[#ffd84d] text-neutral-900 flex items-center rounded-[28px] p-6 sm:p-8 md:p-12 lg:p-16"
              style={{ willChange: 'clip-path' }}
            >
              <div className="w-full flex flex-col justify-center gap-6">
                <h2
                  className="text-[clamp(24px,4vw,64px)] font-bold italic leading-[95%] mb-6"
                  dangerouslySetInnerHTML={{ __html: S.yellowTitle }}
                />
                <p
                  className="text-[clamp(16px,2.5vw,40px)] font-medium leading-[160%] tracking-[-0.05em] mb-4"
                  dangerouslySetInnerHTML={{ __html: S.yellowP1 }}
                />
                <p
                  className="text-[clamp(16px,2.5vw,40px)] font-medium leading-[160%] tracking-[-0.05em]"
                  dangerouslySetInnerHTML={{ __html: S.yellowP2 }}
                />
              </div>
            </div>
            {/* Image div 1 between yellow and dark */}
            <div
              ref={image1Ref}
              className="absolute inset-0 z-15 rounded-[28px] overflow-hidden"
              style={{ willChange: 'clip-path', backgroundImage: 'url(/4.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
            </div>
            {/* Dark Features Grid (contains CTA) */}
           <div
  ref={darkLayerRef}
  className="absolute inset-0 z-20 bg-[#4A4A4A] text-white rounded-[28px] p-6 sm:p-8 md:p-12 lg:p-16 flex items-center justify-center"
  style={{ willChange: 'transform' }}
>
  <div ref={darkCardRef} className="w-full flex flex-col items-center">
    <h3
      className="text-[clamp(18px,2.5vw,40px)] font-bold italic leading-tight mb-10 text-center px-4 sm:px-8 md:px-12 break-words"
      dangerouslySetInnerHTML={{ __html: S.darkTitle }}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
      {S.darkFeatures.map((feature, i) => (
        <div
          key={i}
          className="flex flex-col items-center bg-black rounded-lg p-3 sm:p-4 md:p-6 text-center shadow-md border border-white/20 w-full max-w-xs mx-auto"
        >
          <div className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 text-white break-words">
            {feature.bold}
          </div>
          <div className="text-xs sm:text-sm md:text-base text-gray-300 leading-snug break-words">
            {feature.desc}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

            {/* Image div 2 between dark and bottom */}
            <div
              ref={image2Ref}
              className="absolute inset-0 z-25 rounded-[28px] overflow-hidden"
              style={{ willChange: 'clip-path', backgroundImage: 'url(/5.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
            </div>
            {/* Bottom Layer - Cards */}
           <div
  ref={bottomLayerRef}
  className="absolute inset-0 z-30 bg-[#ffd84d] text-neutral-900 rounded-[28px] p-6 sm:p-8 md:p-12 lg:p-16 flex items-center justify-center"
  style={{ willChange: 'clip-path' }}
>
  <div className="w-full flex flex-col items-center">
    <h2
      className="text-[clamp(20px,3vw,48px)] font-bold italic leading-tight mb-10 text-center px-4 sm:px-8 md:px-12 break-words"
      dangerouslySetInnerHTML={{ __html: S.bottomTitle }}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl px-4">
      {S.bottomCards.map((card, i) => (
        <div
          key={i}
          className="flex flex-col justify-center bg-white rounded-xl shadow-md px-5 sm:px-6 md:px-8 py-8 sm:py-10 text-center border border-neutral-200 hover:shadow-lg transition-shadow duration-200"
        >
          <h3
            className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 break-words"
            dangerouslySetInnerHTML={{ __html: card.title }}
          />
          <div
            className="text-sm sm:text-base md:text-lg text-neutral-700 leading-snug break-words"
            dangerouslySetInnerHTML={{ __html: card.desc }}
          />
        </div>
      ))}
    </div>
  </div>
</div>

            {/* Image div 3 between bottom and smarter */}
            <div
              ref={image3Ref}
              className="absolute inset-0 z-35 rounded-[28px] overflow-hidden"
              style={{ willChange: 'clip-path', backgroundImage: 'url(/6.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
            </div>
            {/* --- Smarter Experience Card (Final Layer, reference matches, FULL WIDTH FIX) --- */}
            <div
              ref={smarterRef}
              className="absolute inset-0 z-40 bg-[#4A4A4A] text-white flex items-center rounded-[28px] p-6 sm:p-8 md:p-12 lg:p-16"
              style={{ willChange: 'clip-path' }}
            >
              <div className="w-full flex flex-col justify-center gap-6">
                <h2
                  className="text-[clamp(24px,4vw,64px)] font-bold italic leading-[95%] mb-6"
                  dangerouslySetInnerHTML={{ __html: S.smarterTitle }}
                />
                <p
                  className="text-[clamp(16px,2.5vw,40px)] font-medium leading-[160%] tracking-[-0.05em] mb-4"
                  dangerouslySetInnerHTML={{ __html: S.smarterMain }}
                />
                <p className="text-[clamp(16px,2.5vw,40px)] font-medium leading-[160%] tracking-[-0.05em] mb-6">
                  {S.smarterPartner}
                </p>
                <button className="bg-neutral-900 text-white rounded-2xl px-8 py-5 font-bold text-lg w-full text-center transition hover:bg-neutral-700 shadow-md mt-2">
                  {S.smarterButton}
                </button>
              </div>
            </div>
            {/* --- END Smarter Experience Card --- */}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
