/**
 * Prompt Engineering for NeuroSong Learning Tool
 * Generates prompts for OpenAI to create educational verses about neuroscience and reality transformation
 */

interface PromptConfig {
  userPrompt: string;
  length: "short" | "medium" | "long";
  vibe: "upbeat" | "chill" | "mystic";
  format: "song" | "poem";
  approvedTopic?: string;
}

// Line count mapping
const LENGTH_MAP = {
  short: 4,
  medium: 8,
  long: 12,
} as const;

// Vibe-specific instruction templates
const VIBE_INSTRUCTIONS = {
  upbeat: {
    tone: "energetic, enthusiastic, and uplifting",
    style: "Use exclamation points, active verbs, and bouncy rhythm. Create an exciting, motivational feel.",
    example: "like 'Neurons firing, connections growing strong! Synapses dancing all day long!'",
  },
  chill: {
    tone: "calm, peaceful, and flowing",
    style: "Use ellipses, gentle imagery, and smooth transitions. Create a meditative, relaxing atmosphere.",
    example: "like 'Softly now, your neurons flow... Learning gently, nice and slow...'",
  },
  mystic: {
    tone: "mystical, ethereal, and profound",
    style: "Use cosmic imagery, ancient wisdom themes, and mysterious language. Create a sense of wonder and deep knowledge.",
    example: "like 'Ancient pathways in your mind... Neural secrets you will find...'",
  },
} as const;

// Format-specific instructions
const FORMAT_INSTRUCTIONS = {
  song: {
    structure: "Create a song-like structure with consistent rhyme scheme and musical rhythm",
    requirements: "Use end rhymes, repetitive patterns, and make it feel singable",
  },
  poem: {
    structure: "Create a poetic structure with imagery and metaphor",
    requirements: "Focus on vivid descriptions, emotional resonance, and artistic expression",
  },
} as const;

/**
 * Builds the complete prompt for OpenAI
 */
export function buildNeuroSongPrompt(config: PromptConfig): string {
  const { userPrompt, length, vibe, format } = config;
  const approvedTopic = config.approvedTopic?.trim();
  
  const lineCount = LENGTH_MAP[length];
  const vibeInstructions = VIBE_INSTRUCTIONS[vibe];
  const formatInstructions = FORMAT_INSTRUCTIONS[format];

  return `You are an expert neuroscientist, consciousness researcher, and lyricist who creates memorable educational content about the brain, mind, and reality transformation.

TOPIC SCOPE:
Your expertise covers all areas of neuroscience and consciousness studies including:
- Neuroplasticity and brain adaptation
- Neural mechanisms and brain structures (neurons, synapses, neurotransmitters, brain regions)
- Learning, memory, and cognitive processes
- Consciousness and awareness
- Perception and sensory processing
- Emotions and the limbic system
- Sleep, dreams, and altered states
- Meditation and mindfulness effects on the brain
- Neurochemistry (dopamine, serotonin, oxytocin, etc.)
- Brain development and aging
- Neurogenesis and brain health
- Mind-body connection
- Reality construction and perception
- Cognitive biases and mental models
- Habit formation and behavior change
- Attention, focus, and flow states
- Brain wave states (alpha, beta, theta, delta, gamma)
- Quantum consciousness theories
- Psychoneuroimmunology
- Embodied cognition
- Mirror neurons and empathy
- Default mode network
- Any other neuroscience or consciousness-related topics

TASK:
Create educational ${format} lyrics that teach about: "${userPrompt}"

CONTENT REQUIREMENTS:
- Provide scientifically accurate information
- Include specific neuroscience terminology where appropriate
- Make complex concepts accessible and memorable
- Connect concepts to lived experience or practical applications
- Inspire curiosity and wonder about the brain and consciousness

LENGTH:
- Create exactly ${lineCount} lines
${length === "short" ? "- Keep it concise and punchy (one core concept)" : ""}
${length === "medium" ? "- Develop the concept with 1-2 key ideas" : ""}
${length === "long" ? "- Explore the topic in depth with multiple connected ideas" : ""}

VIBE: ${vibe.toUpperCase()}
- Tone: ${vibeInstructions.tone}
- Style: ${vibeInstructions.style}
- Example reference: ${vibeInstructions.example}

FORMAT: ${format.toUpperCase()}
- ${formatInstructions.structure}
- ${formatInstructions.requirements}

EXPLANATION REQUIREMENT:
- Reference the approved topic in this explanation: '{approvedTopic || userPrompt}'
- Provide a brief (2-3 sentence) summary that explains what the verse teaches and how it connects to that topic.
- Keep the explanation grounded, accessible, and consistent with the selected vibe.
- Format the response using exactly two labeled sections (verse first, explanation second):
  === VERSE ===
  [verse lines with newline separators; use blank lines for stanza breaks]

  === EXPLANATION ===
  [2-3 sentence summary]
  - Tie the explanation back to the approved topic and describe what learners should take away about neuroplasticity.
  - Keep the tone consistent with the selected vibe and mention at least one neuroscience concept that the verse covered.

OUTPUT FORMAT:
- Return ONLY the labeled sections above (verse section first, explanation section second).
- Use newline characters (\n) for every line; use double newlines (\n\n) to denote stanza spacing within the verse.
- Do not include numbering, bullet points, quotation marks, or metadata outside the labeled sections.

Now create the ${format} about "${userPrompt}" with a ${vibe} vibe:`;
}

/**
 * Validates the prompt configuration
 */
export function validatePromptConfig(config: PromptConfig): {
  valid: boolean;
  error?: string;
} {
  if (!config.userPrompt || config.userPrompt.trim().length === 0) {
    return { valid: false, error: "User prompt is required" };
  }

  if (!["short", "medium", "long"].includes(config.length)) {
    return { valid: false, error: "Invalid length parameter" };
  }

  if (!["upbeat", "chill", "mystic"].includes(config.vibe)) {
    return { valid: false, error: "Invalid vibe parameter" };
  }

  if (!["song", "poem"].includes(config.format)) {
    return { valid: false, error: "Invalid format parameter" };
  }

  return { valid: true };
}
