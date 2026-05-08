import { NextRequest, NextResponse } from "next/server";

// NEXT_PUBLIC_API_URL is a server-only env var (no NEXT_PUBLIC_ prefix).
// It is never shipped to the client bundle, so the EC2 IP stays hidden.
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  // Reconstruct the target URL: strip /api-proxy and forward the rest
  const targetPath = `/${path.join("/")}`;
  const targetUrl = `${NEXT_PUBLIC_API_URL}${targetPath}${req.nextUrl.search}`;

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
      { message: "Failed to connect to backend service." },
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
