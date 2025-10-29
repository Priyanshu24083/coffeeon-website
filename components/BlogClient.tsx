"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import FloatingImage from "@/components/FloatingImage";
import { useLanguage } from "@/components/LanguageProvider";
import { useMemo } from "react";

export default function BlogClient({ posts }: { posts: any[] }) {
  const { lang } = useLanguage();
  const t = useMemo(() => {
    if (lang === "AR") {
      return {
        heading: "المدونة",
        sub: "حيث تصبح قهوتنا حديث الجميع.",
        dateLocale: "ar-EG",
      } as const;
    }
    return {
      heading: "BLOG",
      sub: "Brewing the headlines, one ritual at a time.",
      dateLocale: "en-US",
    } as const;
  }, [lang]);

  return (
    <section className={`bg-[#010101] text-[#FFFFFF] overflow-hidden `} dir={lang === "AR" ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <div className="min-h-[50vh] md:min-h-[70vh] flex flex-col justify-center relative">
          <FloatingImage
            src="/cup.png"
            width={200}
            height={200}
            className="bottom-30 -right-2 md:bottom-22 md:right-10 sm:bottom-10 sm:right-10"
            rotate={15}
          />
          <h2 className="text-7xl sm:text-7xl md:text-[16vw] font-extrabold tracking-tight mb-6 mt-16">
            {t.heading}
          </h2>
          <FloatingImage
            src="/cup.png"
            width={200}
            height={200}
            className="top-5 -left-2 sm:top-10 sm:left-10"
            rotate={-15}
          />
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#4A4A4A] max-w-2xl mx-auto mt-15 sm:mt-10 md:mt-20 px-4">
            {t.sub}
          </p>
        </div>

        {/* Blog grid */}
        <div className={`mt-12 mb-12 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 `}>
          {posts.map((post: any) => {
            const image = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/next.svg";
            const date = new Date(post.date).toLocaleDateString(t.dateLocale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 flex flex-col"
              >
                {/* Image with white border */}
                <div className="relative w-full h-48 sm:h-56 lg:h-64 border-4 border-white shadow-inner">
                  <Image src={image} alt={post.title.rendered} fill className="object-cover" />
                </div>

                {/* Text content */}
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <span className="text-sm text-gray-500 mb-2">{date}</span>
                  <h3
                    className="text-lg sm:text-xl font-bold mb-2 text-black leading-snug"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </section>
  );
}


