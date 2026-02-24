import { JobNode } from "./job.data";
import FluentFormBridge from "./FluentFormBridge";

type Props = {
  item: JobNode;
};

export default function JobTemplate({ item }: Props) {
  const departments =
    item.terms?.nodes?.filter((term) => term?.__typename === "Depertment") || [];
  const jobTags =
    item.terms?.nodes?.filter((term) => term?.__typename === "JobTag") || [];

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
        <h2>Job Metadata</h2>
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
        <div style={{ marginTop: "2rem" }}>
          <h2>Featured Image</h2>
          <img
            src={item.featuredImage.node.sourceUrl}
            alt={item.featuredImage.node.altText || item.title || "Job"}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      ) : null}

      <div style={{ marginTop: "2rem" }}>
        <h2>Content</h2>
        <div id="job-content-form-root" dangerouslySetInnerHTML={{ __html: item.content || "" }} />
        <FluentFormBridge containerId="job-content-form-root" />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <a
          href="/job"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          ← Back to Job Archive
        </a>
      </div>
    </div>
  );
}
