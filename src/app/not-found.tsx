import type { Metadata } from "next";

import { getPageByDatabaseId } from "@/wordpress/functions/content";

const notFoundPageWordPressId = 501;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "404 - Page Not Found",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/404-not-found/`,
    },
  } as Metadata;
}

export default async function NotFound() {
  const page = await getPageByDatabaseId(notFoundPageWordPressId);
  if (!page) {
    return <div>Page not found</div>;
  }
  return <div dangerouslySetInnerHTML={{ __html: page.content || " " }} />;
}
