# NeuroSong Learning Tool PRD

## Purpose
Deliver a playful, accessible MVP that turns neuroscience and neuroplasticity facts into memorable lyrical content. Learners choose length, vibe, and format, approve each generated piece, and experience a smooth rhythm-first UI. Multiple agents collaborate on specialized layers (UI, backend/LLM, auditing, debugging) to keep velocity high and quality controlled.

## Objectives
- Enable learners to request neuroscience knowledge via a single screen prompt and receive a song or poem tailored to their length and vibe preference.
- Keep the experience melodic and memorable through phrasing, mild animation cues, and approval-driven pacing.
- Prioritize accessibility and clarity so the UI works for keyboard and screen-reader users.
- Keep scope MVP-focused: no accounts, no long-term storage, one loop from prompt to approved verse.

## Agents / Responsibilities
- **UI Agent** – Build the playful prompt card, vibe/format controls, and the result/approval card; ensure visual consistency, contrast, and animations convey rhythm without overwhelming users.
- **Model/Backend Agent** – Implement Next.js API route that validates inputs and calls the LLM, applying a fixed prompt template; manage loading/error states and caching last response for instant revisit.
- **Auditor Agent** – Review outputs for alignment with neuroplasticity topics, accessibility compliance, and tone consistency; confirm approval flow tracking and user consent before considering verse “accepted.”
- **Debugger Agent** – Investigate edge cases, ensure retries/regenerations work, monitor network failures, and keep the prompt-to-verse experience reliable before release.

## Features
1. **Prompt Input Card**
   - Text field with playful placeholder (“Ask for a brain beat”).
   - Length slider (short, medium, long) that controls verse size.
   - Format toggle (song vs poem) and vibe radio buttons (upbeat, chill, mystic).
   - Helper tips and tooltips describing how to phrase prompts.
2. **Generation Flow**
   - Submit button triggers LLM call via `/api/llm`.
   - Loading skeleton card with animated gradient.
   - Friendly error handling and fallback verse if the LLM misbehaves.
3. **Result & Approval Card**
   - Verse presented with stanza spacing, line highlights synchronized to mimic tempo.
   - Buttons for “Regenerate” and “Approve Learning”; approval required before continuing.
   - “Vibe confirmed” message referencing chosen settings.
4. **Feedback Widget**
   - Lightweight yes/no prompt (Was this verse catchy?) visible after approval to gather quick insight.

## Technical Requirements
- Next.js (app router) with React components for prompt, controls, and results.
- API route `/api/llm` responsible for request validation, formatting the LLM prompt, handling responses, and returning structured verse data.
- Local state management for current prompt, vibe, history of approved verses (client-only), and loading/error statuses.
- CSS Modules or Tailwind for consistent spacing, gradients, and accessible color contrasts.
- Optional text-highlighting animation to suggest rhythm without audio.

## Accessibility & UX
- Ensure all controls have labels, focus styles, and accessible names.
- Keyboard users can navigate the prompt card, adjust sliders/toggles, and approve verses.
- Screen-reader friendly yes/no widget for feedback.
- Tone selectors should be descriptive (“Upbeat bounce”, “Calm/mellow”, etc.).
- Maintain contrast ratios and avoid motion that can be disorienting (keep animations subtle).

## Success Criteria
- Users can complete the prompt→verse→approve loop without errors in a single session.
- Approval button is required before a verse is marked as “learned”; the UI acknowledges this confirmation.
- Accessibility checklist (contrast, focus, labels) passes manual review.
- Auditor confirms neuroplasticity content is accurate and lyrical tone matches selected vibe.
- Feedback widget shows at least 80% completion rate during pilot, indicating learners are engaged enough to respond.

## Next Steps
- UI agent: wireframe the single-screen layout and confirm spacing/interactions.
- Backend agent: draft the LLM prompt template, mock API responses, and stub `/api/llm`.
- Auditor agent: create a review checklist for tone/content/accessibility.
- Debugger agent: define test scenarios (network failure, empty prompt, rapid regenerations).

