import gql from "graphql-tag";

export const JobArchiveQuery = gql`
  query JobArchiveQuery($first: Int = 100) {
    jobs(first: $first, where: { status: PUBLISH }) {
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
        terms {
          nodes {
            __typename
            ... on JobTag {
              id
              name
            }
            ... on Depertment {
              id
              name
            }
          }
        }
      }
    }
  }
`;
