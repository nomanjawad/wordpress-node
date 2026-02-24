import { print } from "graphql/language/printer";

import { ContentNode, Page, Post } from "@/gql/graphql";
import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";
import { ContentInfoQuery } from "@/wordpress/queries/general/ContentInfoQuery";
import { PageQuery } from "@/wordpress/queries/templates/PageQuery";
import { PostQuery } from "@/wordpress/queries/templates/PostQuery";

export async function getContentInfoBySlug({
  slug,
  isPreview,
}: {
  slug: string;
  isPreview: boolean;
}): Promise<ContentNode | null> {
  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode | null }>(
    print(ContentInfoQuery),
    {
      slug: isPreview ? slug.split("preview/")[1] : slug,
      idType: isPreview ? "DATABASE_ID" : "URI",
    }
  );

  return contentNode;
}

export async function getPageByDatabaseId(id: number): Promise<Page | null> {
  const { page } = await fetchGraphQL<{ page: Page | null }>(print(PageQuery), {
    id,
  });

  return page;
}

export async function getPostByDatabaseId(id: number): Promise<Post | null> {
  const { post } = await fetchGraphQL<{ post: Post | null }>(print(PostQuery), {
    id,
  });

  return post;
}
