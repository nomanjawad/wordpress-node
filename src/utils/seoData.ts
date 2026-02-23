export const setSeoData = ({ seo }: { seo: any }) => {
  if (!seo) return {};

  return {
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
    title: seo.title || "",
    description: seo.description || "",
    openGraph: {
      title: seo.openGraph?.title || seo.title || "",
      description: seo.openGraph?.description || seo.description || "",
      url: seo.canonicalUrl || "",
      images: seo.openGraph?.image?.url
        ? [
            {
              url: seo.openGraph.image.url,
            },
          ]
        : [],
      type: seo.openGraph?.type || "website",
    },
  };
};
