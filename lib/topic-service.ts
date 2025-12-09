import { openai, OPENAI_CONFIG, validateOpenAIConfig } from "./openai";

export interface TopicSuggestionParams {
  seed?: string;
}

export interface TopicSuggestionResult {
  topic?: string;
  rationale?: string;
  error?: string;
  errorType?: "config" | "rate_limit" | "timeout" | "api_error";
}

const buildTopicPrompt = (seed?: string) => {
  const seedInstruction = seed
    ? `Use this focus as inspiration: "${seed}".`
    : "Feel free to suggest any neuroplasticity or neuroscience direction.";

  return `You are a playful neuroscience mentor guiding a curious learner.
${seedInstruction}
Create one conversational topic idea suitable for a short song or poem about the brain, learning, or neuroplasticity.
Frame the reply as two labelled lines:
Topic: <single, focused topic>
Rationale: <1-2 sentence explanation of why this topic is interesting and what it teaches>
Keep the tone friendly, grounded, and connected to real neuroscience terminology.`;
};

export async function generateTopicSuggestion(
  params: TopicSuggestionParams
): Promise<TopicSuggestionResult> {
  try {
    const configValidation = validateOpenAIConfig();
    if (!configValidation.valid) {
      return {
        error: configValidation.error,
        errorType: "config",
      };
    }

    const prompt = buildTopicPrompt(params.seed);

    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 120,
      temperature: 0.9,
    });

    const content = completion.choices[0]?.message?.content ?? "";
    if (!content.trim()) {
      return {
        error: "Unable to craft a topic right now. Please try again.",
        errorType: "api_error",
      };
    }

    const parsed = parseTopicSuggestion(content);
    if (!parsed.topic) {
      return {
        error: "Topic suggestion was malformed.",
        errorType: "api_error",
      };
    }

    return {
      topic: parsed.topic,
      rationale: parsed.rationale,
    };
  } catch (error: any) {
    console.error("Topic suggestion error:", error);

    if (error.status === 429) {
      return {
        error: "Too many requests. Please wait a moment and try again.",
        errorType: "rate_limit",
      };
    }

    if (error.status === 401 || error.status === 403) {
      return {
        error: "API access denied. Please check your OpenAI configuration.",
        errorType: "config",
      };
    }

    if (error.status === 400) {
      return {
        error: "Invalid request. Please try again.",
        errorType: "api_error",
      };
    }

    if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      return {
        error: "Request timed out. Please try again.",
        errorType: "timeout",
      };
    }

    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return {
        error: "Network error. Please check your connection.",
        errorType: "api_error",
      };
    }

    return {
      error: "Failed to generate a suggestion. Please try again.",
      errorType: "api_error",
    };
  }
}

function parseTopicSuggestion(content: string) {
  const topicMarker = "Topic:";
  const rationaleMarker = "Rationale:";
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  let topic = "";
  let rationale = "";

  lines.forEach((line) => {
    if (!topic && line.toLowerCase().startsWith(topicMarker.toLowerCase())) {
      topic = line.slice(topicMarker.length).trim();
      return;
    }
    if (!rationale && line.toLowerCase().startsWith(rationaleMarker.toLowerCase())) {
      rationale = line.slice(rationaleMarker.length).trim();
    }
  });

  if (!topic && lines.length > 0) {
    topic = lines[0].replace(topicMarker, "").trim();
  }

  if (!rationale && lines.length > 1) {
    rationale = lines[1].replace(rationaleMarker, "").trim();
  }

  return { topic, rationale };
}
