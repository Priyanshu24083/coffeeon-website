"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";



type WPPost = any;

export default function BlogPostClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<WPPost | null>(null);
  const [similarPosts, setSimilarPosts] = useState<WPPost[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(
          `https://wordpress-fzdqo.wasmer.app/wp-json/wp/v2/posts?slug=${slug}&_embed`,
          { next: { revalidate: 60 } }
        );
        if (!res.ok) {
          setError(true);
          return;
        }
        const posts = await res.json();
        if (!Array.isArray(posts) || posts.length === 0) {
          setError(true);
          return;
        }
        const current = posts[0];
        setPost(current);

        // Fetch similar posts (latest excluding current post)
        const similarRes = await fetch(
          `https://wordpress-fzdqo.wasmer.app/wp-json/wp/v2/posts?per_page=3&exclude=${current.id}&_embed`,
          { next: { revalidate: 60 } }
        );
        if (similarRes.ok) {
          const similar = await similarRes.json();
          setSimilarPosts(Array.isArray(similar) ? similar : []);
        }
      } catch {
        setError(true);
      }
    }
    fetchPost();
  }, [slug]);

  if (error) return <div className="text-center py-16">Post not found</div>;
  if (!post) return <div className="text-center py-16">Loading...</div>;

  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  const bgSrc =
    media?.media_details?.sizes?.medium_large?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.source_url ||
    "/placeholder.jpg";
  const bgAlt =
    media?.alt_text || post?.title?.rendered?.replace(/<[^>]*>/g, "") || "Featured";

  return (
    <div className={`bg-gray-50 `}>
      {/* Featured Image & Fullscreen Title */}
      <section className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Image via next/image */}
        <Image
          src={bgSrc}
          alt={bgAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="z-0"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        {/* Title */}
        <h1
          className="relative z-20 text-white text-5xl md:text-7xl font-bold px-4 leading-tight max-w-4xl"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      </section>

      {/* Blog Content */}
      <article className="max-w-3xl mx-auto py-16 px-6 prose prose-lg prose-slate">
        <div
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          className="space-y-8"
        />
      </article>

      {/* Similar Posts Section */}
      {similarPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Similar Posts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {similarPosts.map((p) => {
              const thumb =
                p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium?.source_url ||
                p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                "/placeholder.jpg";
              return (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                  <div className="overflow-hidden rounded-lg shadow-lg bg-white">
                    {/* regular <img> is fine for cards; can be switched to next/image if preferred */}
                    <img
                      src={thumb}
                      alt={p.title?.rendered?.replace(/<[^>]*>/g, "") || "Post"}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <h3
                        className="text-xl font-semibold mb-2 group-hover:text-[#ffd84d] transition-colors"
                        dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                      />
                      <p className="text-sm text-gray-500">
                        {new Date(p.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
