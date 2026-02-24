import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { print } from "graphql/language/printer";
import Link from "next/link";

import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { ContentInfoQuery } from "@/queries/general/ContentInfoQuery";
import { ContentNode } from "@/gql/graphql";
import PageTemplate from "@/components/Templates/Page/PageTemplate";
import { nextSlugToWpSlug } from "@/utils/nextSlugToWpSlug";
import PostTemplate from "@/components/Templates/Post/PostTemplate";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: slugParam } = await params;
  const slug = nextSlugToWpSlug(slugParam);

  if (slug === "/") {
    return {
      title: "Archives",
      description: "Archive index page",
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      },
    } as Metadata;
  }

  return {
    title: "Page",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${slug}`,
    },
  } as Metadata;
}

export function generateStaticParams() {
  return [];
}

export default async function Page({ params }: Props) {
  const { slug: slugParam } = await params;
  const slug = nextSlugToWpSlug(slugParam);

  if (slug === "/") {
    const archiveLinks = [
      { href: "/blog", label: "Blog Archive" },
      { href: "/case-study", label: "Case Study Archive" },
      { href: "/job", label: "Job Archive" },
    ];

    return (
      <main style={{ padding: "2rem", fontFamily: "monospace" }}>
        <h1>Archives</h1>
        <p>Select an archive page:</p>

        <ul style={{ marginTop: "1rem", paddingLeft: "1.25rem" }}>
          {archiveLinks.map((item) => (
            <li key={item.href} style={{ marginBottom: "0.75rem" }}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  const isPreview = slug.includes("preview");
  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode }>(
    print(ContentInfoQuery),
    {
      slug: isPreview ? slug.split("preview/")[1] : slug,
      idType: isPreview ? "DATABASE_ID" : "URI",
    },
  );

  if (!contentNode) return notFound();

  switch (contentNode.contentTypeName) {
    case "page":
      return <PageTemplate node={contentNode} />;
    case "post":
      return <PostTemplate node={contentNode} />;
    default:
      return <p>{contentNode.contentTypeName} not implemented</p>;
  }
}
