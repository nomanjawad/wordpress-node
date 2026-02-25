import { handleFluentSubmitRequest } from "@/wordpress/functions/fluentSubmit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleFluentSubmitRequest(request);
}
