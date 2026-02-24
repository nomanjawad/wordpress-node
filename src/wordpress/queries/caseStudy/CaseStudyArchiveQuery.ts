import gql from "graphql-tag";

export const CaseStudyArchiveQuery = gql`
  query CaseStudyArchiveQuery($first: Int = 100) {
    caseStudies(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        databaseId
        title
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
  }
`;
