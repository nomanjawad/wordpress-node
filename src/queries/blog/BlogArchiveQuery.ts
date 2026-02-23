import gql from "graphql-tag";

export const BlogArchiveQuery = gql`
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
`;
