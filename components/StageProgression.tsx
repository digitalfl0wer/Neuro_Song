export type StageKey = "topic" | "approval" | "verse";

const STAGES: { key: StageKey; label: string; description: string }[] = [
  {
    key: "topic",
    label: "Topic Idea",
    description: "Craft the direction of your inquiry",
  },
  {
    key: "approval",
    label: "Topic Approved",
    description: "Confirm the idea so we can generate the verse",
  },
  {
    key: "verse",
    label: "Verse + Explanation",
    description: "Review the lyrical response and explanation",
  },
];

interface StageProgressionProps {
  currentStage: StageKey;
  statusMessage: string;
  vertical?: boolean;
}

function ListItem({
  stage,
  stateClasses,
  baseClasses,
  statusText,
  isComplete,
  isActive,
}: {
  stage: { key: StageKey; label: string; description: string };
  stateClasses: string;
  baseClasses: string;
  statusText: string;
  isComplete: boolean;
  isActive: boolean;
}) {
  return (
    <div className={`${baseClasses} ${stateClasses}`}>
      <p className="text-lg tracking-tight uppercase">{stage.label}</p>
      <p className="mt-1 text-base font-light">{stage.description}</p>
      {isComplete && (
        <p className="mt-3 text-sm font-semibold text-green-600">{statusText}</p>
      )}
    </div>
  );
}

export function StageProgression({
  currentStage,
  statusMessage,
  vertical = false,
}: StageProgressionProps) {
  const currentIndex = STAGES.findIndex((stage) => stage.key === currentStage);

  const baseClasses = "rounded-3xl p-5 border transition-all duration-200 flex flex-col gap-2";

  return (
    <div className="flex h-full flex-col gap-8" aria-live="polite">
      <div
        className={`flex ${
          vertical ? "flex-col gap-6" : "flex-row gap-6"
        } flex-wrap`}
      >
        {STAGES.map((stage, index) => {
          const isActive = index === currentIndex;
          const isComplete = index < currentIndex;

          const stateClasses = isActive
            ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white border-transparent shadow-2xl shadow-purple-900/40"
            : isComplete
            ? "bg-purple-50 text-purple-700 border-purple-200"
            : "bg-white/70 text-gray-600 border-gray-200";

          return (
            <div
              key={stage.key}
              className={`${baseClasses} ${stateClasses}`}
              aria-current={isActive ? "step" : undefined}
            >
              <p className="text-xl tracking-tight uppercase">{stage.label}</p>
              <p className="text-base font-semibold">{stage.description}</p>
              {isComplete && (
                <p className="mt-auto text-sm font-semibold text-green-600">
                  Completed
                </p>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-gray-600 leading-relaxed" role="status">
        {statusMessage}
      </p>
    </div>
  );
}
