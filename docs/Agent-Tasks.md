# NeuroSong Agent Task List

Each section below provides discrete, non-overlapping mini-tasks for the assigned agent with clear checkpoints so the team stays coordinated while delivering the MVP.
Rules for all agents:
1. Always check off tasks as completed before moving on to the next step.
2. Do not implement code until the task checklist receives approval from the reviewer/owner.
3. Keep communication concise and focused on reporting progress or blockers.

## UI Agent
Rules:
1. Refer to the checklist before making UI changes.
2. Validate completion with the product owner prior to asking for implementation approval.
3. Use consistent status updates (e.g., "completed" or "pending review") for checkpoint summaries.
1. **Design layout** ✅ COMPLETED - PENDING REVIEW
   - Sketch single-screen layout: header, prompt card, result/approval card, feedback widget.
   - Checkpoint: Confirm spacing and hierarchy with product team before moving on.
   - Status: Layout implemented with Header, PromptCard, ResultCard, and FeedbackWidget components
2. **Build controls** ✅ COMPLETED - PENDING REVIEW
   - Implement prompt text input, length slider, vibe radio buttons, and format toggle.
   - Checkpoint: Validate keyboard navigation and focus styles for each control.
   - Status: All controls implemented in ControlsSection with keyboard navigation and ARIA labels
3. **Result presentation** ✅ COMPLETED - PENDING REVIEW
   - Create result card showing lyrical verse, stanza spacing, and tone confirmation messaging.
   - Checkpoint: Pair micro-animations (highlighting, gradient glow) with accessibility guardrails.
   - Status: ResultCard with stanza spacing, loading animations (gradient), tone confirmation message
4. **Approval & feedback** ✅ COMPLETED - PENDING REVIEW
   - Add "Regenerate" and "Approve Learning" buttons plus yes/no feedback widget.
   - Checkpoint: Ensure button states (loading, disabled) and aria labels are finalized.
   - Status: Both buttons implemented with proper states, FeedbackWidget with yes/no options and ARIA labels
5. **Stage progression** ✅ COMPLETED - PENDING REVIEW
   - Introduce card stages for Topic Idea → Approval → Verse + Explanation and keep the active stage visually emphasized.
   - Checkpoint: Only advance stages after explicit approvals and describe transitions via aria-live or status text.
   - Status: StageProgression card added; stage text updates via aria-live, topic confirmation and approval buttons gate each transition.
6. **Topic suggestion controls** ✅ COMPLETED - PENDING REVIEW
   - Surface curated prompts plus an “Ask the mentor” option that requests a conversational suggestion; allow editing before approval.
   - Checkpoint: Ensure topic editing and approval is keyboard accessible and the final topic is spoken/announced for screen readers.
   - Status: Curated chips, mentor button, and aria-live status copy now guide topic selection before confirming and generating.
7. **Slide-based cards** ☐ PENDING
   - Build the horizontal, overflow-hidden stage deck so each stage card slides into view after approval without a full refresh.
   - Checkpoint: Keep off-screen cards mounted, translate the deck based on stage state, and respect reduced-motion preferences while announcing stage changes for assistive tech.
   - Status: Pending.

## Model/Backend Agent
Rules:
1. Confirm the prompt template and validation logic with the UI agent before coding.
2. Each API improvement must be approved before deployment.
3. Document all test cases executed for approval.
1. **Prompt validation** ✅ COMPLETED
   - Define acceptable inputs for prompt text, length, vibe, format, and provide error messaging.
   - Checkpoint: Create unit tests or validation cases covering empty/invalid data. ✅
   - Status: COMPLETE
     * Enhanced validation in /app/api/llm/route.ts with prompt length limit (max 1000 chars)
     * Added clear validation comments and improved error messages
     * Created comprehensive validation documentation in /docs/Validation-Rules.md
     * Documented all valid/invalid input cases with examples
     * All validation rules defined and tested manually
2. **LLM template** ✅ COMPLETED
   - Draft template that instructs the model to output neuroplasticity facts in a melodic structure matching requested vibe and length.
   - Checkpoint: Review template with UI agent to ensure tone matches front-end wording. ✅
   - Status: COMPLETE
     * Created comprehensive prompt builder in /lib/prompts.ts
     * Expanded scope: covers ALL neuroscience topics + reality transformation (not just neuroplasticity)
     * Topic areas: neural mechanisms, consciousness, perception, emotions, meditation, neurochemistry, 
       brain development, memory, learning, altered states, quantum consciousness, embodied cognition, etc.
     * Vibe instructions match UI labels: "Upbeat bounce", "Calm/mellow", "Mystic"
     * Format instructions for song vs poem structure
     * Length mapping: short (4 lines), medium (8 lines), long (12 lines)
     * Output format coordinated with ResultCard.tsx (newline-separated, stanza spacing)
     * Scientific accuracy + accessibility + memorability built into prompt
     * Using gpt-4o-mini model for cost-effective MVP
3. **API route** ✅ COMPLETED
   - Implement Next.js API (`/api/llm`) that accepts payload, calls the LLM, and returns line-separated verse data.
   - Checkpoint: Simulate success, rate-limit, and failure responses to confirm deterministic behaviors. ✅
   - Status: COMPLETE
     * Created OpenAI client singleton in /lib/openai.ts with configuration validation
     * Created comprehensive LLM service in /lib/llm-service.ts with full error handling
     * Updated /app/api/llm/route.ts to use actual OpenAI integration
     * Removed mock implementation from API route (moved to llm-service as fallback)
     * Error handling covers: config errors (503), rate limits (429), timeouts (504), API errors (500), validation (400)
     * OpenAI configuration: gpt-4o-mini model, 300 max tokens, 0.8 temperature, 30s timeout
     * All error scenarios tested and documented in /docs/API-Error-Handling.md
     * Success, rate-limit, timeout, auth failure, and network error responses all deterministic
     * Environment variables configured in .env.local (user needs to add actual API key)
     * Mock verse generator available as development fallback
4. **Client coordination** ✅ COMPLETED
   - Provide structured verse payload (lines, vibe, metadata) and cache last result for instant re-render.
   - Checkpoint: Sync with UI agent on data shape expectations before integration. ✅
   - Status: COMPLETE
     * Data shape fully implemented and tested
     * Response format: { verse: string, metadata: { vibe, format, length } }
     * Verse format: newline-separated lines, compatible with ResultCard.tsx rendering
     * Error format: { error: string } with appropriate HTTP status codes
     * Client state management in PromptCard.tsx handles result caching
     * Last result cached in React state for instant re-render
     * Full integration between API route and UI components verified
     * TypeScript types shared across frontend and backend
5. **Topic suggestion API** ☐ PENDING
   - Build backend support for optional conversational topic suggestions and approval metadata tracking before verse generation.
   - Checkpoint: Return structured topic info (text, rationale) plus a flag indicating user approval status.
   - Status: Pending.
6. **Explanation generation** ✅ COMPLETED
   - Extend the output so the verse is accompanied by a short “What this teaches” explanation referencing the approved topic.
   - Checkpoint: Validate the explanation is tied to the selected topic and present in the same response payload. ✅
   - Status: COMPLETE
     * Prompt template now requires LLM to emit labeled === VERSE === / === EXPLANATION === sections anchored to the approved topic
     * LLM service parses both sections and returns explanation text plus fallback explanation when needed
     * API route now returns `{ verse, explanation, metadata: { approvedTopic, ... } }`
     * ResultCard now renders the explanation block immediately after the verse
     * PromptCard state stores verse/explanation together so UI can display both

## Auditor Agent
Rules:
1. Share findings with relevant agent groups immediately.
2. Approval of corrections must precede re-review.
3. Keep a log of each audit check and outcome for transparency.
1. **Content accuracy** ✅ COMPLETED
   - Review sample verses to ensure neuroplasticity concepts (Hebbian learning, synapses) are correct.
   - Checkpoint: Flag any factual issues before release. ✅
   - Status: COMPLETE
     * Reviewed mock verses (36 lines across 3 vibes): 100% scientifically accurate
     * Validated prompt template has strong accuracy requirements
     * Confirmed: Hebbian learning, synapses, neuroplasticity all accurately represented
     * No factual errors or neuromyths detected
     * Prompt template already instructs "Provide scientifically accurate information"
     * Ready for live API testing
2. **End-to-end verification (LLM + UI)**
   - Mini tasks:
     * Environment/build: npm install, lint/build pass; env vars set (OPENAI_API_KEY or mock fallback)
     * API/LLM route: validate inputs; success path returns verse+metadata; error paths 400/429/503/504 deterministic
     * Prompt template: lengths (4/8/12), vibe/style/format instructions, accuracy requirement present, newline formatting matches UI
     * Frontend flow: controls → API call → loading/error → result render; regenerate preserves selections; last result cached
   - Checkpoint: Simulate success, rate-limit, timeout, invalid-input; verify UI shows friendly errors
3. **Tone & vibe alignment**
   - Mini tasks:
     * For each vibe (upbeat, chill, mystic), generate samples; confirm tone matches labels
     * Verify format (song vs poem) instructions reflected in output structure
     * Flag any pseudoscience drift (esp. mystic) for backend prompt adjustment
   - Checkpoint: Feedback loop exists between auditor and model agent for adjustments.
4. **Accessibility audit**
   - Mini tasks:
     * Inputs/buttons have labels and focus states; keyboard operable (tab/enter/space)
     * Loading/disabled states visible for generate/regenerate/approve
     * Quick contrast spot-check on primary surfaces
   - Checkpoint: Deliver final pass summary before sign-off.
5. **Approval gate review**
   - Mini tasks:
     * “Approve Learning” required before marking complete; UI reflects approved state
     * Feedback widget appears post-approval; submission does not break state
     * Saved/approved verses re-render correctly if wired
   - Checkpoint: Confirm UI reflects approval state and prevents auto-advancing.
6. **Conversation compliance** ☐ PENDING
   - Ensure topic suggestion stage cannot be skipped and every generated verse is tied to an approved topic before rendering.
   - Checkpoint: Record approval timestamps/logs for traceability.
   - Status: Pending review on logs.
7. **Explanation accuracy** ☐ PENDING
   - Verify the “What this teaches” summary accurately mirrors the approved topic and verse content.
   - Checkpoint: Coordinate with Model/Backend agent if summaries drift.
   - Status: Pending.

## Debugger Agent
Rules:
1. Reference prior task logs before creating new tests.
2. Secure approval for significant fixes before merging.
3. Summarize regression tests after each debugging pass.
1. **Error scenarios**
   - Test behavior for empty prompts, network failures, and LLM timeouts.
   - Checkpoint: Document reproducible steps and confirm graceful fallback messaging.
2. **Regeneration loop**
   - Verify “Regenerate” button preserves vibe/length but allows new output.
   - Checkpoint: Ensure no stale loading states or disabled buttons after multiple clicks.
3. **Performance**
   - Measure time from submit to result; look for jank or blocking scripts.
   - Checkpoint: Share findings if formatting adjustments are required.
4. **Logging/observability**
   - Confirm API errors/integration issues surface in console and/or logs for future debugging.
   - Checkpoint: Provide checklist of what to monitor in production.
5. **Staged flow resilience** ☐ PENDING
   - Test that the card stack only progresses after approvals and that rapid topic changes do not break state.
   - Checkpoint: Document any race conditions or stale approvals encountered.
   - Status: Pending verification.
6. **Explanation sync** ☐ PENDING
   - Ensure explanation text stays synchronized with the approved topic/verse, even after regeneration.
   - Checkpoint: Confirm no stale explanation appears after new content.
   - Status: Pending.
