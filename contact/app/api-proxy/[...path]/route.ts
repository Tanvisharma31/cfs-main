import { NextRequest, NextResponse } from "next/server";

// NEXT_PUBLIC_API_URL is a server-only env var (no NEXT_PUBLIC_ prefix).
// It is never shipped to the client bundle, so the EC2 IP stays hidden.
// Fallback to hardcoded IP if env var is missing for reliability.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://52.66.43.3:5001";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  // Reconstruct the target URL: strip /api-proxy and forward the rest
  // If the path starts with 'api-proxy' (due to double prefixing), remove it
  const filteredPath = path[0] === "api-proxy" ? path.slice(1) : path;
  const targetPath = `/${filteredPath.join("/")}`;
  const targetUrl = `${BACKEND_URL}${targetPath}${req.nextUrl.search}`;

  // Forward all headers except host (which must match the target server)
  const forwardedHeaders = new Headers(req.headers);
  forwardedHeaders.delete("host");

  // Stream the request body for uploads (FormData, JSON, etc.)
  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? req.body
      : undefined;

  try {
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: forwardedHeaders,
      body: body,
      // @ts-expect-error — Node.js fetch supports duplex for streaming
      duplex: "half",
    });

    // Copy response headers back, excluding ones Next.js manages
    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.delete("content-encoding"); // Next.js handles this
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[api-proxy] Failed to reach backend:", error);
    return NextResponse.json(
      { 
        message: "Failed to connect to backend service.",
        targetUrl,
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
