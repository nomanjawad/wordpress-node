import { CaseStudyNode } from "./caseStudy.data";

type Props = {
  item: CaseStudyNode;
};

export default function CaseStudyTemplate({ item }: Props) {
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>{item.title}</h1>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#f0f0f0",
          color: "#333",
        }}
      >
        <h2>Case Study Metadata</h2>
        <p>
          <strong>Database ID:</strong> {item.databaseId}
        </p>
        <p>
          <strong>Slug:</strong> {item.slug}
        </p>
        <p>
          <strong>Published Date:</strong> {item.date}
        </p>
        <p>
          <strong>Last Modified:</strong> {item.modified}
        </p>
        {item.categories?.nodes?.length ? (
          <p>
            <strong>Categories:</strong>{" "}
            {item.categories.nodes
              .map((cat) => cat?.name)
              .filter(Boolean)
              .join(", ")}
          </p>
        ) : null}
      </div>

      {item.featuredImage?.node?.sourceUrl ? (
        <div style={{ marginTop: "2rem" }}>
          <h2>Featured Image</h2>
          <img
            src={item.featuredImage.node.sourceUrl}
            alt={item.featuredImage.node.altText || item.title || "Case Study"}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      ) : null}

      <div style={{ marginTop: "2rem" }}>
        <h2>Content</h2>
        <div dangerouslySetInnerHTML={{ __html: item.content || "" }} />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <a
          href="/case-study"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          ← Back to Case Study Archive
        </a>
      </div>
    </div>
  );
}
