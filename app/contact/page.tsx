"use client";

import FlipLink from "@/components/FlipLink";
import Footer from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { useMemo, useRef, useState } from "react";

export default function ContactPage() {
  const { lang } = useLanguage();

  const t = useMemo(() => {
    if (lang === "AR") {
      return {
        heading: "اتصل بنا",
        cityYear: "مانهاتن، نيويورك\n2023",
        officeHoursLabel: "ساعات العمل",
        officeHours: "الاثنين – الجمعة\n11 صباحًا – 2 مساءً",
        email: "coffeon@studio.com",
        cityYearFooter: "مانهاتن، نيويورك\n2025",
        phone: "(+48) 762 864 075",
        officeHoursFooter: "ساعات العمل\nالاثنين – الجمعة 11 صباحًا – 2 مساءً",
        workWithUs: "اعمل معنا",
        privacy: "سياسة الخصوصية",
        form: {
          name: "الاسم",
          email: "البريد الإلكتروني",
          mobile: "رقم الهاتف",
          message: "الرسالة",
          send: "إرسال الرسالة",
          success: "✅ تم إرسال الرسالة بنجاح!",
          fail: "❌ فشل في إرسال الرسالة. حاول مرة أخرى.",
        },
      } as const;
    }
    return {
      heading: "Contact Us",
      cityYear: "Manhattan, New York\n2023",
      officeHoursLabel: "Office hours",
      officeHours: "Monday – Friday\n11 AM – 2 PM",
      email: "coffeon@studio.com",
      cityYearFooter: "Manhattan, New York\n2025",
      phone: "(+48) 762 864 075",
      officeHoursFooter: "Office hours\nMonday – Friday 11 AM – 2 PM",
      workWithUs: "Work with us",
      privacy: "Privacy Policy",
      form: {
        name: "Name",
        email: "Email",
        mobile: "Mobile Number",
        message: "Message",
        send: "Send Message",
        success: "✅ Message sent successfully!",
        fail: "❌ Failed to send message. Try again.",
      },
    } as const;
  }, [lang]);

  // ---------- FORM STATE ----------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Sanitizers
  const sanitizeName = (v: string) =>
    v.replace(/[^\p{L}\s.'-]/gu, ""); // letters from any language + space ' .
  const sanitizeMobile = (v: string) => v.replace(/\D/g, ""); // digits only

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let v = value;

    if (name === "name") v = sanitizeName(v);
    if (name === "mobile") v = sanitizeMobile(v);

    setFormData((prev) => ({ ...prev, [name]: v }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Run native validity checks first
    if (formRef.current && !formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      setStatus(t.form.fail);
      return;
    }

    setStatus("Sending...");

    const res = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus(t.form.success);
      setFormData({ name: "", email: "", mobile: "", message: "" });
    } else {
      setStatus(t.form.fail);
    }
  };

  // ---------- PAGE UI ----------
  return (
    <>
      <div
        className={`min-h-screen bg-[#010101] text-[#FFFFFF] flex flex-col justify-between px-4 sm:px-6 md:px-12 lg:px-20 py-8 md:py-10 lg:py-12`}
        dir={lang === "AR" ? "rtl" : "ltr"}
      >
        {/* Header Section */}
        <div>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-start`}>
            {/* Left Column */}
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 md:mb-8 lg:mb-10">
                {t.heading}
              </h1>
              <div className="space-y-4 md:space-y-5 lg:space-y-6 text-base md:text-lg">
                <p>
                  {t.cityYear.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 ? <br /> : null}
                    </span>
                  ))}
                </p>
                <div>
                  <p className="font-semibold">{t.officeHoursLabel}</p>
                  <p>
                    {t.officeHours.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i === 0 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="w-full max-w-xl lg:max-w-none mx-auto lg:mx-0">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-[#0f0f0f] p-6 md:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-800 space-y-4 md:space-y-5"
              >
                {/* NAME: letters only (Latin + Arabic) */}
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  inputMode="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.form.name}
                  required
                  pattern={"^[A-Za-z\\u0600-\\u06FF\\s.'-]+$"}
                  title={
                    lang === "AR"
                      ? "اسم يحتوي على أحرف فقط (العربية/الإنجليزية) مع مسافات أو شرطات أو فواصل علوية"
                      : "Letters only (English/Arabic), spaces, apostrophes, and hyphens"
                  }
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-3 md:p-4 text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                {/* EMAIL: native email validation */}
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.form.email}
                  required
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-3 md:p-4 text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />

                {/* MOBILE: digits only */}
                <input
                  type="tel"
                  name="mobile"
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="\\d*"
                  maxLength={20}
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder={t.form.mobile}
                  required
                  title={lang === "AR" ? "أرقام فقط" : "Digits only"}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-3 md:p-4 text-base md:text-lg focus:ring-2 focus:ring-[#ffd84d] outline-none transition-all"
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.form.message}
                  rows={5}
                  required
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md p-3 md:p-4 text-base md:text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                ></textarea>

                <button
                  type="submit"
                  className="w-full py-3 md:py-4 bg-[#ffd84d] text-black rounded-md font-semibold text-base md:text-lg transition-all duration-200 hover:ring-4 hover:ring-yellow-300 active:scale-95 touch-manipulation"
                >
                  {t.form.send}
                </button>

                {status && (
                  <p className="text-center text-sm md:text-base text-gray-300 mt-2">
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="mt-16 md:mt-20 lg:mt-32">
          <div
            className={`w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] max-w-6xl mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-xl`}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.917494176448!2d-73.98715568459396!3d40.74881707932762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af18a0f3ff%3A0xbaa1d9e0a77e4c3b!2sManhattan%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1694445872980!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Footer */}
        <footer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start md:items-center mt-16 md:mt-20 lg:mt-24 border-t border-gray-700 pt-6 md:pt-8 text-sm md:text-base">
          {/* Column 1 */}
          <div className="space-y-2">
            <p className="font-bold text-xl sm:text-2xl md:text-3xl">
              {t.email}
            </p>
            <p className="text-gray-300">
              {t.cityYearFooter.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-2 text-gray-300">
            <p>{t.phone}</p>
            <p>
              {t.officeHoursFooter.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1 lg:items-end text-left sm:text-left lg:text-right">
            <a href="#" className="hover:underline text-gray-300 transition-colors hover:text-white">
              {t.workWithUs}
            </a>
            <div className="flex gap-3 md:gap-4 text-base sm:text-lg md:text-xl">
              <FlipLink href="#">Behance</FlipLink>
              <FlipLink href="#">Instagram</FlipLink>
              <FlipLink href="#">LinkedIn</FlipLink>
            </div>
            <p className="text-xs md:text-sm text-gray-400">{t.privacy}</p>
          </div>
        </footer>
      </div>

      <Footer />
    </>
  );
}
