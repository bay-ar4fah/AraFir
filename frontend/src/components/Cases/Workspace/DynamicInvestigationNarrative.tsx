import { BookOpen } from "lucide-react";

interface Props {
  narrative?: string;
}

export default function DynamicInvestigationNarrative({
  narrative,
}: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-3 flex items-center gap-3">
        <BookOpen className="text-indigo-300" size={22} />
        <h2 className="text-lg font-bold text-zinc-100">
          Dynamic Investigation Narrative
        </h2>
      </div>

      <p className="max-w-4xl text-sm leading-6 text-zinc-400">
        {narrative ||
          "Initial analysis indicates suspicious activity requiring deeper investigation. Evidence, timeline, MITRE mapping, and artifact relationships should be reviewed to reconstruct the attack story."}
      </p>

      <button className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-500/40 hover:text-cyan-300">
        View Full Attack Story
      </button>
    </section>
  );
}