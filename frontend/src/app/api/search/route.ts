import { NextResponse } from "next/server";

type SearchRequestBody = {
  message?: unknown;
};

type BackendErrorResponse = {
  error: string;
  message: string;
};

const MAX_MESSAGE_LENGTH = 500;
const BACKEND_TIMEOUT_MS = 15_000;

function getMessage(body: unknown): string | null {
  if (!body || typeof body !== "object" || !("message" in body)) return null;
  const message = (body as SearchRequestBody).message;
  return typeof message === "string" ? message.trim() : null;
}

export async function POST(request: Request): Promise<NextResponse> {
  const backendUrl = process.env.BACKEND_URL;
  const accessCode = process.env.ACCESS_CODE;

  if (!backendUrl || !accessCode) {
    return NextResponse.json(
      { error: "Server configuration error. Please check environment variables." },
      { status: 500 }
    );
  }

  try {
    const body: unknown = await request.json();
    const message = getMessage(body);

    if (!message) {
      return NextResponse.json(
        { error: "Message is required and cannot be empty." },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    const searchParams = new URLSearchParams({
      message,
      code: accessCode,
    });

    const backendBaseUrl = backendUrl.replace(/\/+$/, "");
    const response = await fetch(
      `${backendBaseUrl}/api/execute?${searchParams.toString()}`,
      { signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS) },
    );

    const data: unknown = await response.json();

    if (!response.ok) {
      const errorData = data as Partial<BackendErrorResponse>;
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch restaurant data." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const isTimeout = error instanceof DOMException && error.name === "TimeoutError";
    const isConnectionError = error instanceof TypeError && error.message.includes("fetch");

    if (isTimeout) {
      return NextResponse.json(
        { error: "The restaurant scout took too long to respond. Try again." },
        { status: 504 }
      );
    }

    if (isConnectionError) {
      return NextResponse.json(
        { error: "Unable to connect to the backend server. Please ensure it is running." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
