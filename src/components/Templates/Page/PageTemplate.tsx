import { ContentNode } from "@/gql/graphql";
import { getPageByDatabaseId } from "@/wordpress/functions/content";

interface TemplateProps {
  node: ContentNode;
}

export default async function PageTemplate({ node }: TemplateProps) {
  const page = await getPageByDatabaseId(node.databaseId);

  return <div dangerouslySetInnerHTML={{ __html: page?.content || "" }} />;
}
