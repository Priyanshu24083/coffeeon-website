import BlogPostClient from "./BlogPostClient";

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <BlogPostClient slug={params.slug} />;
}
