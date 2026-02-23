import gql from "graphql-tag";

export const SingleJobQuery = gql`
  query SingleJobQuery($slug: ID!) {
    job(id: $slug, idType: SLUG) {
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
`;
