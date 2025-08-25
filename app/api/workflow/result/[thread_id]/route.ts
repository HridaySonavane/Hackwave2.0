import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { thread_id: string } }
) {
  try {
    const thread_id = params.thread_id;

    // Mock complete workflow result
    const mockResult = {
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
      product: {
        name: "Sample Product",
        features: ["Feature 1", "Feature 2"],
      },
      diagram_url: "https://example.com/diagram.png",
      customer: {
        segment: "Enterprise",
        needs: ["Need 1", "Need 2"],
      },
      engineer: {
        feasibility: "High",
        timeline: "6 months",
      },
      risk: {
        level: "Medium",
        mitigations: ["Mitigation 1", "Mitigation 2"],
      },
      summary: "This is a summary of the product analysis.",
      tts_file: "https://example.com/speech.mp3",
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get workflow result" },
      { status: 500 }
    );
  }
}
