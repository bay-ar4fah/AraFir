interface AttackStoryProps {
  story: string;
  confidence: number;
}

export default function AttackStory({
  story,
  confidence,
}: AttackStoryProps) {
  return (
    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-xl
        p-6
      "
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Attack Story
        </h2>

        <span
          className="
            px-3
            py-1
            rounded-lg
            bg-red-500/20
            text-red-400
            text-sm
            font-medium
          "
        >
          Confidence {confidence}%
        </span>
      </div>

      <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
        {story}
      </div>
    </div>
  );
}