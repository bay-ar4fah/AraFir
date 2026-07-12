import {
  CheckCircle2,
  Clock3,
  Database,
  HardDrive,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import type {
  EvidenceImageRecord,
} from "../../types/evidenceImaging";

interface Props {
  records: EvidenceImageRecord[];
}

export default function EvidenceImagingSummaryCards({
  records,
}: Props) {
  const totalImages = records.length;

  const completed = records.filter(
    (record) =>
      record.verificationStatus === "COMPLETED" ||
      record.verificationStatus === "VERIFIED"
  ).length;

  const verified = records.filter(
    (record) =>
      record.verificationStatus === "VERIFIED"
  ).length;

  const inProgress = records.filter(
    (record) =>
      record.verificationStatus === "IN_PROGRESS"
  ).length;

  const failed = records.filter(
    (record) =>
      record.verificationStatus === "FAILED"
  ).length;

  const writeBlocked = records.filter(
    (record) => record.writeBlockerUsed
  ).length;

  const cards = [
    {
      label: "Total Images",
      value: totalImages,
      icon: <HardDrive size={21} />,
      tone: "bg-cyan-500/10 text-cyan-300",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle2 size={21} />,
      tone: "bg-emerald-500/10 text-emerald-300",
    },
    {
      label: "Verified",
      value: verified,
      icon: <ShieldCheck size={21} />,
      tone: "bg-purple-500/10 text-purple-300",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: <Clock3 size={21} />,
      tone: "bg-yellow-500/10 text-yellow-300",
    },
    {
      label: "Failed",
      value: failed,
      icon: <XCircle size={21} />,
      tone: "bg-red-500/10 text-red-300",
    },
    {
      label: "Write Blocked",
      value: writeBlocked,
      icon: <Database size={21} />,
      tone: "bg-zinc-500/10 text-zinc-300",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/20"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.tone}`}
            >
              {card.icon}
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                {card.label}
              </p>

              <p className="mt-1 text-2xl font-bold text-zinc-50">
                {card.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}