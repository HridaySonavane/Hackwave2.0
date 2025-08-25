import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text_input, image_input, audio_input } = body;

    const thread_id = uuidv4();

    return NextResponse.json({
      type: "start",
      thread_id: thread_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to start conversation" },
      { status: 500 }
    );
  }
}
