import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { print } from "graphql/language/printer";
import gql from "graphql-tag";
import Script from "next/script";

import { fetchGraphQL } from "@/utils/fetchGraphQL";

const SingleBlogQuery = gql`
  query SingleBlogQuery($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      content
      excerpt
      slug
      date
      modified
      author {
        node {
          name
          description
          email
          avatar {
            url
          }
        }
      }
      seo {
        title
        description
        canonicalUrl
        focusKeywords
        breadcrumbTitle
        robots
        jsonLd {
          raw
        }
        openGraph {
          title
          description
          url
          siteName
          type
          locale
          articleMeta {
            section
            publishedTime
            modifiedTime
          }
          image {
            url
            height
            width
            type
          }
          twitterMeta {
          title
          description
          card
          image
        }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { post } = await fetchGraphQL<{ post: any }>(
      print(SingleBlogQuery),
      { slug }
    );

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    return {
      title: post.seo?.title || post.title || "Blog Post",
      description: post.seo?.description || post.excerpt,
      robots: post.seo?.robots
        ? {
            index: !post.seo.robots.includes("noindex"),
            follow: !post.seo.robots.includes("nofollow"),
          }
        : undefined,
      alternates: {
        canonical: post.seo?.canonicalUrl || undefined,
      },
      openGraph: {
        title: post.seo?.openGraph?.title || post.title,
        description: post.seo?.openGraph?.description || post.excerpt,
        url: post.seo?.openGraph?.url || post.seo?.canonicalUrl,
        siteName: post.seo?.openGraph?.siteName,
        locale: post.seo?.openGraph?.locale,
        type: (post.seo?.openGraph?.type as any) || "article",
        publishedTime: post.seo?.openGraph?.articleMeta?.publishedTime || post.date,
        modifiedTime: post.seo?.openGraph?.articleMeta?.modifiedTime || post.modified,
        images: post.seo?.openGraph?.image?.url
          ? [
              {
                url: post.seo.openGraph.image.url,
                width: post.seo.openGraph.image.width,
                height: post.seo.openGraph.image.height,
                type: post.seo.openGraph.image.type,
              },
            ]
          : [],
      },
      twitter: {
        card: (post.seo?.openGraph?.twitterMeta?.card as any) || "summary_large_image",
        title: post.seo?.openGraph?.twitterMeta?.title || post.seo?.title || post.title,
        description:
          post.seo?.openGraph?.twitterMeta?.description ||
          post.seo?.description ||
          post.excerpt,
        images: post.seo?.openGraph?.twitterMeta?.image
          ? [post.seo.openGraph.twitterMeta.image]
          : [],
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Blog Post",
    };
  }
}

export default async function SingleBlog({ params }: Props) {
  const { slug } = await params;

  try {
    const { post } = await fetchGraphQL<{ post: any }>(
      print(SingleBlogQuery),
      { slug }
    );

    if (!post) {
      return notFound();
    }

    return (
      <div style={{ padding: "2rem", fontFamily: "monospace" }}>
        {post.seo?.jsonLd?.raw && (
          <Script
            id="json-ld-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: post.seo.jsonLd.raw }}
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

        {post.seo && (
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
                <strong>Meta Title:</strong> {post.seo.title || "N/A"}
              </p>
              <p>
                <strong>Meta Description:</strong>{" "}
                {post.seo.description || "N/A"}
              </p>
              <p>
                <strong>Canonical URL:</strong> {post.seo.canonicalUrl || "N/A"}
              </p>
              <p>
                <strong>Robots:</strong> {post.seo.robots || "N/A"}
              </p>
              {post.seo.focusKeywords && (
                <p>
                  <strong>Focus Keywords:</strong> {post.seo.focusKeywords}
                </p>
              )}
              {post.seo.breadcrumbTitle && (
                <p>
                  <strong>Breadcrumb Title:</strong> {post.seo.breadcrumbTitle}
                </p>
              )}
            </div>

            {post.seo.openGraph && (
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
                <h3>Open Graph Data:</h3>
                <p>
                  <strong>OG Title:</strong> {post.seo.openGraph.title || "N/A"}
                </p>
                <p>
                  <strong>OG Description:</strong>{" "}
                  {post.seo.openGraph.description || "N/A"}
                </p>
                <p>
                  <strong>OG URL:</strong> {post.seo.openGraph.url || "N/A"}
                </p>
                <p>
                  <strong>OG Site Name:</strong>{" "}
                  {post.seo.openGraph.siteName || "N/A"}
                </p>
                <p>
                  <strong>OG Type:</strong> {post.seo.openGraph.type || "N/A"}
                </p>
                <p>
                  <strong>OG Locale:</strong>{" "}
                  {post.seo.openGraph.locale || "N/A"}
                </p>
                
                {post.seo.openGraph.articleMeta && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <p>
                      <strong>Article Section:</strong>{" "}
                      {post.seo.openGraph.articleMeta.section || "N/A"}
                    </p>
                    <p>
                      <strong>Article Published:</strong>{" "}
                      {post.seo.openGraph.articleMeta.publishedTime || "N/A"}
                    </p>
                    <p>
                      <strong>Article Modified:</strong>{" "}
                      {post.seo.openGraph.articleMeta.modifiedTime || "N/A"}
                    </p>
                  </div>
                )}

                {post.seo.openGraph.image?.url && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <strong>OG Image:</strong>
                    <br />
                    <img
                      src={post.seo.openGraph.image.url}
                      alt="Open Graph"
                      style={{ maxWidth: "300px", marginTop: "0.5rem" }}
                    />
                    <br />
                    <small>URL: {post.seo.openGraph.image.url}</small>
                    <br />
                    {post.seo.openGraph.image.width && (
                      <small>
                        Dimensions: {post.seo.openGraph.image.width}x
                        {post.seo.openGraph.image.height}
                      </small>
                    )}
                    <br />
                    {post.seo.openGraph.image.type && (
                      <small>Type: {post.seo.openGraph.image.type}</small>
                    )}
                  </div>
                )}
              </div>
            )}

            {post.seo.openGraph?.twitterMeta && (
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
                <h3>Twitter Card Data:</h3>
                <p>
                  <strong>Card Type:</strong> {post.seo.openGraph.twitterMeta.card || "N/A"}
                </p>
                <p>
                  <strong>Twitter Title:</strong>{" "}
                  {post.seo.openGraph.twitterMeta.title || "N/A"}
                </p>
                <p>
                  <strong>Twitter Description:</strong>{" "}
                  {post.seo.openGraph.twitterMeta.description || "N/A"}
                </p>
                {post.seo.openGraph.twitterMeta.image && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <strong>Twitter Image:</strong>
                    <br />
                    <img
                      src={post.seo.openGraph.twitterMeta.image}
                      alt="Twitter Card"
                      style={{ maxWidth: "300px", marginTop: "0.5rem" }}
                    />
                    <br />
                    <small>{post.seo.openGraph.twitterMeta.image}</small>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {post.seo?.jsonLd?.raw && (
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
                marginTop: "0.5rem",
                fontSize: "0.8rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              {post.seo.jsonLd.raw}
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
  } catch (error) {
    console.error("Error fetching post:", error);
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error Loading Post</h1>
        <p>There was an error loading this blog post.</p>
        <pre style={{ background: "#f5f5f5", padding: "1rem" }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }
}
