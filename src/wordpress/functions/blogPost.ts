import type { Metadata } from "next";
import { print } from "graphql/language/printer";

import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";
import { SingleBlogQuery } from "@/wordpress/queries/blog/SingleBlogQuery";

type SingleBlogResponse = {
  post: any;
};

export type SingleBlogViewModel = {
  post: any;
  rewrittenSeo: any;
  headMeta: Record<string, string>;
  formattedJsonLd: string;
};

const isImageUrl = (value: string) => {
  if (!value) return false;
  if (/^data:image\//i.test(value)) return true;
  if (/\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(value)) return true;

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    if (host.includes("gravatar.com")) return true;
    if (path.includes("/avatar/")) return true;
  } catch {
    return false;
  }

  return false;
};

const replaceDomain = (
  value: string,
  baseUrl?: string,
  backendUrl?: string,
  backendHostname?: string
) => {
  if (!baseUrl || !value) return value;

  try {
    const parsed = new URL(value);
    const backendHost = backendUrl ? new URL(backendUrl).host : undefined;
    const isBackend =
      (backendHost && parsed.host === backendHost) ||
      (backendHostname && parsed.host === backendHostname);
    if (!isBackend) return value;

    return new URL(
      `${parsed.pathname}${parsed.search}${parsed.hash}`,
      baseUrl
    ).toString();
  } catch {
    return value;
  }
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const stripScriptWrapper = (value: string) =>
  value
    .trim()
    .replace(/^<script[^>]*>/i, "")
    .replace(/<\/script>$/i, "")
    .trim();

export const prettifyJsonLd = (raw?: string) => {
  if (!raw) return "";

  const normalizedRaw = stripScriptWrapper(raw);
  const decodedRaw = decodeHtmlEntities(normalizedRaw);
  const candidates = [raw, normalizedRaw, decodedRaw];

  for (const candidate of candidates) {
    try {
      return JSON.stringify(JSON.parse(candidate), null, 2);
    } catch {
      // Try next candidate.
    }
  }

  return decodedRaw;
};

export const parseHeadMetaMap = (fullHead?: string) => {
  const map: Record<string, string> = {};
  if (!fullHead) return map;

  const metaTags = fullHead.match(/<meta\b[^>]*>/gi) || [];

  for (const tag of metaTags) {
    const attrs: Record<string, string> = {};
    const attrRegex = /([:@a-zA-Z0-9_-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let match: RegExpExecArray | null;

    while ((match = attrRegex.exec(tag))) {
      attrs[match[1].toLowerCase()] = match[3] ?? match[4] ?? "";
    }

    const key = attrs.property || attrs.name;
    if (key && attrs.content) {
      map[key] = decodeHtmlEntities(attrs.content);
    }
  }

  return map;
};

export const rewriteSeoDomains = (
  seo: any,
  baseUrl?: string,
  backendUrl?: string,
  backendHostname?: string
) => {
  if (!seo) return seo;

  const canonicalUrl = replaceDomain(
    seo.canonicalUrl,
    baseUrl,
    backendUrl,
    backendHostname
  );
  const ogUrl = replaceDomain(
    seo.openGraph?.url,
    baseUrl,
    backendUrl,
    backendHostname
  );

  let jsonLdRaw = seo.jsonLd?.raw;
  if (jsonLdRaw && baseUrl) {
    try {
      const normalizedRaw = stripScriptWrapper(jsonLdRaw);
      const decodedRaw = decodeHtmlEntities(normalizedRaw);
      const parsed = JSON.parse(decodedRaw);
      const walk = (node: any) => {
        if (Array.isArray(node)) {
          node.forEach(walk);
          return;
        }
        if (node && typeof node === "object") {
          Object.keys(node).forEach((key) => {
            const value = node[key];
            if (typeof value === "string") {
              if (value.startsWith("http") && !isImageUrl(value)) {
                node[key] = replaceDomain(
                  value,
                  baseUrl,
                  backendUrl,
                  backendHostname
                );
              }
            } else {
              walk(value);
            }
          });
        }
      };
      walk(parsed);
      jsonLdRaw = JSON.stringify(parsed);
    } catch {
      // Keep raw schema output when parsing fails.
    }
  }

  return {
    ...seo,
    canonicalUrl,
    openGraph: {
      ...seo.openGraph,
      url: ogUrl,
    },
    jsonLd: seo.jsonLd
      ? {
          ...seo.jsonLd,
          raw: jsonLdRaw,
        }
      : seo.jsonLd,
  };
};

const buildFrontendUrl = (fallbackPath: string, backendUrl?: string | null) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return backendUrl || fallbackPath;

  try {
    if (backendUrl) {
      const parsed = new URL(backendUrl);
      return new URL(
        `${parsed.pathname}${parsed.search}${parsed.hash}`,
        baseUrl
      ).toString();
    }

    return new URL(fallbackPath, baseUrl).toString();
  } catch {
    return backendUrl || fallbackPath;
  }
};

export async function fetchSingleBlogPost(slug: string) {
  const { post } = await fetchGraphQL<SingleBlogResponse>(print(SingleBlogQuery), {
    slug,
  });

  return post;
}

export function buildSingleBlogViewModel(post: any): SingleBlogViewModel {
  const rewrittenSeo = rewriteSeoDomains(
    post?.seo,
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    process.env.NEXT_PUBLIC_WORDPRESS_API_HOSTNAME
  );

  return {
    post,
    rewrittenSeo,
    headMeta: parseHeadMetaMap(rewrittenSeo?.fullHead),
    formattedJsonLd: prettifyJsonLd(rewrittenSeo?.jsonLd?.raw),
  };
}

export async function getSingleBlogViewModel(slug: string) {
  const post = await fetchSingleBlogPost(slug);
  if (!post) return null;
  return buildSingleBlogViewModel(post);
}

export async function getSingleBlogMetadata(slug: string): Promise<Metadata> {
  try {
    const post = await fetchSingleBlogPost(slug);

    if (!post) {
      return { title: "Post Not Found" };
    }

    const rewrittenSeo = rewriteSeoDomains(
      post.seo,
      process.env.NEXT_PUBLIC_BASE_URL,
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
      process.env.NEXT_PUBLIC_WORDPRESS_API_HOSTNAME
    );

    const canonicalUrl = buildFrontendUrl(`/blog/${slug}`, post.seo?.canonicalUrl);
    const openGraphUrl = buildFrontendUrl(
      `/blog/${slug}`,
      post.seo?.openGraph?.url || post.seo?.canonicalUrl
    );

    return {
      title: rewrittenSeo?.title || post.title || "Blog Post",
      description: rewrittenSeo?.description || post.excerpt,
      robots: post.seo?.robots
        ? {
            index: !post.seo.robots.includes("noindex"),
            follow: !post.seo.robots.includes("nofollow"),
          }
        : undefined,
      alternates: {
        canonical: canonicalUrl || undefined,
      },
      openGraph: {
        title: rewrittenSeo?.openGraph?.title || post.title,
        description: rewrittenSeo?.openGraph?.description || post.excerpt,
        url: openGraphUrl || undefined,
        siteName: rewrittenSeo?.openGraph?.siteName,
        locale: rewrittenSeo?.openGraph?.locale,
        type: (rewrittenSeo?.openGraph?.type as any) || "article",
        publishedTime:
          rewrittenSeo?.openGraph?.articleMeta?.publishedTime || post.date,
        modifiedTime:
          rewrittenSeo?.openGraph?.articleMeta?.modifiedTime || post.modified,
        images: rewrittenSeo?.openGraph?.image?.url
          ? [
              {
                url: rewrittenSeo.openGraph.image.url,
                secureUrl:
                  rewrittenSeo.openGraph.image.secureUrl ||
                  rewrittenSeo.openGraph.image.url,
                width: rewrittenSeo.openGraph.image.width,
                height: rewrittenSeo.openGraph.image.height,
                type: rewrittenSeo.openGraph.image.type,
                alt: post.featuredImage?.node?.altText || post.title,
              },
            ]
          : [],
      },
      twitter: {
        card: (post.seo?.openGraph?.twitterMeta?.card as any) || "summary_large_image",
        title:
          rewrittenSeo?.openGraph?.twitterMeta?.title ||
          rewrittenSeo?.title ||
          post.title,
        description:
          rewrittenSeo?.openGraph?.twitterMeta?.description ||
          rewrittenSeo?.description ||
          post.excerpt,
        site: rewrittenSeo?.openGraph?.twitterMeta?.site || undefined,
        creator: rewrittenSeo?.openGraph?.twitterMeta?.creator || undefined,
        images: rewrittenSeo?.openGraph?.twitterMeta?.image
          ? [rewrittenSeo.openGraph.twitterMeta.image]
          : [],
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { title: "Blog Post" };
  }
}
