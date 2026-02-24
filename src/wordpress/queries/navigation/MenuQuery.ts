import gql from "graphql-tag";

export const MenuQuery = gql`
  query MenuQuery {
    menuItems(first: 10) {
      nodes {
        uri
        target
        label
      }
    }
  }
`;
