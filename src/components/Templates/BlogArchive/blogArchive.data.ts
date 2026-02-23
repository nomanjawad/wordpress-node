import { print } from "graphql/language/printer";

import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { BlogArchiveQuery } from "@/queries/blog/BlogArchiveQuery";

type PostNode = {
  id: string;
  databaseId: number;
  title?: string | null;
  excerpt?: string | null;
  slug?: string | null;
  date?: string | null;
  modified?: string | null;
  author?: {
    node?: {
      name?: string | null;
      description?: string | null;
    } | null;
  } | null;
};

export async function getBlogArchivePosts(): Promise<PostNode[]> {
  const { posts } = await fetchGraphQL<{ posts: { nodes: PostNode[] } }>(
    print(BlogArchiveQuery)
  );

  return posts?.nodes || [];
}
