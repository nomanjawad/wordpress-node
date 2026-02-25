# Fluent Forms Submission Handler

## Location
- Core handler logic: `src/wordpress/functions/fluentSubmit.ts`
- API route wrapper: `src/app/api/forms/fluent-submit/route.ts`

## Why this structure
- All WordPress integration logic stays inside `src/wordpress`.
- Next.js API route remains the public endpoint, but only delegates to the WordPress-layer function.

## Request flow
1. Browser form submits to `POST /api/forms/fluent-submit`.
2. Route calls `handleFluentSubmitRequest(request)`.
3. Handler decides mode from `FLUENT_SUBMIT_MODE`:
   - `native` (default): pass multipart payload directly to WordPress `admin-ajax.php`.
   - `custom`: upload files first to a custom WP endpoint, then submit form payload to custom submit endpoint.
4. Handler returns:
   - Redirect (`303`) with query params for browser form posts:
     - `ff_submit=success|error`
     - `ff_code=<status>`
     - `ff_error=<message>`
   - JSON response for programmatic requests.

## Modes

### Native mode
- WordPress target: `${NEXT_PUBLIC_WORDPRESS_API_URL}/wp-admin/admin-ajax.php`
- Behavior:
  - Forwards original multipart body as-is.
  - Keeps original `Content-Type`.

### Custom mode
- WordPress submit target: `${NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/headless/v1/fluent-submit`
- Upload target:
  - `${NEXT_PUBLIC_WORDPRESS_API_URL}${FLUENT_UPLOAD_PATH}`
  - default `FLUENT_UPLOAD_PATH=/wp-json/headless/v1/fluent-upload`
- Behavior:
  - Signs short-lived JWT using `HEADLESS_SECRET`.
  - Sends headers:
    - `Authorization: Bearer <jwt>`
    - `X-Headless-Secret-Key: <HEADLESS_SECRET>`
  - Uploads each file to upload endpoint.
  - Replaces file field values with uploaded file URL(s):
    - single file: plain URL string
    - multiple files: JSON string array
  - Submits transformed `FormData` to custom submit endpoint.

## Required environment variables
- `NEXT_PUBLIC_WORDPRESS_API_URL`
- `FLUENT_SUBMIT_MODE` (`native` or `custom`)
- `HEADLESS_SECRET` (required in `custom` mode)
- `FLUENT_UPLOAD_PATH` (optional; used in `custom` mode)
- `NEXT_PUBLIC_BASE_URL` (used as redirect fallback)

## Error behavior
- Browser requests (Accept: `text/html`):
  - Redirects back to referer with `ff_submit=error` and details.
- Non-browser/API requests:
  - Returns JSON with `ok: false`, HTTP status, and payload/error details.

## Success behavior
- Browser requests:
  - Redirects back with `ff_submit=success`.
- Non-browser/API requests:
  - Returns JSON `{ ok: true, payload }`.
