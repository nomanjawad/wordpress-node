import { NextResponse } from "next/server";
import { createHmac } from "crypto";

export const dynamic = "force-dynamic";

const getWordPressBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!baseUrl) return null;
  return baseUrl.replace(/\/$/, "");
};

const getWordPressSubmitUrl = () => {
  const baseUrl = getWordPressBaseUrl();
  if (!baseUrl) return null;

  const mode = process.env.FLUENT_SUBMIT_MODE || "native";
  if (mode === "custom") {
    return `${baseUrl}/wp-json/headless/v1/fluent-submit`;
  }

  return `${baseUrl}/wp-admin/admin-ajax.php`;
};

const getWordPressUploadUrl = () => {
  const baseUrl = getWordPressBaseUrl();
  if (!baseUrl) return null;

  const customUploadPath = process.env.FLUENT_UPLOAD_PATH || "/wp-json/headless/v1/fluent-upload";
  return `${baseUrl}${customUploadPath.startsWith("/") ? customUploadPath : `/${customUploadPath}`}`;
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

const parseResponsePayload = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  return isJson ? await response.json() : await response.text();
};

const getPayloadMessage = (payload: any): string => {
  if (!payload) return "";
  if (typeof payload === "string") return payload;

  const msg =
    payload.message ||
    payload.error ||
    payload?.data?.message ||
    payload?.data?.error ||
    payload?.fluent_response?.message ||
    "";

  if (!msg) return JSON.stringify(payload);
  return String(msg);
};

const resolveUploadedFileUrl = (payload: any) => {
  if (!payload) return "";

  if (typeof payload === "string") {
    return payload.startsWith("http") ? payload : "";
  }

  return (
    payload.url ||
    payload.file_url ||
    payload.fileUrl ||
    payload?.data?.url ||
    payload?.data?.file_url ||
    payload?.data?.fileUrl ||
    ""
  );
};

const uploadSingleFile = async ({
  uploadUrl,
  authHeaders,
  file,
  fieldName,
  formId,
}: {
  uploadUrl: string;
  authHeaders: Record<string, string>;
  file: File;
  fieldName: string;
  formId: string;
}) => {
  const uploadBody = new FormData();
  uploadBody.append("file", file, file.name);
  uploadBody.append("field_name", fieldName);
  if (formId) uploadBody.append("form_id", formId);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: authHeaders,
    body: uploadBody,
  });

  const payload = await parseResponsePayload(response);
  const url = resolveUploadedFileUrl(payload);

  if (!response.ok || !url) {
    throw new Error(
      `File upload failed for ${fieldName}: ${
        typeof payload === "string" ? payload : JSON.stringify(payload)
      }`
    );
  }

  return url;
};

export async function POST(request: Request) {
  const referer = request.headers.get("referer") || process.env.NEXT_PUBLIC_BASE_URL || "/";
  const acceptsHtml = (request.headers.get("accept") || "").includes("text/html");

  const toRedirectUrl = (
    status: "success" | "error",
    code?: number,
    message?: string
  ) => {
    try {
      const url = new URL(referer);
      url.searchParams.set("ff_submit", status);
      if (code) url.searchParams.set("ff_code", String(code));
      if (message) {
        const trimmed = message.replace(/\s+/g, " ").trim().slice(0, 400);
        url.searchParams.set("ff_error", trimmed);
      }
      return url.toString();
    } catch {
      return referer;
    }
  };

  try {
    const submitUrl = getWordPressSubmitUrl();
    const uploadUrl = getWordPressUploadUrl();
    const mode = process.env.FLUENT_SUBMIT_MODE || "native";
    const headlessSecret = process.env.HEADLESS_SECRET || "";

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

    const authHeaders: Record<string, string> =
      mode === "custom"
        ? {
            Authorization: `Bearer ${signHeadlessJwt(headlessSecret)}`,
            "X-Headless-Secret-Key": headlessSecret,
          }
        : {};

    // Custom mode: upload files first via dedicated endpoint, then submit full form payload.
    if (mode === "custom") {
      if (!uploadUrl) {
        return NextResponse.json(
          { ok: false, message: "WordPress upload URL is not configured" },
          { status: 500 }
        );
      }

      const inbound = await request.formData();
      const outbound = new FormData();
      const fileValuesByField = new Map<string, string[]>();
      const formId = String(inbound.get("form_id") || "");

      for (const [key, value] of inbound.entries()) {
        if (value instanceof File) {
          if (!value.size) continue;

          const uploadedUrl = await uploadSingleFile({
            uploadUrl,
            authHeaders,
            file: value,
            fieldName: key,
            formId,
          });

          const existing = fileValuesByField.get(key) || [];
          existing.push(uploadedUrl);
          fileValuesByField.set(key, existing);
          continue;
        }

        outbound.append(key, value);
      }

      // Keep file field keys unchanged; only replace values with uploaded URLs.
      for (const [fieldName, urls] of fileValuesByField.entries()) {
        if (urls.length === 1) {
          outbound.append(fieldName, urls[0]);
        } else if (urls.length > 1) {
          outbound.append(fieldName, JSON.stringify(urls));
        }
      }

      const response = await fetch(submitUrl, {
        method: "POST",
        headers: authHeaders,
        body: outbound,
      });

      const payload = await parseResponsePayload(response);

      if (!response.ok) {
        if (acceptsHtml) {
          return NextResponse.redirect(
            toRedirectUrl("error", response.status, getPayloadMessage(payload)),
            303
          );
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

      return NextResponse.json({ ok: true, payload });
    }

    // Native mode: proxy the original multipart request as-is.
    const incomingContentType = request.headers.get("content-type") || "";
    const response = await fetch(submitUrl, {
      method: "POST",
      headers: {
        ...(incomingContentType ? { "Content-Type": incomingContentType } : {}),
      },
      body: request.body,
      duplex: "half",
    } as any);

    const payload = await parseResponsePayload(response);

    if (!response.ok) {
      if (acceptsHtml) {
        return NextResponse.redirect(
          toRedirectUrl("error", response.status, getPayloadMessage(payload)),
          303
        );
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

    return NextResponse.json({ ok: true, payload });
  } catch (error: any) {
    if (acceptsHtml) {
      return NextResponse.redirect(
        toRedirectUrl("error", 500, error?.message || "Unhandled submission error"),
        303
      );
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
