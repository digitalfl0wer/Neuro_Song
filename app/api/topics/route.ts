import { NextRequest, NextResponse } from "next/server";
import { generateTopicSuggestion } from "@/lib/topic-service";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json().catch(() => ({}));
    const result = await generateTopicSuggestion({
      seed: typeof requestBody?.seed === "string" ? requestBody.seed : undefined,
    });

    if (result.error) {
      let statusCode = 500;
      if (result.errorType === "config") {
        statusCode = 503;
      } else if (result.errorType === "rate_limit") {
        statusCode = 429;
      } else if (result.errorType === "timeout") {
        statusCode = 504;
      }

      return NextResponse.json(
        { error: result.error },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      topic: result.topic,
      rationale: result.rationale,
    });
  } catch (error) {
    console.error("Topic suggestion API error:", error);
    return NextResponse.json(
      { error: "Unable to fetch topic suggestions at the moment." },
      { status: 500 }
    );
  }
}
