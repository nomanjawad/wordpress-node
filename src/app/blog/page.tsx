import type { Metadata } from "next";

import BlogArchiveTemplate from "@/components/Templates/BlogArchive/BlogArchiveTemplate";
import { getBlogArchivePosts } from "@/components/Templates/BlogArchive/blogArchive.data";

export const metadata: Metadata = {
  title: "Blog Archive",
  description: "All blog posts",
};

export default async function BlogArchivePage() {
  const posts = await getBlogArchivePosts();

  return <BlogArchiveTemplate posts={posts} />;
}
