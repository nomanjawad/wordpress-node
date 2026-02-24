import { ContentNode } from "@/gql/graphql";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import {
  getPreviewContentNode,
  loginPreviewUser,
} from "@/wordpress/functions/preview";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const id = searchParams.get("id");

  if (secret !== process.env.HEADLESS_SECRET || !id) {
    return new Response("Invalid token", { status: 401 });
  }

  const authToken = await loginPreviewUser();

  draftMode().enable();

  const contentNode = await getPreviewContentNode({ id, authToken });

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
