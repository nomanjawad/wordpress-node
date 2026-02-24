export const nextSlugToWpSlug = (nextSlug: string) =>
  nextSlug ? `/${nextSlug}/` : "/";
