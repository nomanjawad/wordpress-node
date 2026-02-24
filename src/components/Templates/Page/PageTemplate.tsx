import { print } from "graphql/language/printer";
import gql from "graphql-tag";

import { ContentNode, Page } from "@/gql/graphql";
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

interface TemplateProps {
  node: ContentNode;
}

export default async function PageTemplate({ node }: TemplateProps) {
  const { page } = await fetchGraphQL<{ page: Page | null }>(print(PAGE_QUERY), {
    id: node.databaseId,
  });

  return <div dangerouslySetInnerHTML={{ __html: page?.content || "" }} />;
}
