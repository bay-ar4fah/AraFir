import {
  CheckCircle2,
  Clock3,
  HardDrive,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import type {
  EvidenceImageRecord,
  EvidenceImagingStatus,
} from "../../types/evidenceImaging";

interface Props {
  records: EvidenceImageRecord[];
  onStatusChange: (
    imageId: number,
    status: EvidenceImagingStatus
  ) => Promise<void>;
}

const statuses: EvidenceImagingStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "VERIFIED",
  "FAILED",
];

function formatBytes(value?: number | null) {
  if (!value) return "-";

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  let size = value;
  let unitIndex = 0;

  while (
    size >= 1024 &&
    unitIndex < units.length - 1
  ) {
    size = size / 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 1 : 2)} ${
    units[unitIndex]
  }`;
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function getStatusClass(
  status: EvidenceImagingStatus
) {
  if (status === "VERIFIED") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "COMPLETED") {
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  }

  if (status === "IN_PROGRESS") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  if (status === "FAILED") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

function getStatusIcon(
  status: EvidenceImagingStatus
) {
  if (status === "VERIFIED") {
    return <ShieldCheck size={14} />;
  }

  if (status === "COMPLETED") {
    return <CheckCircle2 size={14} />;
  }

  if (status === "IN_PROGRESS") {
    return <Clock3 size={14} />;
  }

  if (status === "FAILED") {
    return <XCircle size={14} />;
  }

  return <HardDrive size={14} />;
}

export default function EvidenceImagingTable({
  records,
  onStatusChange,
}: Props) {
  if (records.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 text-sm text-zinc-400 shadow-lg shadow-black/20">
        No evidence imaging records found for this case.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-center gap-3">
        <HardDrive
          size={22}
          className="text-cyan-300"
        />

        <div>
          <h2 className="text-lg font-bold text-zinc-100">
            Evidence Imaging Records
          </h2>

          <p className="text-xs text-zinc-500">
            Forensic image acquisition records linked to this case.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[1200px] text-left text-xs">
          <thead className="bg-zinc-950 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">
                Source
              </th>
              <th className="px-4 py-3 font-medium">
                Format
              </th>
              <th className="px-4 py-3 font-medium">
                Size
              </th>
              <th className="px-4 py-3 font-medium">
                Tool
              </th>
              <th className="px-4 py-3 font-medium">
                SHA256
              </th>
              <th className="px-4 py-3 font-medium">
                Write Blocker
              </th>
              <th className="px-4 py-3 font-medium">
                Acquired At
              </th>
              <th className="px-4 py-3 font-medium">
                Status
              </th>
              <th className="px-4 py-3 font-medium">
                Update
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800 bg-zinc-950/70">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-zinc-100">
                    {record.sourceDevice}
                  </p>

                  <p className="mt-1 text-zinc-500">
                    {record.sourceType}
                  </p>
                </td>

                <td className="px-4 py-3 font-semibold text-cyan-300">
                  {record.imageFormat}
                </td>

                <td className="px-4 py-3 text-zinc-400">
                  {formatBytes(record.imageSizeBytes)}
                </td>

                <td className="px-4 py-3 text-zinc-400">
                  {record.acquisitionTool ?? "-"}
                </td>

                <td
                  className="max-w-[220px] truncate px-4 py-3 font-mono text-[11px] text-zinc-500"
                  title={record.hashSha256 ?? "-"}
                >
                  {record.hashSha256 ?? "-"}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-1 text-[10px] font-bold ${
                      record.writeBlockerUsed
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-red-500/30 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {record.writeBlockerUsed
                      ? "YES"
                      : "NO"}
                  </span>
                </td>

                <td className="px-4 py-3 text-zinc-400">
                  {formatDateTime(record.acquiredAt)}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${getStatusClass(
                      record.verificationStatus
                    )}`}
                  >
                    {getStatusIcon(
                      record.verificationStatus
                    )}
                    {record.verificationStatus}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <select
                    value={record.verificationStatus}
                    onChange={(event) =>
                      onStatusChange(
                        record.id,
                        event.target
                          .value as EvidenceImagingStatus
                      )
                    }
                    className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-cyan-500/50"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}