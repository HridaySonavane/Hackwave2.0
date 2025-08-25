import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { thread_id, answers } = body;

    if (!thread_id || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Missing thread_id or invalid answers format" },
        { status: 400 }
      );
    }

    // Process the answer and determine if we need more questions
    const lastAnswer = answers[answers.length - 1];

    // Mock different responses based on the question number
    // In a real implementation, this would use the thread_id to track conversation state
    const mockResponses = [
      {
        resp: [
          { question: "What are the technical requirements?", answer: null },
        ],
        done: false,
      },
      {
        resp: [{ question: "What is the target audience?", answer: null }],
        done: false,
      },
      {
        resp: [], // No more questions
        done: true,
      },
    ];

    // Choose the next response or mark as done
    const responseIndex = Math.min(
      answers.length - 1,
      mockResponses.length - 1
    );
    const mockClarifier = mockResponses[responseIndex];

    return NextResponse.json({
      type: "continue",
      thread_id: thread_id,
      content: JSON.stringify(mockClarifier),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to continue clarifier" },
      { status: 500 }
    );
  }
}
