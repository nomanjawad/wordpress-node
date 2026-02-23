# Blog Pages Documentation

## Overview

Two new blog pages have been created to display WordPress posts via GraphQL API:

1. **Blog Archive** (`/blog`) - Lists all published posts
2. **Single Blog Post** (`/blog/[slug]`) - Displays individual post details

## Features

### Blog Archive Page (`/blog`)

**Route:** `/blog`

**Features:**
- Lists all published posts (up to 100)
- Shows post excerpts, metadata, and author information
- Clickable links to individual posts
- JSON data viewer for each post

**Data Fetched:**
- Post ID & Database ID
- Title
- Excerpt (HTML)
- Slug
- Published date
- Last modified date
- Author name
- Author description/bio

### Single Blog Post Page (`/blog/[slug]`)

**Route:** `/blog/[slug]` (e.g., `/blog/my-first-post`)

**Features:**
- Full post content with formatting
- Complete metadata display
- SEO information (meta title, description, canonical URL)
- Featured image (if available)
- Categories and tags
- Author information with bio
- JSON data viewer
- Back to archive link

**Data Fetched:**
- Post ID & Database ID
- Title
- Content (full HTML)
- Excerpt
- Slug
- Published date
- Last modified date
- **Author Information:**
  - Name
  - Description/bio
  - Email
  - Avatar URL
- **SEO Metadata:**
  - Meta title
  - Meta description
  - Canonical URL
  - Open Graph title, description, image
  - Twitter title, description, image
- **Featured Image:**
  - Source URL
  - Alt text
  - Width & height
- **Taxonomies:**
  - Categories (name, slug)
  - Tags (name, slug)

## GraphQL Queries

### Blog Archive Query

```graphql
query BlogArchiveQuery($first: Int = 100) {
  posts(first: $first, where: { status: PUBLISH }) {
    nodes {
      id
      databaseId
      title
      excerpt
      slug
      date
      modified
      author {
        node {
          name
          description
        }
      }
    }
  }
}
```

### Single Blog Query

```graphql
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
      openGraph {
        title
        description
        image {
          url
        }
        type
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
```

**Note:** This query uses the **RankMath SEO** structure. The SEO fields are structured differently from Yoast SEO:
- `description` instead of `metaDesc`
- `canonicalUrl` instead of `canonical`
- Nested `openGraph` object with `title`, `description`, and `image`
- `breadcrumbTitle` for breadcrumb text (single string, not array)
- OpenGraph image uses `url` field (not `sourceUrl` or `altText`)

## Usage

### Accessing the Pages

1. **Blog Archive:** Navigate to `http://localhost:3001/blog`
2. **Single Post:** Click on any post title in the archive, or go directly to `http://localhost:3001/blog/[your-post-slug]`

### Navigation

A "Blog Archive" link has been added to the main navigation menu for easy access.

## WordPress Requirements

### Required Plugins

For full functionality, ensure these plugins are installed in WordPress:

1. **WPGraphQL** - Core GraphQL functionality
2. **RankMath SEO** - For SEO metadata
3. **WP GraphQL Rank Math** - To expose RankMath SEO data via GraphQL ([GitHub](https://github.com/AxeWP/wp-graphql-rank-math))

### Installing WP GraphQL Rank Math

1. Download from [GitHub releases](https://github.com/AxeWP/wp-graphql-rank-math/releases)
2. Upload to WordPress plugins directory
3. Activate the plugin
4. Configure RankMath SEO settings for your posts

### Creating Test Posts

To test the blog pages, create some posts in WordPress:

1. Go to **Posts → Add New**
2. Add title and content
3. Set a featured image (optional)
4. Add categories and tags (optional)
5. Configure SEO settings if using Yoast/RankMath
6. Click **Publish**

## Styling

The pages use inline styles for simplicity and clarity. The design includes:

- Monospace font for technical readability
- Clear sections with borders
- Color-coded information blocks
- Collapsible JSON viewers
- Responsive images

## Error Handling

Both pages include error handling:

- **Archive:** Returns empty array if no posts found
- **Single Post:** Shows 404 page if post doesn't exist
- **Metadata:** Falls back to default values if SEO data unavailable

## JSON Data Viewer

Each page includes a collapsible JSON data viewer:

- Click "View JSON Data" to expand
- Shows complete raw data from GraphQL
- Useful for debugging and API verification
- Formatted with 2-space indentation

## Future Enhancements

Potential improvements:

1. Add pagination to blog archive
2. Add search/filter functionality
3. Add related posts on single post page
4. Add comments section
5. Implement proper styling with CSS modules
6. Add loading states
7. Add social sharing buttons
8. Implement ISR (Incremental Static Regeneration)

## Testing the API

To verify the API is working:

1. Check if posts appear in the archive
2. Click on a post to view full details
3. Expand the JSON viewer to see raw data
4. Verify all metadata is present
5. Check that SEO data appears (if configured)
6. Verify featured images load correctly

## Troubleshooting

**No posts appearing:**
- Verify posts are published in WordPress
- Check `NEXT_PUBLIC_WORDPRESS_API_URL` in `.env`
- Verify WPGraphQL is installed and activated

**SEO data missing:**
- Install RankMath SEO plugin
- Install WP GraphQL Rank Math plugin
- Configure SEO settings for your posts in RankMath

**GraphQL errors about SEO fields:**
- Make sure you're using WP GraphQL Rank Math (not Yoast)
- The field structure is different:
  - Use `description` not `metaDesc`
  - Use `canonicalUrl` not `canonical`
  - OpenGraph data is nested in `openGraph { }` object

**Featured images not loading:**
- Check `NEXT_PUBLIC_WORDPRESS_API_HOSTNAME` in `.env`
- Verify images are set in WordPress posts
- Check WordPress media library permissions

## RankMath vs Yoast SEO

This project is configured for **RankMath SEO**. If you're using Yoast SEO instead:

1. Install "WPGraphQL for Yoast SEO" plugin
2. Update the GraphQL queries to use Yoast field structure:
   - `metaDesc` instead of `description`
   - `canonical` instead of `canonicalUrl`
   - Flat structure for OpenGraph (no nested object)
3. Update the `seoData.ts` utility function

**RankMath Benefits:**
- Built-in breadcrumbs support
- Better structured data
- More comprehensive OpenGraph configuration
- Focus keywords tracking
