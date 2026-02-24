import Link from "next/link";

import { CaseStudyNode } from "@/wordpress/functions/caseStudy";

type Props = {
  items: CaseStudyNode[];
};

export default function CaseStudyArchiveTemplate({ items }: Props) {
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Case Study Archive</h1>
      <p>Total Case Studies: {items.length}</p>
      <hr />

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
          }}
        >
          <h2>
            <Link
              href={`/case-study/${item.slug}`}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {item.title}
            </Link>
          </h2>

          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Slug:</strong> {item.slug}
            </p>
            <p>
              <strong>Published:</strong> {item.date}
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
            <div style={{ marginTop: "1rem" }}>
              <img
                src={item.featuredImage.node.sourceUrl}
                alt={item.featuredImage.node.altText || item.title || "Case Study"}
                style={{ maxWidth: "280px", height: "auto" }}
              />
            </div>
          ) : null}

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
              {JSON.stringify(item, null, 2)}
            </pre>
          </details>
        </div>
      ))}
    </div>
  );
}
