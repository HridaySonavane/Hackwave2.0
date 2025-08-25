import { NextResponse } from "next/server";
// This is a streaming API route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text_input } = body;
    // Create a stream
    const stream = new ReadableStream({
      async start(controller) {
        const thread_id = crypto.randomUUID();
        const timestamp = Date.now();
        // Mock workflow steps
        const steps = [
          {
            step: "start",
            status: "success",
            data: { thread_id, timestamp },
            thread_id,
            timestamp,
          },
          {
            step: "clarifier",
            status: "success",
            data: {
              resp: [
                {
                  question: "What is your primary goal with this product?",
                  answer: text_input || "Goal",
                },
                {
                  question: "Who is your target audience?",
                  answer: "Audience",
                },
              ],
              done: true,
            },
            error: null,
            thread_id,
            timestamp,
          },
          {
            step: "product",
            status: "success",
            data: {
              product: {
                name: "Sample Product",
                features: ["Feature 1", "Feature 2"],
              },
              diagram_url: "https://example.com/diagram.png",
            },
            error: null,
            thread_id,
            timestamp,
          },
          {
            step: "customer",
            status: "success",
            data: {
              segment: "Enterprise",
              needs: ["Need 1", "Need 2"],
            },
            error: null,
            thread_id,
            timestamp,
          },
          {
            step: "engineer",
            status: "success",
            data: {
              feasibility: "High",
              timeline: "6 months",
              tech_stack: ["React", "Node.js", "MongoDB"],
            },
            error: null,
            thread_id,
            timestamp,
          },
          {
            step: "risk",
            status: "success",
            data: {
              level: "Medium",
              mitigations: ["Mitigation 1", "Mitigation 2"],
            },
            error: null,
            thread_id,
            timestamp,
          },
          {
            step: "summary",
            status: "success",
            data: {
              summary:
                "This is a comprehensive summary of the product analysis based on the provided input.",
            },
            error: null,
            thread_id,
            timestamp,
          },
        ];
        // Send each step with a delay
        for (const step of steps) {
          controller.enqueue(
            new TextEncoder().encode(JSON.stringify(step) + "\n")
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        controller.close();
      },
    });
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to stream workflow" },
      { status: 500 }
    );
  }
}
