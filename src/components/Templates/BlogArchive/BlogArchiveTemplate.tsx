import Link from "next/link";

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

type Props = {
  posts: PostNode[];
};

export default function BlogArchiveTemplate({ posts }: Props) {
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Blog Archive</h1>
      <p>Total Posts: {posts.length}</p>
      <hr />

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
          }}
        >
          <h2>
            <Link
              href={`/blog/${post.slug}`}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {post.title}
            </Link>
          </h2>

          <div style={{ marginTop: "1rem" }}>
            <strong>Excerpt:</strong>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt || "" }} />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Slug:</strong> {post.slug}
            </p>
            <p>
              <strong>Published:</strong> {post.date}
            </p>
            <p>
              <strong>Last Modified:</strong> {post.modified}
            </p>
            <p>
              <strong>Author:</strong> {post.author?.node?.name}
            </p>
            {post.author?.node?.description && (
              <p>
                <strong>Author Bio:</strong> {post.author?.node?.description}
              </p>
            )}
          </div>

          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              View JSON Data
            </summary>
            <pre
              style={{
                background: "#f5f5f5",
                padding: "1rem",
                overflow: "auto",
                marginTop: "0.5rem",
              }}
            >
              {JSON.stringify(post, null, 2)}
            </pre>
          </details>
        </div>
      ))}
    </div>
  );
}
