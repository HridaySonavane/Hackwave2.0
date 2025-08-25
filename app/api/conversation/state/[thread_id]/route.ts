import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { thread_id: string } }
) {
  try {
    const thread_id = params.thread_id;

    // Mock response
    const mockState = {
      thread_id: thread_id,
      state: {
        clarifier: {
          resp: [
            {
              question: "What is your primary goal with this product?",
              answer: "My goal is to help people track workouts",
            },
            {
              question: "Who is your target audience?",
              answer: "Target audience is gym enthusiasts",
            },
          ],
          done: true,
        },
      },
      clarifier_done: true,
      current_round: 2,
    };

    return NextResponse.json(mockState);
  } catch (error) {
    return NextResponse.json({ error: "Failed to get state" }, { status: 500 });
  }
}
