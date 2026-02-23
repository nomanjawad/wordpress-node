import gql from "graphql-tag";

export const SingleBlogQuery = gql`
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
        fullHead
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
          updatedTime
          slackEnhancedData {
            label
            data
          }
          articleMeta {
            author
            publisher
            section
            tags
            publishedTime
            modifiedTime
          }
          image {
            url
            secureUrl
            height
            width
            type
          }
          twitterMeta {
            title
            description
            card
            image
            site
            creator
            appCountry
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
