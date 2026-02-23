import Script from "next/script";

type Props = {
  post: any;
  rewrittenSeo: any;
  headMeta: Record<string, string>;
  formattedJsonLd: string;
};

export default function BlogPostTemplate({
  post,
  rewrittenSeo,
  headMeta,
  formattedJsonLd,
}: Props) {
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      {rewrittenSeo?.jsonLd?.raw && (
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: rewrittenSeo.jsonLd.raw }}
        />
      )}

      <h1>{post.title}</h1>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#f0f0f0",
          color: "#333",
        }}
      >
        <h2>Post Metadata</h2>
        <p>
          <strong>Database ID:</strong> {post.databaseId}
        </p>
        <p>
          <strong>Slug:</strong> {post.slug}
        </p>
        <p>
          <strong>Published Date:</strong> {post.date}
        </p>
        <p>
          <strong>Last Modified:</strong> {post.modified}
        </p>
        <p>
          <strong>Author:</strong> {post.author?.node?.name || "Unknown"}
        </p>
        {post.author?.node?.description && (
          <p>
            <strong>Author Bio:</strong> {post.author.node.description}
          </p>
        )}
        {post.author?.node?.email && (
          <p>
            <strong>Author Email:</strong> {post.author.node.email}
          </p>
        )}
      </div>

      {rewrittenSeo && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#e8f4f8",
            color: "#333",
          }}
        >
          <h2>SEO Metadata (RankMath)</h2>

          <div style={{ marginBottom: "1rem" }}>
            <h3>Basic SEO:</h3>
            <p>
              <strong>Meta Title:</strong> {rewrittenSeo.title || "N/A"}
            </p>
            <p>
              <strong>Meta Description:</strong> {" "}
              {rewrittenSeo.description || "N/A"}
            </p>
            <p>
              <strong>Canonical URL:</strong> {rewrittenSeo.canonicalUrl || "N/A"}
            </p>
            <p>
              <strong>Robots:</strong> {rewrittenSeo.robots || "N/A"}
            </p>
            {rewrittenSeo.focusKeywords && (
              <p>
                <strong>Focus Keywords:</strong>{" "}
                {Array.isArray(rewrittenSeo.focusKeywords)
                  ? rewrittenSeo.focusKeywords.filter(Boolean).join(", ")
                  : rewrittenSeo.focusKeywords}
              </p>
            )}
            {rewrittenSeo.breadcrumbTitle && (
              <p>
                <strong>Breadcrumb Title:</strong> {rewrittenSeo.breadcrumbTitle}
              </p>
            )}
            {Array.isArray(rewrittenSeo.robots) && rewrittenSeo.robots.length > 0 && (
              <p>
                <strong>Robots Tokens:</strong>{" "}
                {rewrittenSeo.robots.filter(Boolean).join(", ")}
              </p>
            )}
          </div>

          {rewrittenSeo.openGraph && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
              <h3>Open Graph Data:</h3>
              <p>
                <strong>OG Title:</strong> {rewrittenSeo.openGraph.title || "N/A"}
              </p>
              <p>
                <strong>OG Description:</strong>{" "}
                {rewrittenSeo.openGraph.description || "N/A"}
              </p>
              <p>
                <strong>OG URL:</strong> {rewrittenSeo.openGraph.url || "N/A"}
              </p>
              <p>
                <strong>OG Site Name:</strong>{" "}
                {rewrittenSeo.openGraph.siteName || "N/A"}
              </p>
              <p>
                <strong>OG Type:</strong> {rewrittenSeo.openGraph.type || "N/A"}
              </p>
              <p>
                <strong>OG Locale:</strong>{" "}
                {rewrittenSeo.openGraph.locale || "N/A"}
              </p>
              <p>
                <strong>OG Updated Time:</strong>{" "}
                {rewrittenSeo.openGraph.updatedTime || "N/A"}
              </p>

              {rewrittenSeo.openGraph.articleMeta && (
                <div style={{ marginTop: "0.5rem" }}>
                  <p>
                    <strong>Article Author:</strong>{" "}
                    {rewrittenSeo.openGraph.articleMeta.author || "N/A"}
                  </p>
                  <p>
                    <strong>Article Publisher:</strong>{" "}
                    {rewrittenSeo.openGraph.articleMeta.publisher || "N/A"}
                  </p>
                  <p>
                    <strong>Article Section:</strong>{" "}
                    {rewrittenSeo.openGraph.articleMeta.section || "N/A"}
                  </p>
                  {rewrittenSeo.openGraph.articleMeta.tags?.length > 0 && (
                    <p>
                      <strong>Article Tags:</strong>{" "}
                      {rewrittenSeo.openGraph.articleMeta.tags
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  <p>
                    <strong>Article Published:</strong>{" "}
                    {rewrittenSeo.openGraph.articleMeta.publishedTime || "N/A"}
                  </p>
                  <p>
                    <strong>Article Modified:</strong>{" "}
                    {rewrittenSeo.openGraph.articleMeta.modifiedTime || "N/A"}
                  </p>
                </div>
              )}

              {rewrittenSeo.openGraph.image?.url && (
                <div style={{ marginTop: "0.5rem" }}>
                  <strong>OG Image:</strong>
                  <br />
                  <img
                    src={rewrittenSeo.openGraph.image.url}
                    alt="Open Graph"
                    style={{ maxWidth: "300px", marginTop: "0.5rem" }}
                  />
                  <br />
                  <small>URL: {rewrittenSeo.openGraph.image.url}</small>
                  <br />
                  {rewrittenSeo.openGraph.image.secureUrl && (
                    <>
                      <small>
                        Secure URL: {rewrittenSeo.openGraph.image.secureUrl}
                      </small>
                      <br />
                    </>
                  )}
                  {rewrittenSeo.openGraph.image.width && (
                    <small>
                      Dimensions: {rewrittenSeo.openGraph.image.width}x
                      {rewrittenSeo.openGraph.image.height}
                    </small>
                  )}
                  <br />
                  {rewrittenSeo.openGraph.image.type && (
                    <small>Type: {rewrittenSeo.openGraph.image.type}</small>
                  )}
                  <br />
                  <small>
                    Alt Text: {post.featuredImage?.node?.altText || "N/A"}
                  </small>
                </div>
              )}
            </div>
          )}

          {rewrittenSeo.openGraph?.twitterMeta && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
              <h3>Twitter Card Data:</h3>
              <p>
                <strong>Card Type:</strong> {rewrittenSeo.openGraph.twitterMeta.card || "N/A"}
              </p>
              <p>
                <strong>Twitter Title:</strong>{" "}
                {rewrittenSeo.openGraph.twitterMeta.title || "N/A"}
              </p>
              <p>
                <strong>Twitter Description:</strong>{" "}
                {rewrittenSeo.openGraph.twitterMeta.description || "N/A"}
              </p>
              <p>
                <strong>Twitter Site:</strong>{" "}
                {rewrittenSeo.openGraph.twitterMeta.site || "N/A"}
              </p>
              <p>
                <strong>Twitter Creator:</strong>{" "}
                {rewrittenSeo.openGraph.twitterMeta.creator || "N/A"}
              </p>
              <p>
                <strong>Twitter App Country:</strong>{" "}
                {rewrittenSeo.openGraph.twitterMeta.appCountry || "N/A"}
              </p>
              {rewrittenSeo.openGraph.twitterMeta.image && (
                <div style={{ marginTop: "0.5rem" }}>
                  <strong>Twitter Image:</strong>
                  <br />
                  <img
                    src={rewrittenSeo.openGraph.twitterMeta.image}
                    alt="Twitter Card"
                    style={{ maxWidth: "300px", marginTop: "0.5rem" }}
                  />
                  <br />
                  <small>{rewrittenSeo.openGraph.twitterMeta.image}</small>
                </div>
              )}
            </div>
          )}

          {(headMeta["twitter:label1"] ||
            headMeta["twitter:data1"] ||
            headMeta["twitter:label2"] ||
            headMeta["twitter:data2"]) && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
              <h3>Twitter Extra Labels (from fullHead):</h3>
              <p>
                <strong>{headMeta["twitter:label1"] || "Label 1"}:</strong>{" "}
                {headMeta["twitter:data1"] || "N/A"}
              </p>
              <p>
                <strong>{headMeta["twitter:label2"] || "Label 2"}:</strong>{" "}
                {headMeta["twitter:data2"] || "N/A"}
              </p>
            </div>
          )}

          {rewrittenSeo.openGraph?.slackEnhancedData?.length > 0 && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
              <h3>Slack Enhanced Data:</h3>
              <ul>
                {rewrittenSeo.openGraph.slackEnhancedData.map(
                  (item: any, idx: number) => (
                    <li key={idx}>
                      <strong>{item?.label || `Label ${idx + 1}`}:</strong>{" "}
                      {item?.data || "N/A"}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {rewrittenSeo?.jsonLd?.raw && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#fff3cd",
            color: "#333",
          }}
        >
          <h2>RankMath Schema (JSON-LD Structured Data)</h2>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              marginTop: "0.5rem",
              fontSize: "0.8rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            {formattedJsonLd}
          </pre>
        </div>
      )}

      {post.featuredImage?.node?.sourceUrl && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Featured Image</h2>
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <p>Alt Text: {post.featuredImage.node.altText || "N/A"}</p>
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h2>Excerpt</h2>
        <div dangerouslySetInnerHTML={{ __html: post.excerpt || "" }} />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Content</h2>
        <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
      </div>

      {post.categories?.nodes && post.categories.nodes.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Categories</h2>
          <ul>
            {post.categories.nodes.map((cat: any) => (
              <li key={cat.slug}>
                {cat.name} (slug: {cat.slug})
              </li>
            ))}
          </ul>
        </div>
      )}

      {post.tags?.nodes && post.tags.nodes.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Tags</h2>
          <ul>
            {post.tags.nodes.map((tag: any) => (
              <li key={tag.slug}>
                {tag.name} (slug: {tag.slug})
              </li>
            ))}
          </ul>
        </div>
      )}

      <details style={{ marginTop: "2rem" }}>
        <summary
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          View Complete JSON Data
        </summary>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            overflow: "auto",
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: "#333",
          }}
        >
          {JSON.stringify(post, null, 2)}
        </pre>
      </details>

      <div style={{ marginTop: "2rem" }}>
        <a
          href="/blog"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          ← Back to Blog Archive
        </a>
      </div>
    </div>
  );
}
