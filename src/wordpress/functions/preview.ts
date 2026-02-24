import { print } from "graphql/language/printer";

import { ContentNode, LoginPayload } from "@/gql/graphql";
import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";
import { LoginUserMutation } from "@/wordpress/queries/preview/LoginUserMutation";
import { PreviewContentNodeQuery } from "@/wordpress/queries/preview/PreviewContentNodeQuery";

export async function loginPreviewUser(): Promise<string> {
  const { login } = await fetchGraphQL<{ login: LoginPayload }>(
    print(LoginUserMutation),
    {
      username: process.env.WP_USER,
      password: process.env.WP_APP_PASS,
    }
  );

  return login.authToken;
}

export async function getPreviewContentNode({
  id,
  authToken,
}: {
  id: string;
  authToken: string;
}): Promise<ContentNode | null> {
  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode | null }>(
    print(PreviewContentNodeQuery),
    {
      id,
    },
    { Authorization: `Bearer ${authToken}` }
  );

  return contentNode;
}
