import gql from "graphql-tag";

export const LoginUserMutation = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(
      input: {
        clientMutationId: "uniqueId"
        username: $username
        password: $password
      }
    ) {
      authToken
      user {
        id
        name
      }
    }
  }
`;
