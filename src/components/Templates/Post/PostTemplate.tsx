import { print } from "graphql/language/printer";
import gql from "graphql-tag";

import { ContentNode, Post } from "@/gql/graphql";
import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";

const POST_QUERY = gql`
  query PostQuery($id: ID!, $preview: Boolean = false) {
    post(id: $id, idType: DATABASE_ID, asPreview: $preview) {
      id
      databaseId
      title
      content
      slug
      status
      uri
      author {
        node {
          name
        }
      }
    }
  }
`;

import styles from "./PostTemplate.module.css";

interface TemplateProps {
  node: ContentNode;
}

export default async function PostTemplate({ node }: TemplateProps) {
  const { post } = await fetchGraphQL<{ post: Post | null }>(print(POST_QUERY), {
    id: node.databaseId,
  });
  if (!post) return null;

  return (
    <div className={styles.post}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.author}>By {post.author?.node.name}</div>

      <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
    </div>
  );
}
