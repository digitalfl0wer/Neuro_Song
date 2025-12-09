"use client";

import { useState } from "react";
import { ControlsSection } from "./ControlsSection";
import { ResultCard } from "./ResultCard";
import { FeedbackWidget } from "./FeedbackWidget";
import { StageProgression, type StageKey } from "./StageProgression";
import {
  saveFavorite,
  removeFavorite,
  isFavorite,
  generateVerseId,
  type SavedVerse,
} from "@/lib/favorites";

  const curatedCategories = [
    {
      label: "Neuroplasticity Sparks",
      items: [
        {
          topic: "Hebbian sparks ignite creativity",
          rationale:
            "Dive into how repeated applause between neurons strengthens the circuits that fuel new ideas.",
        },
        {
          topic: "Practice doubles synaptic dancing",
          rationale:
            "Look at how deliberate repetition lights the same pathways so they become the default route.",
        },
        {
          topic: "Chunking info for adaptive recall",
          rationale:
            "Break long lessons into vivid chunks so working memory hands them to long-term networks with ease.",
        },
      ],
    },
    {
      label: "Mindfulness & Flow",
      items: [
        {
          topic: "Mindful habits rewire synapses",
          rationale:
            "Pair breath, body, and focus to gently rewire attention networks without burning out learners.",
        },
        {
          topic: "Flow states tune the default mode network",
          rationale:
            "Witness how deep engagement mutes the DMN so creative problem solving can rise instead of overthinking.",
        },
        {
          topic: "Movement anchors adaptive memory",
          rationale:
            "Connect energy and recall by pacing ideas with rhythm—the body scaffolds the brain's plasticity.",
        },
      ],
    },
    {
      label: "Sensation & Chemistry",
      items: [
        {
          topic: "Sensory memory sticks through rhythm",
          rationale:
            "Use beats, visuals, or scents to attach meaning to sensory neurons and strengthen recall pathways.",
        },
        {
          topic: "Neurochemistry in learning leaps",
          rationale:
            "Map how dopamine rewards and acetylcholine sharpens attention every time you practice deeply.",
        },
        {
          topic: "Sleep and reconsolidation for recall",
          rationale:
            "Explore how nocturnal replay and slow-wave sleep seal the synaptic patterns your day built.",
        },
      ],
    },
    {
      label: "Metaphysics + Identity",
      items: [
        {
          topic: "Align identity with adaptive beliefs",
          rationale:
            "Study how rewriting self-narratives influences synaptic strength so your identity reflects your goals.",
        },
        {
          topic: "Neuroscience of intention-setting rituals",
          rationale:
            "Merge symbolic rituals with neuroplastic training to anchor intentions inside the limbic system.",
        },
        {
          topic: "Metaphysical cues for resilient focus",
          rationale:
            "Use archetypes and meaning-rich cues to activate powerful neural schemas that keep you aligned with truth.",
        },
      ],
    },
  ];

const STAGE_MESSAGES: Record<StageKey, string> = {
  topic: "Refine your topic idea before locking it in.",
  approval: "Topic locked in. Generate once you're ready for the verse.",
  verse: "Verse approved! The explanation is captured for review.",
};

const STAGE_ORDER: StageKey[] = ["topic", "approval", "verse"];

export type VibeType = "upbeat" | "chill" | "mystic";
export type FormatType = "song" | "poem";
export type LengthType = "short" | "medium" | "long";

export function PromptCard() {
  const [prompt, setPrompt] = useState("");
  const [length, setLength] = useState<LengthType>("medium");
  const [vibe, setVibe] = useState<VibeType>("upbeat");
  const [format, setFormat] = useState<FormatType>("song");
  const [isLoading, setIsLoading] = useState(false);
  const [verseResult, setVerseResult] = useState<{ verse: string; explanation?: string } | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isHearted, setIsHearted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<StageKey>("topic");
  const [stageMessage, setStageMessage] = useState(STAGE_MESSAGES.topic);
  const [topicConfirmed, setTopicConfirmed] = useState(false);
  const [topicSource, setTopicSource] = useState("");
  const [topicRationale, setTopicRationale] = useState<string | null>(null);

  const updateStage = (nextStage: StageKey, message?: string) => {
    setStage(nextStage);
    setStageMessage(message ?? STAGE_MESSAGES[nextStage]);
  };

  const resetTopicState = (message?: string) => {
    updateStage("topic", message);
    setTopicConfirmed(false);
    setIsApproved(false);
    setIsHearted(false);
    setVerseResult(null);
    setTopicRationale(null);
    setError(null);
    setTopicSource("");
  };

  const activeSlideIndex = STAGE_ORDER.indexOf(stage);
  const sliderStyle = {
    transform: `translateX(-${activeSlideIndex * 100}%)`,
  };

  const handleSubmit = async () => {
    if (stage === "topic") {
      setError("Please confirm your topic idea before generating a verse.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVerseResult(null);
    setIsApproved(false);

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, length, vibe, format }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content");
      }

      setVerseResult({
        verse: data.verse,
        explanation: data.explanation,
      });
      setIsHearted(isFavorite(data.verse));
      updateStage("verse", "Verse ready! Approve it when the melody feels right.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTopic = () => {
    if (!prompt.trim()) {
      setError("Please enter a topic before confirming.");
      return;
    }

    setTopicConfirmed(true);
    const sourceText = topicSource || "your idea";
    updateStage(
      "approval",
      `Topic idea locked in (${sourceText}). Generate the verse when you're ready.`
    );
  };

  const handleRegenerate = () => {
    handleSubmit();
  };

  const handleApprove = () => {
    setIsApproved(true);
    const sourceText = topicSource || "your idea";
    updateStage("verse", `Verse approved! ${sourceText} is locked for reference.`);
  };

  const handleTopicSuggestion = (
    topic: string,
    rationale?: string,
    categoryLabel?: string
  ) => {
    resetTopicState();
    setPrompt(topic);
    setTopicSource(categoryLabel ?? "Curated topic");
    setTopicRationale(rationale ?? "Curated idea ready for approval.");
  };

  const handleBackToTopic = () => {
    setTopicConfirmed(false);
    updateStage("topic", STAGE_MESSAGES.topic);
  };
  const handleRestartJourney = () => {
    setPrompt("");
    setTopicSource("Custom idea");
    resetTopicState("Ready when you are—pick a fresh topic.");
  };

  const handleHeart = (verse: string) => {
    if (isHearted) {
      const favorites =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("neurosong-favorites") || "[]")
          : [];
      const toRemove = favorites.find((fav: SavedVerse) => fav.verse === verse);
      if (toRemove) {
        removeFavorite(toRemove.id);
      }
      setIsHearted(false);
    } else {
      const newFavorite: SavedVerse = {
        id: generateVerseId(verse),
        verse,
        prompt,
        vibe,
        format,
        length,
        timestamp: Date.now(),
      };
      saveFavorite(newFavorite);
      setIsHearted(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-[0_0_320px] bg-white/80 rounded-3xl border border-white/40 p-6 shadow-2xl shadow-purple-900/10 lg:self-stretch">
        <StageProgression
          currentStage={stage}
          statusMessage={stageMessage}
          vertical
        />
      </div>

      <div className="relative overflow-hidden rounded-[32px] border border-gray-200 min-h-[420px] md:min-h-[480px] flex-1">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={sliderStyle}
        >
          <section className="w-full flex-shrink-0 space-y-6 p-6 bg-gradient-to-br from-[#1a092c] via-[#2b0c47] to-[#3b0f6b] min-h-[360px] md:min-h-[420px]">
            <div className="space-y-4">
              <p className="text-3xl font-extrabold text-purple-900">
                Pick a precise topic and see the rationale instantly
              </p>
              <div className="space-y-4">
                {curatedCategories.map((category) => (
                  <div key={category.label} className="space-y-2">
                    <p className="text-2xl font-bold text-white">
                      {category.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item) => (
                        <button
                          key={item.topic}
                          onClick={() =>
                            handleTopicSuggestion(
                              item.topic,
                              item.rationale,
                              category.label
                            )
                          }
                          className="text-lg font-semibold px-4 py-2 rounded-full border border-dashed border-purple-400 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {item.topic}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            {topicRationale && (
              <div
                className="rounded-2xl bg-white/90 border-l-4 border-purple-500/70 px-5 py-3 shadow-xl shadow-purple-900/40 text-purple-900 space-y-1"
                aria-live="polite"
              >
                  <p className="text-base font-bold uppercase tracking-[0.35em] text-purple-700">
                    What this explains
                  </p>
                  <p className="text-base font-semibold leading-relaxed">
                    {topicRationale}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white space-y-2">
                <p className="text-xs uppercase tracking-[0.5em] text-purple-400">
                  Selected topic
                </p>
                <p className="text-2xl font-bold">
                  {prompt || "Pick a topic above"}
                </p>
                {topicSource && (
                  <p className="text-sm text-purple-300">{topicSource}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  onClick={handleConfirmTopic}
                  disabled={!prompt.trim() || stage !== "topic"}
                  className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 text-base focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    topicConfirmed
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                  aria-label="Confirm topic idea"
                >
                  {topicConfirmed ? "Topic confirmed" : "Confirm topic idea"}
                </button>
                <p className="text-sm text-gray-500">
                  Stage progression only advances after this confirmation.
                </p>
              </div>
            </div>
          </section>

          <section className="w-full flex-shrink-0 space-y-6 p-6 bg-[#0f041c]">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-3xl font-extrabold text-white">
                      Set the vibe and bring the lyrics to life
                    </h3>
                  <button
                    onClick={handleBackToTopic}
                    className="rounded-full border border-purple-500/80 px-4 py-1 text-sm font-semibold text-purple-100 hover:bg-purple-500/20 transition"
                  >
                    ← Back to topic
                  </button>
                </div>
                <p className="text-lg text-purple-300 max-w-xl">
                  Refine tone + structure before generating your verse
                </p>
              </div>
              <ControlsSection
                length={length}
                setLength={setLength}
                vibe={vibe}
                setVibe={setVibe}
                format={format}
                setFormat={setFormat}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !prompt.trim() || stage !== "approval"}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Generate verse"
              >
                {isLoading ? "Creating your verse..." : "Generate"}
              </button>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700" role="alert">
                  {error}
                </div>
              )}
            </div>
            {(verseResult?.verse || isLoading) && (
              <ResultCard
                result={verseResult?.verse ?? null}
                explanation={verseResult?.explanation ?? null}
                isLoading={isLoading}
                vibe={vibe}
                format={format}
                onRegenerate={handleRegenerate}
                onApprove={handleApprove}
                isApproved={isApproved}
                onHeart={handleHeart}
                isHearted={isHearted}
                prompt={prompt}
                length={length}
              />
            )}
          </section>

          <section className="w-full flex-shrink-0 space-y-6 p-6 bg-[#0f041c]">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Verse approved ✨
              </h3>
              {verseResult?.verse ? (
                <>
                  <ResultCard
                    result={verseResult.verse}
                    explanation={verseResult.explanation ?? null}
                    isLoading={false}
                    vibe={vibe}
                    format={format}
                    onRegenerate={handleRegenerate}
                    onApprove={handleApprove}
                    isApproved={true}
                    onHeart={handleHeart}
                    isHearted={isHearted}
                    prompt={prompt}
                    length={length}
                  />
                  <div className="space-y-4">
                    {isApproved && <FeedbackWidget />}
                    <button
                      onClick={handleRestartJourney}
                      className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-400 py-3 text-lg font-semibold text-white shadow-2xl shadow-purple-900/40 hover:scale-[1.01] transition-transform duration-200"
                    >
                      Start a new topic
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Generate a verse in the previous stage to move this card into view.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
