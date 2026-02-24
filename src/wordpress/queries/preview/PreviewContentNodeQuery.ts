import gql from "graphql-tag";

export const PreviewContentNodeQuery = gql`
  query GetContentNode($id: ID!) {
    contentNode(id: $id, idType: DATABASE_ID) {
      uri
      status
      databaseId
    }
  }
`;
