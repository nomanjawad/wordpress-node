import gql from "graphql-tag";

export const SingleCaseStudyQuery = gql`
  query SingleCaseStudyQuery($slug: ID!) {
    caseStudy(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      content
      slug
      date
      modified
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
    }
  }
`;
