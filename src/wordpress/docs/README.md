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

Note:
- `navigation`, `preview`, and `templates` query folders were removed.
- Their GraphQL docs are now inlined in the consuming files:
  - `src/components/Globals/Navigation/Navigation.tsx`
  - `src/app/api/preview/route.ts`
  - `src/components/Templates/Page/PageTemplate.tsx`
  - `src/components/Templates/Post/PostTemplate.tsx`
  - `src/app/not-found.tsx`

## Functions
`src/wordpress/functions` contains query callers and mapping logic:
- `blogArchive.ts`
- `blogPost.ts`
- `caseStudy.ts`
- `job.ts`
- `fetchGraphQL.ts`
- `slug.ts`

These are consumed by app routes/templates. Query docs remain in `src/wordpress/queries`.

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
