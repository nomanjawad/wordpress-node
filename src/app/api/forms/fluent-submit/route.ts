import { NextResponse } from "next/server";
import { createHmac } from "crypto";

export const dynamic = "force-dynamic";

const getWordPressSubmitUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!baseUrl) return null;
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const mode = process.env.FLUENT_SUBMIT_MODE || "native";

  if (mode === "custom") {
    return `${normalizedBase}/wp-json/headless/v1/fluent-submit`;
  }

  // Native Fluent Forms submit endpoint.
  return `${normalizedBase}/wp-admin/admin-ajax.php`;
};

const base64UrlEncode = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const signHeadlessJwt = (secret: string) => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    iss: "next-headless",
    iat: now,
    nbf: now - 5,
    exp: now + 120,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", secret)
    .update(unsignedToken)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${unsignedToken}.${signature}`;
};

export async function POST(request: Request) {
  const referer = request.headers.get("referer") || process.env.NEXT_PUBLIC_BASE_URL || "/";
  const toRedirectUrl = (status: "success" | "error", code?: number) => {
    try {
      const url = new URL(referer);
      url.searchParams.set("ff_submit", status);
      if (code) url.searchParams.set("ff_code", String(code));
      return url.toString();
    } catch {
      return referer;
    }
  };

  try {
    const submitUrl = getWordPressSubmitUrl();
    const headlessSecret = process.env.HEADLESS_SECRET || "";
    const mode = process.env.FLUENT_SUBMIT_MODE || "native";

    if (!submitUrl) {
      return NextResponse.json(
        { ok: false, message: "WordPress API URL is not configured" },
        { status: 500 }
      );
    }
    if (mode === "custom" && !headlessSecret) {
      return NextResponse.json(
        { ok: false, message: "HEADLESS_SECRET is not configured" },
        { status: 500 }
      );
    }

    const incomingContentType = request.headers.get("content-type") || "";

    const headers: Record<string, string> = {
      ...(incomingContentType ? { "Content-Type": incomingContentType } : {}),
    };

    if (mode === "custom") {
      headers.Authorization = `Bearer ${signHeadlessJwt(headlessSecret)}`;
      headers["X-Headless-Secret-Key"] = headlessSecret;
    }

    const requestInit: any = {
      method: "POST",
      headers,
      // Stream the original multipart payload as-is (including file boundaries).
      body: request.body,
      duplex: "half",
    };

    const response = await fetch(submitUrl, requestInit);

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();
    const acceptsHtml = (request.headers.get("accept") || "").includes("text/html");

    if (!response.ok) {
      if (acceptsHtml) {
        return NextResponse.redirect(toRedirectUrl("error", response.status), 303);
      }

      return NextResponse.json(
        {
          ok: false,
          status: response.status,
          message: "WordPress submission failed",
          payload,
        },
        { status: response.status }
      );
    }

    if (acceptsHtml) {
      return NextResponse.redirect(toRedirectUrl("success"), 303);
    }

    return NextResponse.json({
      ok: true,
      payload,
    });
  } catch (error: any) {
    const acceptsHtml = (request.headers.get("accept") || "").includes("text/html");
    if (acceptsHtml) {
      return NextResponse.redirect(toRedirectUrl("error", 500), 303);
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Unhandled submission error",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
