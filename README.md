# NeuroSong Learning Tool


NeuroSong is a playful, high-contrast learning experience that turns neuroscience + neuroplasticity ideas into short songs or poems people actually remember. The magic is the structure. It feels like a conversation, but it behaves like a guided learning flow: pick a topic, confirm it, set a vibe, then generate a verse paired with a simple explanation that locks the concept in.

This is brain science but make it catchy, clear, and fun.

**The Core Promise**

-You don’t just “generate content.” You help someone learn something through:
-short lyrical memory hooks
-clean, approval-first pacing
-accessible, high-contrast UI
-a quick explanation that anchors the verse to real meaning

If the verse is the spark, the explanation is the grounding.


## ✨ Features

### 🧠 Comprehensive Neuroscience Coverage
Ask about **any** neuroscience or consciousness topic:
- Neuroplasticity, neural mechanisms, brain structures
- Consciousness, perception, emotions
- Meditation, sleep, dreams, altered states
- Neurochemistry, brain development, memory
- Cognitive biases, habit formation, flow states
- Brain waves, quantum consciousness, embodied cognition
- Mirror neurons, default mode network, and more!

### 🎵 Customizable Output
- **Length**: Short (4 lines), Medium (8 lines), Long (12 lines)
- **Vibe**: Upbeat bounce, Calm/mellow, Mystic
- **Format**: Song (rhythmic) or Poem (artistic)

### 🤖 AI-Powered Generation
- OpenAI GPT-4o-mini integration
- Scientifically accurate content
- Creative, memorable lyrics
- Context-aware responses
- Each verse now includes a short “What this teaches” explanation tied to the approved topic

### 💖 Favorites System
- Save verses to browser localStorage
- View all saved verses with metadata
- Organize your learning journey

### 🧭 Stage Progression
- Track Topic Idea → Approval → Verse + Explanation with visible steps
- Confirmation buttons advance stages only after explicit approvals
- Status text updates via `aria-live` for screen readers

### ✅ User Experience
- Approval flow (Regenerate or Approve)
- Feedback widget
- Loading states and error handling
- Full keyboard navigation and ARIA labels
- 
## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React hooks (client-side only)
- **AI**: OpenAI API (GPT-4o-mini)
- **Storage**: Browser localStorage (favorites)




## 📚 Documentation

- [OpenAI Setup Guide](docs/OpenAI-Setup.md) - Get started with OpenAI integration
- [Validation Rules](docs/Validation-Rules.md) - API validation documentation
- [Error Handling](docs/API-Error-Handling.md) - Complete error scenarios guide
- [Backend Summary](docs/Backend-Implementation-Summary.md) - Implementation details
- [Agent Tasks](docs/Agent-Tasks.md) - Task breakdown and status
- [PRD](docs/NeuroSong-PRD.md) - Product requirements


## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env.local` file in the project root:

```bash
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-actual-key-here

# Optional: Model configuration (defaults shown)
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=300
OPENAI_TEMPERATURE=0.8
```

See [docs/OpenAI-Setup.md](docs/OpenAI-Setup.md) for detailed setup instructions.

### 3. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   └── llm/          # LLM generation endpoint
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── Header.tsx        # App header with favorites toggle
│   ├── PromptCard.tsx    # Main prompt interface with approvals
│   ├── ControlsSection.tsx  # Length/vibe/format controls
│   ├── ResultCard.tsx    # Verse display, approval, and heart button
│   ├── SavedVersesCard.tsx  # Display saved favorite verses
│   ├── StageProgression.tsx # Tracks Topic → Approval → Verse + Explanation stages
│   └── FeedbackWidget.tsx   # Post-approval feedback
├── lib/                   # Utility functions and services
│   ├── favorites.ts      # localStorage management for saved verses
│   ├── openai.ts         # OpenAI client configuration
│   ├── prompts.ts        # Prompt engineering templates
│   └── llm-service.ts    # LLM service with error handling
├── docs/                  # Documentation
│   ├── NeuroSong-PRD.md  # Product Requirements
│   ├── Agent-Tasks.md    # Agent task breakdown
│   ├── Validation-Rules.md  # API validation documentation
│   ├── OpenAI-Setup.md   # OpenAI setup guide
│   ├── API-Error-Handling.md  # Error handling documentation
│   └── Backend-Implementation-Summary.md  # Backend implementation details
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```


