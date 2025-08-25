import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { thread_id } = body;

    if (!thread_id) {
      return NextResponse.json({ error: "Missing thread_id" }, { status: 400 });
    }

    return NextResponse.json({
      status: "workflow_started",
      thread_id: thread_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to start workflow" },
      { status: 500 }
    );
  }
}
