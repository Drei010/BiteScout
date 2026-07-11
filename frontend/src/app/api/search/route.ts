import { NextResponse } from "next/server";

type SearchRequestBody = {
  message: string;
};

type BackendErrorResponse = {
  error: string;
  message: string;
};

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
    const body = (await request.json()) as SearchRequestBody;

    if (!body.message || body.message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required and cannot be empty." },
        { status: 400 }
      );
    }

    const searchParams = new URLSearchParams({
      message: body.message.trim(),
      code: accessCode,
    });

    const response = await fetch(
      `${backendUrl}/api/execute?${searchParams.toString()}`
    );

    const data: unknown = await response.json();

    if (!response.ok) {
      const errorData = data as BackendErrorResponse;
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch restaurant data." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const isConnectionError =
      error instanceof TypeError && error.message.includes("fetch");

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
