import type { Metadata } from "next";
import { print } from "graphql/language/printer";
import gql from "graphql-tag";

import { Page } from "@/gql/graphql";
import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";

const PAGE_QUERY = gql`
  query PageQuery($id: ID!, $preview: Boolean = false) {
    page(id: $id, idType: DATABASE_ID, asPreview: $preview) {
      id
      databaseId
      title
      content
      slug
      status
      uri
    }
  }
`;

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
  const { page } = await fetchGraphQL<{ page: Page | null }>(print(PAGE_QUERY), {
    id: notFoundPageWordPressId,
  });
  if (!page) {
    return <div>Page not found</div>;
  }
  return <div dangerouslySetInnerHTML={{ __html: page.content || " " }} />;
}
