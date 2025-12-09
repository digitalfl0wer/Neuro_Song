import { NextRequest, NextResponse } from "next/server";
import { generateVerse } from "@/lib/llm-service";

interface ApprovedTopic {
  text: string;
  approvedAt?: string;
  isUserProvided?: boolean;
}

interface RequestBody {
  prompt: string;
  length: "short" | "medium" | "long";
  vibe: "upbeat" | "chill" | "mystic";
  format: "song" | "poem";
  approvedTopic?: ApprovedTopic;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    
    // ===== VALIDATION: Prompt Text =====
    // Rules: Required, must be string, non-empty after trimming, max 1000 characters
    if (!body.prompt || typeof body.prompt !== "string" || body.prompt.trim() === "") {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const trimmedPrompt = body.prompt.trim();
    
    if (trimmedPrompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt must be 1000 characters or less" },
        { status: 400 }
      );
    }

    // ===== VALIDATION: Length Parameter =====
    // Rules: Must be one of: "short" (4 lines), "medium" (8 lines), "long" (12 lines)
    if (!["short", "medium", "long"].includes(body.length)) {
      return NextResponse.json(
        { error: "Length must be 'short', 'medium', or 'long'" },
        { status: 400 }
      );
    }

    // ===== VALIDATION: Vibe Parameter =====
    // Rules: Must be one of: "upbeat" (energetic tone), "chill" (calm tone), "mystic" (mystical tone)
    if (!["upbeat", "chill", "mystic"].includes(body.vibe)) {
      return NextResponse.json(
        { error: "Vibe must be 'upbeat', 'chill', or 'mystic'" },
        { status: 400 }
      );
    }

    // ===== VALIDATION: Format Parameter =====
    // Rules: Must be one of: "song" (musical structure), "poem" (poetic structure)
    if (!["song", "poem"].includes(body.format)) {
      return NextResponse.json(
        { error: "Format must be 'song' or 'poem'" },
        { status: 400 }
      );
    }

    // ===== GENERATE VERSE USING OPENAI =====
    const approvedTopicText = body.approvedTopic?.text?.trim() || trimmedPrompt;

    const result = await generateVerse({
      prompt: trimmedPrompt,
      approvedTopic: approvedTopicText,
      length: body.length,
      vibe: body.vibe,
      format: body.format,
    });

    // Handle errors from LLM service
    if (result.error) {
      // Determine appropriate status code based on error type
      let statusCode = 500;
      
      if (result.errorType === 'config') {
        statusCode = 503; // Service Unavailable
      } else if (result.errorType === 'rate_limit') {
        statusCode = 429; // Too Many Requests
      } else if (result.errorType === 'timeout') {
        statusCode = 504; // Gateway Timeout
      }

      return NextResponse.json(
        { error: result.error },
        { status: statusCode }
      );
    }

    // Return successful verse generation
    return NextResponse.json({
      verse: result.verse,
      explanation: result.explanation,
      metadata: {
        vibe: body.vibe,
        format: body.format,
        length: body.length,
        approvedTopic: approvedTopicText,
      },
    });

  } catch (error) {
    console.error("Error in LLM API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
