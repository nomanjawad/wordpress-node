# WordPress Integration Handoff

## Purpose
All WordPress GraphQL integration logic is centralized under `src/wordpress` so production migration is clean and backend-focused.

## Folder Structure
```txt
src/wordpress/
  queries/      # GraphQL documents only
  functions/    # Data functions that execute queries
  docs/         # Handoff documentation
```

## Queries
`src/wordpress/queries` contains grouped GraphQL docs:
- `blog/`
- `caseStudy/`
- `job/`
- `general/`

## Functions
`src/wordpress/functions` contains query callers and mapping logic:
- `blogArchive.ts`
- `blogPost.ts`
- `caseStudy.ts`
- `job.ts`
- `fetchGraphQL.ts`
- `slug.ts`

These are consumed by app routes/templates. Query docs remain in `src/wordpress/queries`.

### Function Usage
- `fetchGraphQL.ts`
  - `fetchGraphQL<T>(query, variables?, headers?)`
  - Core WordPress GraphQL requester.
  - Adds preview JWT automatically from `wp_jwt` cookie when draft mode is enabled.
  - Used by all other WordPress data functions and several app routes/components.
  - Call example:
```ts
import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";
import { BlogArchiveQuery } from "@/wordpress/queries/blog/BlogArchiveQuery";

const data = await fetchGraphQL<{ posts: { nodes: any[] } }>(print(BlogArchiveQuery));
```
  - Return preview:
```json
{
  "posts": {
    "nodes": [{ "id": "cG9zdDox", "title": "Post title", "slug": "post-slug" }]
  }
}
```

- `slug.ts`
  - `nextSlugToWpSlug(nextSlug: string): string`
  - Converts dynamic Next slug to WordPress-style URI (`/path/`).
  - Used in `src/app/[[...slug]]/page.tsx`.
  - Call example:
```ts
import { nextSlugToWpSlug } from "@/wordpress/functions/slug";

const wpSlug = nextSlugToWpSlug("job/web-developer");
// "/job/web-developer/"
```
  - Return preview:
```json
"/job/web-developer/"
```

- `blogArchive.ts`
  - `getBlogArchivePosts(): Promise<PostNode[]>`
  - Fetches blog archive listing.
  - Used in `src/app/blog/page.tsx`.
  - Call example:
```ts
import { getBlogArchivePosts } from "@/wordpress/functions/blogArchive";

const posts = await getBlogArchivePosts();
```
  - Return preview:
```json
[
  {
    "id": "cG9zdDox",
    "databaseId": 1,
    "title": "Post title",
    "slug": "post-slug"
  }
]
```

- `blogPost.ts`
  - `fetchSingleBlogPost(slug)`
  - `buildSingleBlogViewModel(post)`
  - `getSingleBlogViewModel(slug)`
  - `getSingleBlogMetadata(slug)`
  - Handles single blog fetching, SEO domain rewriting, head meta extraction, and JSON-LD prettification.
  - Used in `src/app/blog/[slug]/page.tsx`.
  - Call example:
```ts
import {
  getSingleBlogViewModel,
  getSingleBlogMetadata
} from "@/wordpress/functions/blogPost";

const viewModel = await getSingleBlogViewModel("top-software-companies-in-bd");
const metadata = await getSingleBlogMetadata("top-software-companies-in-bd");
```
  - Return preview (`getSingleBlogViewModel`):
```json
{
  "post": { "id": "cG9zdDox", "title": "Post title", "content": "<p>...</p>" },
  "rewrittenSeo": { "canonicalUrl": "https://your-base-url.com/post-slug/" },
  "headMeta": { "description": "SEO description", "og:title": "Post title" },
  "formattedJsonLd": "{\n  \"@context\": \"https://schema.org\",\n  ...\n}"
}
```

- `caseStudy.ts`
  - `getCaseStudyArchiveItems(): Promise<CaseStudyNode[]>`
  - `getSingleCaseStudy(slug): Promise<CaseStudyNode | null>`
  - Fetches case study archive + single item.
  - Used in:
    - `src/app/case-study/page.tsx`
    - `src/app/case-study/[slug]/page.tsx`
  - Call example:
```ts
import {
  getCaseStudyArchiveItems,
  getSingleCaseStudy
} from "@/wordpress/functions/caseStudy";

const items = await getCaseStudyArchiveItems();
const one = await getSingleCaseStudy("my-case-study");
```
  - Return preview (`getSingleCaseStudy`):
```json
{
  "id": "cG9zdDoz",
  "databaseId": 3,
  "title": "Case Study title",
  "slug": "my-case-study",
  "categories": { "nodes": [{ "name": "Category A" }] },
  "featuredImage": { "node": { "sourceUrl": "https://..." } }
}
```

- `job.ts`
  - `getJobArchiveItems(): Promise<JobNode[]>`
  - `getSingleJob(slug): Promise<JobNode | null>`
  - Fetches job archive + single item (including featured image, terms, and ACF `jobsinfo.deadline`).
  - Used in:
    - `src/app/job/page.tsx`
    - `src/app/job/[slug]/page.tsx`
  - Call example:
```ts
import { getJobArchiveItems, getSingleJob } from "@/wordpress/functions/job";

const jobs = await getJobArchiveItems();
const job = await getSingleJob("web-developer");
```
  - Return preview (`getSingleJob`):
```json
{
  "id": "cG9zdDo4",
  "databaseId": 8,
  "title": "Web Developer",
  "slug": "web-developer",
  "jobsinfo": { "deadline": "2026-03-15" },
  "terms": {
    "nodes": [
      { "__typename": "Depertment", "name": "Engineering" },
      { "__typename": "JobTag", "name": "Full-time" }
    ]
  }
}
```

## Environment Variables
Required for production:
- `NEXT_PUBLIC_WORDPRESS_API_URL`
- `NEXT_PUBLIC_WORDPRESS_API_HOSTNAME`
- `NEXT_PUBLIC_BASE_URL`
- `HEADLESS_SECRET`
- `WORDPRESS_PREVIEW_USER`
- `WORDPRESS_PREVIEW_PASSWORD`

## NPM Dependencies (from `package.json`)
Runtime:
- `next`
- `react`
- `react-dom`
- `graphql`
- `graphql-tag`

Dev/build:
- `typescript`
- `eslint`
- `eslint-config-next`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `@graphql-codegen/cli`
- `@graphql-codegen/client-preset`
- `@graphql-codegen/schema-ast`

## WordPress Requirements
- WPGraphQL plugin
- WPGraphQL Rank Math extension (for Rank Math SEO fields)
- ACF + WPGraphQL for ACF (for `jobsinfo.deadline` and similar custom fields)
- Fluent Forms (for form bridge endpoint flow)
- JWT secret in WordPress config using the same `HEADLESS_SECRET`

## Build/Run
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Generate GraphQL types only: `npm run codegen`
