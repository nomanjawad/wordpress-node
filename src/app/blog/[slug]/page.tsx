import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogPostTemplate from "@/components/Templates/BlogPost/BlogPostTemplate";
import {
  getSingleBlogMetadata,
  getSingleBlogViewModel,
} from "@/components/Templates/BlogPost/blogPost.data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return getSingleBlogMetadata(slug);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  try {
    const viewModel = await getSingleBlogViewModel(slug);

    if (!viewModel?.post) {
      return notFound();
    }

    return <BlogPostTemplate {...viewModel} />;
  } catch (error) {
    console.error("Error fetching post:", error);

    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error Loading Post</h1>
        <p>There was an error loading this blog post.</p>
        <pre style={{ background: "#f5f5f5", padding: "1rem" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }
}
