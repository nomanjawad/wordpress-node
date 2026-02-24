import { print } from "graphql/language/printer";
import gql from "graphql-tag";

import { ContentNode, LoginPayload } from "@/gql/graphql";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { fetchGraphQL } from "@/wordpress/functions/fetchGraphQL";

const LOGIN_USER_MUTATION = gql`
  mutation LoginUserMutation($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
    }
  }
`;

const PREVIEW_CONTENT_NODE_QUERY = gql`
  query PreviewContentNodeQuery($id: ID!, $idType: ContentNodeIdTypeEnum!, $asPreview: Boolean!) {
    contentNode(id: $id, idType: $idType, asPreview: $asPreview) {
      __typename
      databaseId
      uri
      status
    }
  }
`;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const id = searchParams.get("id");

  if (secret !== process.env.HEADLESS_SECRET || !id) {
    return new Response("Invalid token", { status: 401 });
  }

  const { login } = await fetchGraphQL<{ login: LoginPayload }>(
    print(LOGIN_USER_MUTATION),
    {
      username: process.env.WORDPRESS_PREVIEW_USER,
      password: process.env.WORDPRESS_PREVIEW_PASSWORD,
    }
  );
  const authToken = login?.authToken;
  if (!authToken) {
    return new Response("Unable to authenticate preview user", { status: 401 });
  }

  draftMode().enable();

  const { contentNode } = await fetchGraphQL<{ contentNode: ContentNode | null }>(
    print(PREVIEW_CONTENT_NODE_QUERY),
    { id, idType: "DATABASE_ID", asPreview: true },
    { Authorization: `Bearer ${authToken}` }
  );

  if (!contentNode) {
    return new Response("Invalid id", { status: 401 });
  }

  const response = NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}${
      contentNode.status === "draft"
        ? `/preview/${contentNode.databaseId}`
        : contentNode.uri
    }`,
  );

  response.headers.set("Set-Cookie", `wp_jwt=${authToken}; path=/;`);

  return response;
}
