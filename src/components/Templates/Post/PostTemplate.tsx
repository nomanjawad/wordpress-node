import { ContentNode, Post } from "@/gql/graphql";
import { getPostByDatabaseId } from "@/wordpress/functions/content";

import styles from "./PostTemplate.module.css";

interface TemplateProps {
  node: ContentNode;
}

export default async function PostTemplate({ node }: TemplateProps) {
  const post = (await getPostByDatabaseId(node.databaseId)) as Post | null;
  if (!post) return null;

  return (
    <div className={styles.post}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.author}>By {post.author?.node.name}</div>

      <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
    </div>
  );
}
