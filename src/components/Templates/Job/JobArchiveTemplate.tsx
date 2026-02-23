import Link from "next/link";

import { JobNode } from "./job.data";

type Props = {
  items: JobNode[];
};

export default function JobArchiveTemplate({ items }: Props) {
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Job Archive</h1>
      <p>Total Jobs: {items.length}</p>
      <hr />

      {items.map((item) => {
        const departments =
          item.terms?.nodes?.filter((term) => term?.__typename === "Depertment") || [];
        const jobTags =
          item.terms?.nodes?.filter((term) => term?.__typename === "JobTag") || [];

        return (
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
              href={`/job/${item.slug}`}
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
            {departments.length ? (
              <p>
                <strong>Departments:</strong>{" "}
                {departments
                  .map((term) => term?.name)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : null}
            {jobTags.length ? (
              <p>
                <strong>Job Tags:</strong>{" "}
                {jobTags
                  .map((term) => term?.name)
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : null}
          </div>

          {item.featuredImage?.node?.sourceUrl ? (
            <div style={{ marginTop: "1rem" }}>
              <img
                src={item.featuredImage.node.sourceUrl}
                alt={item.featuredImage.node.altText || item.title || "Job"}
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
        );
      })}
    </div>
  );
}
