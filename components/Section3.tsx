'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/components/LanguageProvider';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Section3() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const { lang } = useLanguage();

  // IntersectionObserver for controlling mount-on-view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || isInView) return;
    const obs = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin: '20% 0px', threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isInView]);

  const t = useMemo(() => {
    if (lang === 'AR') {
      return {
        dir: 'rtl' as const,
        p1h: 'من نحن',
        p1p1: 'كوفي أون ليست آلة بيع قهوة تقليدية.',
        p1p2: 'وليست مقهى أيضًا.',
        p1p3: 'إنها فئة جديدة كليًّا.',
        p1p4: 'إنها الباريستا الذكية الخاصة بك: قهوة بجودة المقاهي، مُعدَّة على مزاجك وهي متاحة على مدار الساعة وأينما كنت.',
        p1p5: 'حليب طازج.',
        p1p6: 'حبوب بن طازجة.',
        p1p7: 'خيارات مثلجة.',
        p1p8: 'تطبيقٌ ذكيٌ يحفظ كل خياراتك المفضلة.',
        p1p9Parts: {
          white: 'كوفي أون هي القهوة التي تتكيف مع حياتك',
          yellow: 'وليس العكس.',
        },
        p2h: 'ماذا نفعل',
        p2p1: 'ابتكرنا كوفي أون لحل مشكلة بسيطة:',
        p2p2: 'القهوة الرائعة غالبًا ما تكون بطيئة جدًا،',
        p2p3: 'غير متسقة، أو صعبة الوصول.',
        p2p4: 'منصتنا الذكية تقدم مشروبات بجودة المقاهي – بسرعة، قابلة للتخصيص، ومرتبطة بالتطبيق – متى وأينما احتجتها.',
        p2p5: 'لا طوابير.',
        p2p6: 'لا باريستا.',
        p2p7: 'بلا تنازلات.',
        p2p8Parts: {
          pre: 'من خلال تقديم تجارب قهوة ذكية ومرنة،',
          em: 'تصبح كوفي أون جزءًا من إيقاعك اليومي',
          post: '، سواء تشرب، تدير، أو تبني عملك حولها.',
        },
        p3h: 'لماذا نحن',
        p3subtitle: 'أسلوب حياة. ابتكار. وصول.',
        p3p1: 'راحة فورية',
        p3p2: 'قهوة رائعة ومخصصة بدون انتظار. متاحة على مدار الساعة، يتم التحكم بها عن طريق التطبيق، وقريبة دائمًا. تناسب حياتك، وليس العكس.',
        p3p3: 'تقنية ذكية، قهوة حقيقية',
        p3p4: 'نمزج التقنية الذكية مع المكونات الحقيقية: حليب طازج، طحن وتخمير من الحبوب إلى الكوب، وثلج، لجودة مستوى المقاهي ثابتة في كل مرة.',
        p3p5: 'مبنية للمستقبل',
        p3p6: 'كوفي أون ليست مجرد طريقة أفضل للحصول على قهوتك. إنها دلالة أنك متقدم على المنحنى. علامة تجارية عصرية ومتنقلة ومصنوعة للحاضر.',
        p3p7: 'اختمر بجرأة',
        p3p8: 'نقود بالأصالة. نتحدى المعايير، نكسر العادات القديمة، وننشئ طقوسًا جديدة في كل كوب.',
        p3p9: 'ابنِ بوعي',
        p3p10: 'نُدمج الاستدامة في كل طبقة من النظام، لأن القهوة الرائعة يجب ألا تكلف الكوكب.',
        p4h: 'ذكية، سلسة، ومبنية حولك.',
        p5: 'نبني عالمًا حيث تكون القهوة الذكية أثناء التنقل هي القاعدة وليس الاستثناء.',
        p6p1: 'نبني علامة تجارية تتحدى الواقع الراهن.',
        p6p2: 'علامة تجارية قائمة على التقنية والمذاق، لكنها مُصمَّمة لتناسب الثقافة والعادات وأسلوب الحياة.',
      } as const;
    }

    return {
      dir: 'ltr' as const,
      p1h: 'Who we are',
      p1p1: "CoffeeOn isn't a vending machine.",
      p1p2: "It isn't a café either.",
      p1p3: "It's a new category altogether.",
      p1p4: "It's your smart barista: café-quality coffee, made personal, available 24/7 wherever you are.",
      p1p5: 'Real milk.',
      p1p6: 'Fresh beans.',
      p1p7: 'Iced options.',
      p1p8: 'Fully customizable through an app that remembers your preferences.',
      p1p9Parts: {
        white: "This is coffee that fits into people's lives,",
        yellow: 'not the other way around.',
      },
      p2h: 'What we do',
      p2p1: 'We created CoffeeOn to solve a simple problem:',
      p2p2: 'great coffee is too often slow,',
      p2p3: 'inconsistent, or hard to access.',
      p2p4: 'Our smart barista platform delivers café-quality drinks—fast, customizable, and app-connected—whenever and wherever people need them',
      p2p5: 'No queues.',
      p2p6: 'No baristas.',
      p2p7: 'No compromise.',
      p2p8Parts: {
        pre: 'By delivering smart, flexible coffee experiences, ',
        em: 'CoffeeOn becomes part of your daily rhythm',
        post: ', whether you are drinking it, managing it, or building a business around it.',
      },
      p3h: 'Why Us',
      p3subtitle: 'Lifestyle. Innovation. Access',
      p3p1: 'INSTANT CONVENIENCE',
      p3p2: 'Premium, personalized coffee without the wait. Available 24/7, app-controlled, and always close. It fits into your life, not the other way around.',
      p3p3: 'SMART TECH, REAL COFFEE',
      p3p4: 'We pair intelligent tech with real ingredients: fresh milk, bean-to-cup brewing, and ice, for café-level quality that is consistently perfect every single time.',
      p3p5: "BUILT FOR WHAT'S NEXT",
      p3p6: "CoffeeOn isn't just a better way to get your coffee. It is a signal that you are ahead of the curve. A brand that feels modern, mobile, and made for now.",
      p3p7: 'BREW BOLD',
      p3p8: 'We lead with originality. We challenge norms, break old habits, and create new rituals in every cup.',
      p3p9: 'BUILD CONSCIOUSLY',
      p3p10: 'We embed sustainability into every layer of the system, because great coffee should never cost the planet.',
      p4h: 'Smart, seamless, and built around you.',
      p5: "We're building a world where smart on-the-go coffee is the standard, not the exception.",
      p6p1: "We're building a brand that challenges the status quo.",
      p6p2: "One that's rooted in tech and taste, but built for culture, habit, and lifestyle.",
    } as const;
  }, [lang]);

  useGSAP(
    () => {
      if (!isInView) return;
      const container = containerRef.current!;

      const getViewportHeight = () =>
        (window as any).visualViewport?.height ?? window.innerHeight;

      const build = () => {
        const panels = Array.from(container.querySelectorAll<HTMLElement>('.panel'));
        const lastPanel = panels[panels.length - 1];
        const scrollWrapper = lastPanel?.querySelector<HTMLElement>('.scroll-wrapper');
        const scrollContent = scrollWrapper?.querySelector<HTMLElement>('.scroll-content');

        gsap.set(container, { backgroundColor: '#010101' });
        gsap.set(panels, { autoAlpha: 0 });
        if (scrollContent) gsap.set(scrollContent, { y: 0 });

        const vh = getViewportHeight();
        const scrollDistance =
          scrollContent && scrollWrapper
            ? Math.max(0, scrollContent.scrollHeight - scrollWrapper.clientHeight)
            : 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'section3',
            trigger: container,
            start: 'clamp(top top)',
            end: () => `+=${(panels.length - 1) * vh + 300 + scrollDistance}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            pinType: ScrollTrigger.isTouch ? 'fixed' : 'transform',
          },
          defaults: { ease: 'none' },
        });

        panels.forEach((panel, i) => {
          tl.to(panel, { autoAlpha: 1, duration: 0.2 });
          tl.to({}, { duration: 0.3 });
          if (i < panels.length - 1) tl.to(panel, { autoAlpha: 0, duration: 0.25 });
        });

        if (scrollContent && scrollDistance > 0) {
          tl.to(scrollContent, { y: -scrollDistance, ease: 'none', duration: 1 }, '>');
        }
        return { tl };
      };

      const ready = (document as any).fonts?.ready ?? Promise.resolve();
      let instance: { tl: gsap.core.Timeline } | null = null;

      const rebuild = () => {
        try { instance?.tl.scrollTrigger?.kill(); } catch {}
        try { instance?.tl.kill(); } catch {}
        instance = build();
      };

      ready.then(() => {
        rebuild();
        ScrollTrigger.refresh();
      });

      ScrollTrigger.addEventListener('refreshInit', rebuild);
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', rebuild);
        try { instance?.tl.scrollTrigger?.kill(); } catch {}
        try { instance?.tl.kill(); } catch {}
      };
    },
    { scope: containerRef, dependencies: [lang, isInView] }
  );

  if (!isInView) {
    return <div ref={sentinelRef} style={{ minHeight: '100dvh' }} />;
  }

  return (
    <section className="relative bg-[#010101] text-white" dir={t.dir}>
      <div ref={containerRef} className="relative min-h-[100dvh] overflow-visible">
        {/* Panel 1 - What we do */}
        <div className="panel absolute inset-0">
          <div className="min-h-[100dvh] flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-5 md:space-y-6 text-center lg:[text-align:start]">
                  <h1 className="reveal font-bold tracking-tight text-white text-[clamp(2rem,6vw,4.5rem)]">
                    {t.p2h}
                  </h1>
                  <div className="space-y-3 md:space-y-4 text-[clamp(1rem,2.3vw,1.25rem)] leading-relaxed">
                    <p className="reveal">{t.p2p1}</p>
                    <p className="reveal text-[#FFCF59] font-bold italic">{t.p2p2}</p>
                    <p className="reveal text-[#FFCF59] font-bold italic">{t.p2p3}</p>
                    <p className="reveal">{t.p2p4}</p>
                    <p className="reveal">{t.p2p5}</p>
                    <p className="reveal">{t.p2p6}</p>
                    <p className="reveal">{t.p2p7}</p>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-md">
                    <div className="relative w-full aspect-[2/3] md:aspect-[3/4] max-h-[70dvh]">
                      <picture>
                        <source srcSet="/1.webp" type="image/webp" />
                        <Image
                          src="/1.png"
                          alt="Smart Coffee Technology"
                          fill
                          className="rounded-lg shadow-2xl object-cover"
                          sizes="(min-width: 1024px) 400px, 80vw"
                        />
                      </picture>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 1.5 - Coffee experiences message with highlight */}
        <div className="panel absolute inset-0">
          <div className="min-h-[100dvh] flex items-center justify-center">
            <div className="text-center max-w-5xl mx-auto px-4 sm:px-6">
              <p className="reveal font-semibold italic tracking-[-0.02em] leading-[160%] text-[clamp(1.25rem,3.2vw,2.25rem)]">
                <span className="text-white">{t.p2p8Parts.pre}</span>
                <span className="text-[#FFCF59]">{t.p2p8Parts.em}</span>
                <span className="text-white">{t.p2p8Parts.post}</span>
              </p>
            </div>
          </div>
        </div>

      {/* Panel 2 - Brand message (Responsive) */}
<div className="panel absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
  <div className="max-w-[90vw] sm:max-w-4xl md:max-w-5xl text-center mx-auto">
    <p className="font-semibold italic tracking-tight leading-[1.6] text-[clamp(1rem,2.5vw,2rem)] sm:text-[clamp(1.25rem,2.8vw,2.25rem)]">
      <span className="text-[#FFCF59]">{t.p6p1}</span>{' '}
      <span className="text-white">{t.p6p2}</span>
    </p>
  </div>
</div>


       {/* Panel 3 - Smart, seamless, and built around you (Responsive) */}
<div className="panel absolute inset-0 flex items-center justify-center px-6 sm:px-8 md:px-12">
  <div className="w-full text-center">
    <h1
      className="reveal font-bold text-[#FFCF59] italic leading-tight text-center mx-auto
                 text-[clamp(1.2rem,3.5vw,3rem)] sm:text-[clamp(1.5rem,3.8vw,3.5rem)] md:text-[clamp(2rem,3.5vw,4rem)] lg:whitespace-nowrap">
      {t.p4h}
    </h1>
  </div>
</div>


        {/* Panel 4 - Who we are */}
        <div className="panel absolute inset-0">
          <div className="min-h-[100dvh] flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-5 md:space-y-6 text-center lg:[text-align:start]">
                  <h1 className="reveal font-bold tracking-tight text-white text-[clamp(2rem,6vw,4.5rem)]">
                    {t.p1h}
                  </h1>
                  <div className="space-y-3 md:space-y-4 text-[clamp(1rem,2.3vw,1.25rem)] leading-relaxed">
                    <p className="reveal italic">{t.p1p1}</p>
                    <p className="reveal italic">{t.p1p2}</p>
                    <p className="reveal italic">{t.p1p3}</p>
                    <p className="reveal">{t.p1p4}</p>
                    <p className="reveal">{t.p1p5}</p>
                    <p className="reveal">{t.p1p6}</p>
                    <p className="reveal">{t.p1p7}</p>
                    <p className="reveal">{t.p1p8}</p>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-md">
                    <div className="relative w-full aspect-[2/3] md:aspect-[3/4] max-h-[70dvh]">
                      <picture>
                        <source srcSet="/2.webp" type="image/webp" />
                        <Image
                          src="/2.png"
                          alt="CoffeeOn Smart Coffee Machine"
                          fill
                          className="rounded-lg shadow-2xl object-cover"
                          sizes="(min-width: 1024px) 400px, 80vw"
                        />
                      </picture>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 4.5 - Coffee fits into lives quote */}
        <div className="panel absolute inset-0">
          <div className="min-h-[100dvh] flex items-center justify-center">
            <div className="text-center max-w-5xl mx-auto px-4 sm:px-6">
              <p className="reveal font-semibold italic tracking-[-0.02em] leading-[160%] text-[clamp(1.25rem,3.2vw,2.25rem)]">
                <span className="text-white">{t.p1p9Parts.white}</span>{' '}
                <span className="text-[#FFCF59]">{t.p1p9Parts.yellow}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Panel 5 - Vision statement */}
        <div className="panel absolute inset-0">
          <div className="min-h-[100dvh] flex items-center justify-center">
            <div className="text-center max-w-5xl mx-auto px-4 sm:px-6">
              <p className="reveal text-[#FFCF59] italic font-semibold leading-[160%] tracking-[-0.02em] text-[clamp(1.25rem,3.2vw,2.25rem)]">
                {t.p5}
              </p>
            </div>
          </div>
        </div>

        {/* Panel 6 - Why Us */}
        <div className="panel absolute inset-0">
          <div className="min-h-[100dvh] flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
                <div className="scroll-wrapper h-[100dvh] overflow-hidden">
                  <div className="scroll-content space-y-6 md:space-y-8 pb-12">
                    <div className="text-center lg:[text-align:start]">
                      <h1 className="reveal font-bold tracking-tight text-white mb-3 text-[clamp(2rem,6vw,4.5rem)]">
                        {t.p3h}
                      </h1>
                      <p className="reveal text-[#FFCF59] font-bold italic text-[clamp(1rem,2.5vw,1.5rem)]">
                        {t.p3subtitle}
                      </p>
                    </div>
                    <div className="space-y-5 md:space-y-6 text-[clamp(0.95rem,2.2vw,1.125rem)] leading-relaxed">
                      <div>
                        <h3 className="reveal text-xs md:text-sm font-bold tracking-wider uppercase mb-2">{t.p3p1}</h3>
                        <p className="reveal">{t.p3p2}</p>
                      </div>
                      <div>
                        <h3 className="reveal text-xs md:text-sm font-bold tracking-wider uppercase mb-2">{t.p3p3}</h3>
                        <p className="reveal">{t.p3p4}</p>
                      </div>
                      <div>
                        <h3 className="reveal text-xs md:text-sm font-bold tracking-wider uppercase mb-2">{t.p3p5}</h3>
                        <p className="reveal">{t.p3p6}</p>
                      </div>
                      <div>
                        <h3 className="reveal text-xs md:text-sm font-bold tracking-wider uppercase mb-2">{t.p3p7}</h3>
                        <p className="reveal">{t.p3p8}</p>
                      </div>
                      <div>
                        <h3 className="reveal text-xs md:text-sm font-bold tracking-wider uppercase mb-2">{t.p3p9}</h3>
                        <p className="reveal">{t.p3p10}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end lg:sticky lg:top-0 lg:h-[100dvh] lg:items-center">
                  <div className="w-full max-w-md">
                    <div className="relative w-full aspect-[2/3] md:aspect-[3/4] max-h-[80dvh]">
                      <picture>
                        <source srcSet="/3.webp" type="image/webp" />
                        <Image
                          src="/3.png"
                          alt="CoffeeOn App Interface"
                          fill
                          className="rounded-lg shadow-2xl object-cover"
                          sizes="(min-width: 1024px) 400px, 80vw"
                        />
                      </picture>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
