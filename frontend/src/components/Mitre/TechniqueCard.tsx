import type {
  MitreTechnique,
} from "../../types/mitre";

export default function TechniqueCard({
  technique,
}: {
  technique: MitreTechnique;
}) {

  return (
    <div
      className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-xl
      p-4"
    >

      <div className="text-red-400 font-bold">
        {technique.id}
      </div>

      <div className="font-semibold">
        {technique.name}
      </div>

      <div className="text-sm text-zinc-400">
        {technique.tactic}
      </div>

    </div>
  );
}