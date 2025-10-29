'use client';

import Footer from '@/components/Footer';
import { useState } from 'react';

const faqs = {
  en: [
    {
      question: "What is CoffeeOn?",
      answer:
        "CoffeeOn is a new category of smart, app-connected barista stations – delivering consistently premium coffee, personalized for you, available 24/7 wherever you are.",
    },
    {
      question: "Is CoffeeOn a vending machine or a café?",
      answer:
        "Neither. It's your personal barista: café-quality coffee, made to order, fully customizable, and always close. It fits your lifestyle, not the other way around.",
    },
    {
      question: "How do I customize my coffee?",
      answer:
        "Use our easy-to-use app to customize your drink, save your preferences, and order ahead – so your coffee is just right, every single time.",
    },
    {
      question: "What ingredients do you use?",
      answer:
        "We use only real milk and fresh beans, ground and brewed to order. Choose hot or iced options – always premium quality.",
    },
    {
      question: "Where can I find a CoffeeOn station?",
      answer:
        "You can find CoffeeOn at offices, colleges, gyms, co-working spaces, apartments, and more locations every week. Check the app for the nearest CoffeeOn to you.",
    },
    {
      question: "Is CoffeeOn environmentally conscious?",
      answer:
        "We build sustainability into every part of the system, from responsible sourcing to eco-friendly packaging, with a strong commitment to a better planet.",
    },
  ],
  ar: [
    {
      question: "ما هو CoffeeOn؟",
      answer:
        "CoffeeOn هي فئة جديدة من محطات القهوة الذكية المتصلة بالتطبيق — تقدم قهوة مميزة باستمرار، مخصصة لك، ومتاحة على مدار الساعة أينما كنت.",
    },
    {
      question: "هل CoffeeOn آلة بيع أم مقهى؟",
      answer:
        "ولا واحدة منهما. إنها باريستا شخصية لك — قهوة بجودة المقاهي، تُحضّر حسب الطلب، قابلة للتخصيص بالكامل، ودائمًا بالقرب منك.",
    },
    {
      question: "كيف يمكنني تخصيص قهوتي؟",
      answer:
        "استخدم تطبيقنا السهل لتخصيص مشروبك، احفظ تفضيلاتك، واطلب مسبقًا — لتكون قهوتك تمامًا كما تحب في كل مرة.",
    },
    {
      question: "ما المكونات التي تستخدمونها؟",
      answer:
        "نستخدم فقط الحليب الحقيقي وحبوب البن الطازجة، تُطحن وتُحضّر عند الطلب. يمكنك اختيار قهوة ساخنة أو باردة — دائمًا بجودة عالية.",
    },
    {
      question: "أين يمكنني العثور على محطة CoffeeOn؟",
      answer:
        "يمكنك العثور على CoffeeOn في المكاتب، الكليات، الصالات الرياضية، مساحات العمل المشتركة، والمجمعات السكنية، والمزيد من المواقع كل أسبوع. تحقق من التطبيق لمعرفة أقرب محطة إليك.",
    },
    {
      question: "هل CoffeeOn صديقة للبيئة؟",
      answer:
        "نضع الاستدامة في كل جزء من النظام، من المصادر المسؤولة إلى التغليف الصديق للبيئة، مع التزام قوي بكوكب أفضل.",
    },
  ],
};

export default function CoffeeOnFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const isArabic = lang === 'ar';
  const faqData = faqs[lang];

  return (
    <>
      <div
        className={`min-h-screen bg-[#faf7ef] flex flex-col items-center justify-start pt-24 px-4 ${
          isArabic ? 'direction-rtl' : ''
        }`}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Language Toggle */}
        <div className="absolute top-8 right-6">
          <button
            onClick={() => setLang(isArabic ? 'en' : 'ar')}
            className="bg-[#FFCF59] text-[#23221f] px-5 py-2 rounded-full font-semibold text-sm uppercase shadow-md hover:shadow-lg transition"
          >
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>

        {/* Heading */}
        <div className="w-full max-w-2xl">
          <h1
            className={`text-5xl md:text-7xl font-extrabold text-[#23221f] mb-8 text-center uppercase tracking-tight ${
              isArabic ? 'font-[Cairo]' : ''
            }`}
          >
            {isArabic ? 'الأسئلة الشائعة' : 'CoffeeOn FAQ'}
          </h1>

          {/* FAQ Section */}
          <div className="flex flex-col space-y-5">
            {faqData.map((faq, i) => (
              <div
                key={i}
                className="border-b border-[#f4e2b7] transition-all pb-4"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className={`w-full text-left flex items-center justify-between py-4 focus:outline-none text-2xl font-bold text-[#23221f] hover:text-[#FFCF59] transition-colors ${
                    isArabic ? 'flex-row-reverse' : ''
                  }`}
                  aria-expanded={open === i}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`ml-4 text-[#FFCF59] text-3xl transition-all duration-200 ${
                      open === i ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
                    open === i ? 'max-h-52' : 'max-h-0'
                  }`}
                >
                  <p className="text-lg text-[#382e24] pt-1 pb-2 pr-2 pl-1">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-[#ceb855] text-lg font-medium opacity-60">
            © {new Date().getFullYear()} CoffeeOn
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
