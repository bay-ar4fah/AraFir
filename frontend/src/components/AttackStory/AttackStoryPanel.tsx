import type {
  AttackStory,
} from "../../types/attackStory";

import AttackSeverityBadge
from "./AttackSeverityBadge";

interface Props {
  story: AttackStory | null;
}

export default function AttackStoryPanel({
  story,
}: Props) {
  if (!story) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <p className="text-zinc-400">
          Attack story is not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            Attack Story
          </h2>

          <p className="text-zinc-400 text-sm">
            Auto-generated investigation narrative.
          </p>
        </div>

        <AttackSeverityBadge
          severity={story.severity}
        />
      </div>

      <section className="bg-black border border-zinc-800 rounded-lg p-4">
        <h3 className="font-bold text-cyan-400">
          Executive Summary
        </h3>

        <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
          {story.executiveSummary}
        </p>
      </section>

      <section>
        <h3 className="font-bold mb-3">
          Attack Path
        </h3>

        {story.attackPath.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            No attack path generated yet.
          </p>
        ) : (
          <div className="space-y-3">
            {story.attackPath.map((item) => (
              <div
                key={item.title}
                className="bg-black border border-zinc-800 rounded-lg p-4"
              >
                <h4 className="font-semibold">
                  {item.title}
                </h4>

                <p className="text-sm text-zinc-400 mt-1">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-bold mb-3">
          Detected Techniques
        </h3>

        {story.detectedTechniques.length === 0 ? (
          <p className="text-zinc-400 text-sm">
            No MITRE techniques detected yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {story.detectedTechniques.map((item) => (
              <div
                key={item.title}
                className="bg-black border border-zinc-800 rounded-lg p-4"
              >
                <h4 className="font-semibold text-cyan-400">
                  {item.title}
                </h4>

                <p className="text-sm text-zinc-400 mt-1">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-bold mb-3">
          Recommended Actions
        </h3>

        <ul className="space-y-2">
          {story.recommendedActions.map(
            (action) => (
              <li
                key={action}
                className="text-sm text-zinc-300 bg-black border border-zinc-800 rounded-lg p-3"
              >
                {action}
              </li>
            )
          )}
        </ul>
      </section>

      <p className="text-xs text-zinc-500">
        Generated at:{" "}
        {new Date(
          story.generatedAt
        ).toLocaleString()}
      </p>
    </div>
  );
}