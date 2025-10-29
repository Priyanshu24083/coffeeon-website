import { getWordPressPosts } from "@/lib/wordpress";
import BlogClient from "@/components/BlogClient";


export default async function BlogSection() {
  const posts = await getWordPressPosts();

  return <BlogClient posts={posts} />;
}
