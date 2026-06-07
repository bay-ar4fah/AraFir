interface Props {
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export default function AttackSeverityBadge({
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
      className={`px-3 py-1 rounded-lg border text-sm font-semibold ${style}`}
    >
      {severity}
    </span>
  );
}