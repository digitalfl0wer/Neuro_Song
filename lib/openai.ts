/**
 * OpenAI Client Configuration
 * Singleton instance for OpenAI API calls
 */

import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration constants
export const OPENAI_CONFIG = {
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '300', 10),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.8'),
} as const;

// Validate API key is present
export function validateOpenAIConfig(): { valid: boolean; error?: string } {
  if (!process.env.OPENAI_API_KEY) {
    return {
      valid: false,
      error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in .env.local',
    };
  }

  if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return {
      valid: false,
      error: 'Please replace the placeholder API key in .env.local with your actual OpenAI API key',
    };
  }

  return { valid: true };
}

