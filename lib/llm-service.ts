/**
 * LLM Service - Handles OpenAI API calls with comprehensive error handling
 */

import { openai, OPENAI_CONFIG, validateOpenAIConfig } from './openai';
import { buildNeuroSongPrompt } from './prompts';

export interface GenerateVerseParams {
  prompt: string;
  length: "short" | "medium" | "long";
  vibe: "upbeat" | "chill" | "mystic";
  format: "song" | "poem";
  approvedTopic?: string;
}

export interface GenerateVerseResult {
  verse?: string;
  explanation?: string;
  error?: string;
  errorType?: 'config' | 'rate_limit' | 'timeout' | 'api_error' | 'invalid_response';
}

/**
 * Generate a verse using OpenAI
 */
export async function generateVerse(
  params: GenerateVerseParams
): Promise<GenerateVerseResult> {
  try {
    // Validate OpenAI configuration
    const configValidation = validateOpenAIConfig();
    if (!configValidation.valid) {
      return {
        error: configValidation.error,
        errorType: 'config',
      };
    }

    // Build the prompt using our template
    const prompt = buildNeuroSongPrompt(params);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: OPENAI_CONFIG.temperature,
    });

    const rawContent = completion.choices[0]?.message?.content ?? '';

    if (!rawContent || rawContent.trim().length === 0) {
      return {
        error: 'Failed to generate verse. Please try again.',
        errorType: 'invalid_response',
      };
    }

    const fallbackSubject = params.approvedTopic || params.prompt;
    const { verse, explanation } = parseVerseExplanation(rawContent, fallbackSubject);

    return {
      verse,
      explanation,
    };

  } catch (error: any) {
    // Handle specific OpenAI errors
    console.error('OpenAI API Error:', error);

    // Rate limit errors (429)
    if (error.status === 429) {
      return {
        error: 'Too many requests. Please wait a moment and try again.',
        errorType: 'rate_limit',
      };
    }

    // Authentication errors (401)
    if (error.status === 401) {
      return {
        error: 'API authentication failed. Please check your API key configuration.',
        errorType: 'config',
      };
    }

    // Quota/billing errors (403)
    if (error.status === 403) {
      return {
        error: 'API access denied. Please check your OpenAI account status and billing.',
        errorType: 'config',
      };
    }

    // Invalid request errors (400)
    if (error.status === 400) {
      return {
        error: 'Invalid request. Please try a different prompt.',
        errorType: 'api_error',
      };
    }

    // Server errors (500, 502, 503)
    if (error.status >= 500) {
      return {
        error: 'OpenAI service is temporarily unavailable. Please try again in a moment.',
        errorType: 'api_error',
      };
    }

    // Timeout errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      return {
        error: 'Request timed out. Please try again.',
        errorType: 'timeout',
      };
    }

    // Network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return {
        error: 'Network error. Please check your internet connection.',
        errorType: 'api_error',
      };
    }

    // Generic fallback error
    return {
      error: 'Failed to generate verse. Please try again.',
      errorType: 'api_error',
    };
  }
}

function parseVerseExplanation(content: string, fallbackSubject: string) {
  const verseMarker = '=== VERSE ===';
  const explanationMarker = '=== EXPLANATION ===';
  let verseText = content.trim();
  let explanationText = '';

  if (content.includes(explanationMarker)) {
    const [verseSection, explanationSection] = content.split(explanationMarker);
    explanationText = explanationSection.trim();
    verseText = verseSection.replace(verseMarker, '').trim();
  } else if (content.includes(verseMarker)) {
    verseText = content.replace(verseMarker, '').trim();
  }

  if (!explanationText) {
    explanationText = `This verse explores ${fallbackSubject}.`;
  }

  return {
    verse: verseText,
    explanation: explanationText,
  };
}

/**
 * Mock verse generator (fallback for development without API key)
 */
export function generateMockVerse(params: GenerateVerseParams): string {
  const lengthMap = {
    short: 4,
    medium: 8,
    long: 12,
  };

  const lines = lengthMap[params.length];
  
  // Mock verses based on neuroscience concepts
  const verses = {
    upbeat: [
      "Neurons firing, connections growing strong!",
      "Synapses dancing all day long!",
      "Hebbian learning, what a sight!",
      "Practice makes your brain so bright!",
      "Neural pathways light the way,",
      "Building knowledge every day!",
      "Plasticity's the key you see,",
      "Your brain adapts so naturally!",
      "Dendrites branching, reaching far,",
      "You're a learning superstar!",
      "Myelin wraps around with care,",
      "Speeding signals everywhere!",
    ],
    chill: [
      "Softly now, your neurons flow...",
      "Learning gently, nice and slow...",
      "Synaptic spaces find their peace,",
      "As understanding starts to increase...",
      "Neural networks intertwine,",
      "Creating patterns, so sublime...",
      "Hebbian whispers in the mind,",
      "Leave no synapse left behind...",
      "Plasticity moves like a stream,",
      "Fulfilling every learning dream...",
      "Quiet growth within your brain,",
      "Knowledge falling like soft rain...",
    ],
    mystic: [
      "Ancient pathways in your mind...",
      "Neural secrets you will find...",
      "Mystic synapses arise,",
      "Wisdom flowing, oh so wise...",
      "Cosmic connections form and bind,",
      "Neuroplasticity's grand design...",
      "Hebbian mysteries unfold,",
      "Stories that the neurons told...",
      "Ethereal dendrites reach through space,",
      "Learning at a mystic pace...",
      "Brain waves ripple, ebb and flow,",
      "Ancient knowledge starts to grow...",
    ],
  };

  return verses[params.vibe].slice(0, lines).join("\n");
}
