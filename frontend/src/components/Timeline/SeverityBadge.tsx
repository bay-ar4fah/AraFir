import type {
  TimelineSeverity,
} from "../../types/timeline";

interface Props {
  severity: TimelineSeverity;
}

export default function SeverityBadge({
  severity,
}: Props) {
  const style =
    severity === "CRITICAL"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : severity === "HIGH"
      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
      : severity === "MEDIUM"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : "bg-green-500/20 text-green-400 border-green-500/30";

  return (
    <span
      className={`px-2 py-1 rounded-md border text-xs font-semibold ${style}`}
    >
      {severity}
    </span>
  );
}