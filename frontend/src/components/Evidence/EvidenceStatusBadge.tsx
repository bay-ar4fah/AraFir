interface Props {
  status?: "ACTIVE" | "EXCLUDED";
}

export default function EvidenceStatusBadge({
  status = "ACTIVE",
}: Props) {
  const style =
    status === "EXCLUDED"
      ? "bg-red-500/10 text-red-400 border-red-500/30"
      : "bg-green-500/10 text-green-400 border-green-500/30";

  return (
    <span
      className={`
        px-2
        py-1
        rounded-md
        border
        text-xs
        font-semibold
        ${style}
      `}
    >
      {status}
    </span>
  );
}