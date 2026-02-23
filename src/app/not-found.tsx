import type { Metadata } from "next";
import { print } from "graphql/language/printer";

import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { Page } from "@/gql/graphql";
import { PageQuery } from "@/components/Templates/Page/PageQuery";

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
  const { page } = await fetchGraphQL<{ page: Page }>(print(PageQuery), {
    id: notFoundPageWordPressId,
  });
  if (!page) {
    return <div>Page not found</div>;
  }
  return <div dangerouslySetInnerHTML={{ __html: page.content || " " }} />;
}
