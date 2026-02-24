import type { Metadata } from "next";

import BlogArchiveTemplate from "@/components/Templates/BlogArchive/BlogArchiveTemplate";
import { getBlogArchivePosts } from "@/wordpress/functions/blogArchive";

export const metadata: Metadata = {
  title: "Blog Archive",
  description: "All blog posts",
};

export default async function BlogArchivePage() {
  const posts = await getBlogArchivePosts();

  return <BlogArchiveTemplate posts={posts} />;
}
