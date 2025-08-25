// src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  try {
    // Extract the path from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    // Remove '/api/proxy' from the path
    const path = pathSegments.slice(3).join("/");

    const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";
    const targetUrl = `${API_BASE_URL}/${path}`;

    // Copy the search params
    const searchParams = url.search;
    const finalUrl = searchParams ? `${targetUrl}${searchParams}` : targetUrl;

    const body = request.method !== "GET" ? await request.json() : undefined;

    const response = await fetch(finalUrl, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to connect to API server" },
      { status: 500 }
    );
  }
}
